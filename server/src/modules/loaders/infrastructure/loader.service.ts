import { Injectable } from '@nestjs/common';
import { Loader } from '../domain/valueobjets/loader';
import { Base } from '@/common/domain/models/base.domain';
import { CountResult } from '../domain/valueobjets/countResult';
import { EntityManager } from 'typeorm';
import { Creation } from '../domain/valueobjets/creation';
import { CommonService } from '@/common/domain/port/common.service';
import { FilterRelationType } from '@/common/domain/types/filterRelation';
import { Paginated } from '@/common/domain/types/paginated';
import { ExistenceResult } from '../domain/valueobjets/existenceResult';
import { LoaderServiceAdapter } from '../domain/ports/loader.service.adapter';
import { UUID } from 'crypto';

@Injectable()
export class LoadersService extends LoaderServiceAdapter {
  constructor(
    private readonly em: EntityManager,
    private readonly commonService: CommonService,
  ) {
    super();
  }

  protected async basicCounter<T extends Base, C extends Base>(
    data: Loader<T>[],
    parent: new () => T,
    child: new () => C,
    childRelation: keyof C,
  ): Promise<number[]> {
    if (data.length === 0) return [];

    const ids = LoadersService.getEntityIds(data);

    const subQuery = this.em
      .createQueryBuilder()
      .select('COUNT(c.id)', 'count')
      .from(child, 'c')
      .where(`c.${String(childRelation)} = p.id`)
      .getQuery();
    const raw: CountResult[] = await this.em
      .createQueryBuilder()
      .select('p.id', 'id')
      .addSelect(`(${subQuery})`, 'count')
      .from(parent, 'p')
      .where('p.id IN (:...ids)', { ids })
      .groupBy('p.id')
      .getRawMany();

    return LoadersService.getCounterResults(ids, raw);
  }

  /**
   * Pivot Counter
   *
   * Loads the count of many-to-many relationships through a pivot table.
   * @param data Array of loaders containing the parent entities
   * @param parent Parent entity class
   * @param pivot Pivot entity class
   * @param pivotParent Name of the parent relation in pivot entity
   * @param pivotChild Name of the child relation in pivot entity
   * @returns Array of counts corresponding to each parent entity
   */
  protected async pivotCounter<T extends Base, P extends Creation>(
    data: Loader<T>[],
    parent: new () => T,
    pivot: new () => P,
    pivotParent: keyof P,
    pivotChild: keyof P,
  ): Promise<number[]> {
    // Si no hay datos, retornamos array vacío
    if (data.length === 0) return [];

    const strPivotChild = String(pivotChild);
    const strPivotParent = String(pivotParent);
    const ids = LoadersService.getEntityIds(data);

    // Creamos la subconsulta para contar las relaciones en la tabla pivot
    const subQuery = this.em
      .createQueryBuilder()
      .select('COUNT(pt.id)', 'count')
      .from(pivot, 'pt')
      .where(`pt.${strPivotParent}_id = p.id`)
      .getQuery();

    // Consulta principal que obtiene los conteos para cada entidad padre
    const raw: CountResult[] = await this.em
      .createQueryBuilder()
      .select('p.id', 'id')
      .addSelect(`(${subQuery})`, 'count')
      .from(parent, 'p')
      .where('p.id IN (:...ids)', { ids })
      .groupBy('p.id')
      .getRawMany();

    // Utilizamos el método helper existente para mapear los resultados
    return LoadersService.getCounterResults(ids, raw);
  }

