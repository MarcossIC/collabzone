import { Base } from '@/common/domain/models/base.domain';
import { FilterRelationType } from '@/common/domain/types/filterRelation';
import { Creation } from '../valueobjets/creation';
import { Loader } from '../valueobjets/loader';
import { Paginated } from '@/common/domain/types/paginated';
import { CountResult } from '../valueobjets/countResult';
import { UUID } from 'crypto';

export abstract class LoaderServiceAdapter {
  /**
   * Get Entities
   *
   * Maps the entity object to the entity itself.
   */
  protected static getEntities<T extends Base, P = undefined>(
    items: Loader<T, P>[],
  ): T[] {
    const entities: T[] = [];

    for (let i = 0; i < items.length; i++) {
      entities.push(items[i].obj);
    }

    return entities;
  }

  /**
   * Get Entity IDs
   *
   * Maps the entity object to an array of IDs.
   */
  protected static getEntityIds<T extends Base, P = undefined>(
    items: Loader<T, P>[],
  ): UUID[] {
    const ids: UUID[] = [];

    for (let i = 0; i < items.length; i++) {
      ids.push(items[i].obj.id);
    }

    return ids;
  }

  /**
   * Get Relation IDs
   *
   * Maps the entity object many-to-one relation to an array of IDs.
   */
  protected static getRelationIds<T extends Base, P = undefined>(
    items: Loader<T, P>[],
    relationName: string,
  ): UUID[] {
    const ids: UUID[] = [];

    for (let i = 0; i < items.length; i++) {
      ids.push(items[i].obj[relationName].id);
    }

    return ids;
  }

  /**
   * Get Entity Map
   *
   * Turns an array of entity objects into a map of entity objects
   * with its ID as the key.
   */
  protected static getEntityMap<T extends Base>(entities: T[]): Map<UUID, T> {
    const map = new Map<UUID, T>();

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      map.set(entity.id, entity);
    }

    return map;
  }

  /**
   * Get Results
   *
   * Maps an array of IDs to corresponding entities from a map.
   */
  protected static getResults<T>(
    ids: UUID[],
    map: Map<UUID, T>,
    defaultValue: T | null = null,
  ): T[] {
    const results: T[] = [];

    for (let i = 0; i < ids.length; i++) {
      results.push(map.get(ids[i]) ?? defaultValue);
    }

    return results;
  }

  /**
   * Get Counter Results
   *
   * Maps entity IDs to count results from raw data.
   */
  protected static getCounterResults(
    ids: UUID[],
    raw: CountResult[],
  ): number[] {
    const map = new Map<UUID, number>();

    for (let i = 0; i < raw.length; i++) {
      const count = raw[i];
      map.set(count.id, count.count);
    }

    return LoaderServiceAdapter.getResults(ids, map, 0);
  }

  /**
   * Basic Counter
   *
   * Counts related child entities for given parent entities.
   */
  protected abstract basicCounter<T extends Base, C extends Base>(
    data: Loader<T>[],
    parent: new () => T,
    child: new () => C,
    childRelation: keyof C,
  ): Promise<number[]>;

  protected abstract pivotCounter<T extends Base, P extends Creation>(
    data: Loader<T>[],
    parent: new () => T,
    pivot: new () => P,
    pivotParent: keyof P,
    pivotChild: keyof P,
  ): Promise<number[]>;

  protected abstract pivotPaginator<
    T extends Base,
    P extends Creation,
    C extends Base,
  >(
    data: Loader<T, FilterRelationType>[],
    parent: new () => T,
    pivot: new () => P,
    pivotName: keyof T,
    pivotParent: keyof P,
    pivotChild: keyof P,
    cursor: keyof C,
  ): Promise<Paginated<C>[]>;

  protected abstract getExistence<T extends Base>(
    data: Loader<T, FilterRelationType>[],
    parent: new () => T,
    fromCondition: string,
  ): Promise<boolean[]>;
}
