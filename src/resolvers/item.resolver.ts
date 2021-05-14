import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { ItemEntity } from '../models/item.entity';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationItemEntity extends Pagination<ItemEntity> {
  @Field(() => [ItemEntity])
  items: ItemEntity[];
}

@Resolver()
export class ItemResolver {
  constructor(private itemRepo = getRepository(ItemEntity)) {}

  @Query(() => [ItemEntity])
  items(): Promise<ItemEntity[]> {
    return this.itemRepo.find();
  }

  @Query(() => ItemEntity)
  item(
    @Arg('id')
    id: string,
  ): Promise<ItemEntity> {
    return this.itemRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => PaginationItemEntity)
  itemPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<ItemEntity>> {
    return paginate<ItemEntity>(this.itemRepo, page, limit);
  }
}
