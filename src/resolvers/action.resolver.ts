import { getRepository } from 'typeorm';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { ActionEntity } from '../models/action.entity';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationActionEntity extends Pagination<ActionEntity> {
  @Field(() => [ActionEntity])
  items: ActionEntity[];
}

@Resolver()
export class ActionResolver {
  constructor(private actionRepo = getRepository(ActionEntity)) {}

  @Query(() => ActionEntity)
  action(
    @Arg('id')
    id: string,
  ): Promise<ActionEntity> {
    return this.actionRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => [ActionEntity])
  actions(): Promise<ActionEntity[]> {
    return this.actionRepo.find();
  }

  @Query(() => PaginationActionEntity)
  actionPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<ActionEntity>> {
    return paginate<ActionEntity>(this.actionRepo, page, limit);
  }
}
