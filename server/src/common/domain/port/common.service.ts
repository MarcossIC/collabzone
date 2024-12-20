import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { QueryOrderEnum } from '../enum/QueryCursorOrder.enum';
import { Base } from '../models/base.domain';
import { CursorTypeEnum } from '../types/cursorType';
import { Edge, Paginated } from '../types/paginated';

export abstract class CommonService {
  /**
   * Takes a date, string or number and returns the base 64
   * representation of it
   */
  public static encodeCursor(val: Date | string | number): string {
    let str: string;

    if (val instanceof Date) {
      str = val.getTime().toString();
    } else if (typeof val === 'number' || typeof val === 'bigint') {
      str = val.toString();
    } else {
      str = val;
    }

    return Buffer.from(str, 'utf-8').toString('base64');
  }

  /**
   * Takes an instance, the cursor key and a innerCursor,
   * and generates a GraphQL edge
   */
  public static createEdge<T>(
    instance: T,
    cursor: keyof T,
    innerCursor?: string,
  ): Edge<T> {
    try {
      return {
        node: instance,
        cursor: CommonService.encodeCursor(
          innerCursor ? instance[cursor][innerCursor] : instance[cursor],
        ),
      };
    } catch (_) {
      throw new InternalServerErrorException('The given cursor is invalid');
    }
  }

  /**
   * Makes the order by query for MikroORM orderBy method.
   */
  public static getOrderBy<T>(
    cursor: keyof T,
    order: QueryOrderEnum,
    innerCursor?: string,
  ): Record<string, QueryOrderEnum | Record<string, QueryOrderEnum>> {
    return innerCursor
      ? {
          [cursor]: {
            [innerCursor]: order,
          },
        }
      : {
          [cursor]: order,
        };
  }

  public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  public decodeCursor(
    cursor: string,
    cursorType: CursorTypeEnum = CursorTypeEnum.STRING,
  ): string | number | Date {
    const str = Buffer.from(cursor, 'base64').toString('utf-8');

    switch (cursorType) {
      case CursorTypeEnum.DATE:
        const milliUnix = parseInt(str, 10);

        if (isNaN(milliUnix))
          throw new BadRequestException(
            'Cursor does not reference a valid date',
          );

        return new Date(milliUnix);
      case CursorTypeEnum.NUMBER:
        const num = parseInt(str, 10);

        if (isNaN(num))
          throw new BadRequestException(
            'Cursor does not reference a valid number',
          );

        return num;
      case CursorTypeEnum.STRING:
      default:
        return str;
    }
  }

  public abstract paginate<T>(
    instances: T[],
    currentCount: number,
    previousCount: number,
    cursor: keyof T,
    first: number,
    innerCursor?: string,
  ): Paginated<T>;
  public abstract formatTitle(title: string): string;
  public abstract validateEntity(entity: Base): Promise<void>;
  public abstract saveEntity<T extends Base>(
    repo: unknown,
    entity: T,
    message: string,
  ): Promise<T>;
  public abstract updateEntity<T extends Base>(
    repo: unknown,
    entity: T,
    message: string,
  ): Promise<T>;
  public abstract throwDuplicateError<T>(
    promise: Promise<T>,
    entity: T,
    message?: string,
  ): Promise<T>;
}
