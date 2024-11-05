import { ArgsType, Field, Int } from '@nestjs/graphql';
import { QueryOrderEnum } from '../enum/QueryCursorOrder.enum';

@ArgsType()
export abstract class FilterRelationType {
  @Field(() => QueryOrderEnum, { defaultValue: QueryOrderEnum.ASC })
  public order: QueryOrderEnum = QueryOrderEnum.ASC;

  @Field(() => Int, { defaultValue: 10 })
  public first = 10;
}