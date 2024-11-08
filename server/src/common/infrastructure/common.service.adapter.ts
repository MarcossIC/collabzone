import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Paginated } from '../domain/types/paginated';
import { CommonService } from '../domain/port/common.service';
import { EntitySchema, QueryFailedError, Repository } from 'typeorm';
import { Base } from '../domain/models/base.domain';
import { validate } from 'class-validator';

@Injectable()
export class CommonServiceAdapter extends CommonService{

  /**
   * Takes an entity array and returns the paginated type of that entity array
   * It uses cursor pagination as recommended in https://relay.dev/graphql/connections.htm
   */
  public paginate<T>(
    instances: T[],
    currentCount: number,
    previousCount: number,
    cursor: keyof T,
    first: number,
    innerCursor?: string,
  ): Paginated<T> {
    const pages: Paginated<T> = {
      currentCount,
      previousCount,
      edges: [],
      pageInfo: {
        endCursor: '',
        startCursor: '',
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
    const len = instances.length;

    if (len > 0) {
      for (let i = 0; i < len; i++) {
        pages.edges.push(
          CommonServiceAdapter.createEdge(instances[i], cursor, innerCursor),
        );
      }
      pages.pageInfo.startCursor = pages.edges[0].cursor;
      pages.pageInfo.endCursor = pages.edges[len - 1].cursor;
      pages.pageInfo.hasNextPage = currentCount > first;
      pages.pageInfo.hasPreviousPage = previousCount > 0;
    }

    return pages;
  }
  public formatTitle(title: string): string {
    return title
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
  }

  public async validateEntity(entity: Base): Promise<void> {
    const errors = await validate(entity);

    if (errors.length > 0)
      throw new BadRequestException('Entity validation failed');
  }

  public override async saveEntity<T extends Base>(
    repo: Repository<T>,
    entity: T,
    message: string
  ): Promise<T> {
    await this.validateEntity(entity);
    return this.throwDuplicateError(repo.save(entity), entity, message);
  }
  
  public override async updateEntity<T extends Base>(
    repo: Repository<T>,
    entity: T,
    message: string
  ): Promise<T> {
    await this.validateEntity(entity);
    return this.throwDuplicateError(repo.preload(entity), entity, message);
  }

    /**
   * Checks is an error is of the code 23505, PostgreSQL's duplicate value error,
   * and throws a conflict exception
   */
    public async throwDuplicateError<T>(
      promise: Promise<T>,
      entity: T,
      message?: string,
    ): Promise<T> {
      try {
        return await promise;
      } catch (error) {
        if (error instanceof QueryFailedError) {
          // PostgreSQL
          if (error.driverError?.code === '23505') {
            throw new ConflictException(message ?? `Valor duplicado en la base de datos para: ${JSON.stringify(entity)}`);
          }
          // MySQL 
          if (error.driverError?.code === 'ER_DUP_ENTRY') {
            throw new ConflictException(message ?? `Valor duplicado en la base de datos para: ${JSON.stringify(entity)}`);
          }
        } else {
          throw new BadRequestException(error);
        }
      }
    }

    public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
      try {
        return await promise;
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
}