  /**
   * Pivot Paginator
   *
   * Loads paginated many-to-many relationships
   * @param data Array of loaders containing the parent entities and pagination params
   * @param parent Parent entity class
   * @param pivot Pivot entity class
   * @param pivotName Name of the relation in parent entity
   * @param pivotParent Name of the parent relation in pivot entity
   * @param pivotChild Name of the child relation in pivot entity
   * @param cursor Field to use as cursor for ordering
   * @returns Array of paginated results for each parent entity
   */
  protected async pivotPaginator<
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
  ): Promise<Paginated<C>[]> {
    if (data.length === 0) return [];

    // Extraemos los parámetros de paginación
    const { first, order } = data[0].params;
    const ids = LoadersService.getEntityIds(data);

    // Convertimos las keys a strings para usar en queries
    const strPivotName = String(pivotName);
    const strPivotChild = String(pivotChild);
    const strPivotParent = String(pivotParent);

    // Subconsulta para obtener el conteo total
    const countSubQuery = this.em
      .createQueryBuilder()
      .select('COUNT(pt.id)', 'count')
      .from(pivot, 'pt')
      .where(`pt.${strPivotParent}_id = p.id`)
      .getQuery();

    // Subconsulta para obtener las entidades relacionadas paginadas
    const pivotSubQuery = this.em
      .createQueryBuilder()
      .select('pc.id')
      .from(pivot, 'pt')
      .leftJoin(`pt.${strPivotChild}`, 'pc')
      .where(`pt.${strPivotParent}_id = p.id`)
      .orderBy(`pc.${String(cursor)}`, order === 'ASC' ? 'ASC' : 'DESC')
      .limit(first)
      .getQuery();

    // Consulta principal
    const results = await this.em
      .createQueryBuilder(parent, 'p')
      .select('p.id', 'id')
      .addSelect(`(${countSubQuery})`, 'count')
      .leftJoinAndSelect(`p.${strPivotName}`, 'e')
      .leftJoinAndSelect(`e.${strPivotChild}`, 'f')
      .where('p.id IN (:...ids)', { ids })
      .andWhere(`f.id IN (${pivotSubQuery})`)
      .orderBy(`f.${String(cursor)}`, order === 'ASC' ? 'ASC' : 'DESC')
      .groupBy('p.id')
      .addGroupBy('e.id')
      .addGroupBy('f.id')
      .getRawAndEntities();

    // Procesamos los resultados
    const map = new Map<UUID, Paginated<C>>();

    for (const result of results.entities) {
      const rawResult = results.raw.find((r) => r.id === result.id);
      const pivots = result[strPivotName] as P[];
      const entities: C[] = pivots.map((pivot) => pivot[strPivotChild] as C);

      map.set(
        result.id,
        this.commonService.paginate(
          entities,
          rawResult?.count || 0,
          0,
          cursor,
          first,
        ),
      );
    }

    // Retornamos los resultados paginados
    return LoadersService.getResults(
      ids,
      map,
      this.commonService.paginate([], 0, 0, cursor, first),
    );
  }

  /**
   * Get Existence
   *
   * Checks for the existence of related records based on a given condition
   * @param data Array of loaders containing the parent entities
   * @param parent Parent entity class
   * @param fromCondition SQL FROM condition string for the existence check
   * @returns Array of booleans indicating existence for each parent entity
   */
  protected async getExistence<T extends Base>(
    data: Loader<T, FilterRelationType>[],
    parent: new () => T,
    fromCondition: string,
  ): Promise<boolean[]> {
    if (data.length === 0) return [];

    const ids = LoadersService.getEntityIds(data);

    // En TypeORM, necesitamos construir el CASE de manera diferente
    // ya que la sintaxis es específica para cada base de datos
    const existenceQuery = `
        CASE
          WHEN EXISTS (
            SELECT 1
            ${fromCondition}
          )
          THEN true
          ELSE false
        END as "existence"
      `;

    // Ejecutamos la consulta usando el QueryBuilder de TypeORM
    const raw: ExistenceResult[] = await this.em
      .createQueryBuilder()
      .select('p.id', 'id')
      .addSelect(existenceQuery)
      .from(parent, 'p')
      .where('p.id IN (:...ids)', { ids })
      .getRawMany();

    // Creamos el mapa de resultados
    const map = new Map<UUID, boolean>();

    for (const result of raw) {
      map.set(result.id, Boolean(result.existence));
    }

    return LoadersService.getResults(ids, map, false);
  }
}
