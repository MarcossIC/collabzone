import { registerEnumType } from '@nestjs/graphql';

export type TypeOrderEnum = '$gt' | '$lt';
export type TypeOppositeOrder = '$gte' | '$lte';
export enum QueryOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const getQueryOrder = (order: QueryOrderEnum): TypeOrderEnum =>
  order === QueryOrderEnum.ASC ? '$gt' : '$lt';

export const getOppositeOrder = (order: QueryOrderEnum): TypeOppositeOrder =>
  order === QueryOrderEnum.ASC ? '$lte' : '$gte';

registerEnumType(QueryOrderEnum, {
  name: 'QueryOrder',
});
