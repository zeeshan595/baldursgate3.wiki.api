import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PaginationMeta {
  @Field()
  itemCount: number;
  @Field()
  totalItems: number;
  @Field()
  itemsPerPage: number;
  @Field()
  totalPages: number;
  @Field()
  currentPage: number;
}

@ObjectType({
  isAbstract: true,
})
export class Pagination<T> {
  items: T[];
  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}

export const createPaginationMeta = (
  page: number,
  limit: number,
  count: number,
  total: number,
): PaginationMeta => {
  const meta = new PaginationMeta();
  meta.currentPage = page;
  meta.itemsPerPage = limit;
  meta.itemCount = count;
  meta.totalItems = total;
  meta.totalPages = Math.ceil(total / limit);
  return meta;
};
