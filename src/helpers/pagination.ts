import { Field, ObjectType } from 'type-graphql';
import { Repository } from 'typeorm';

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

export const paginate = async <T>(
  repo: Repository<T>,
  page: number,
  limit: number,
): Promise<Pagination<T>> => {
  const [result, count] = await repo.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });
  const meta = createPaginationMeta(page, limit, result.length, count);
  const p = new Pagination<T>();
  p.meta = meta;
  p.items = result;
  return p;
};
