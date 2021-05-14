import { Resolver, Query, Arg, ObjectType, Field } from 'type-graphql';
import { StatusEntity } from '../models/status.entity';
import { getRepository } from 'typeorm';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationStatusEntity extends Pagination<StatusEntity> {
  @Field(() => [StatusEntity])
  items: StatusEntity[];
}

@Resolver()
export class StatusResolver {
  constructor(private statusRepo = getRepository(StatusEntity)) {}

  @Query(() => PaginationStatusEntity)
  statusPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<StatusEntity>> {
    return paginate<StatusEntity>(this.statusRepo, page, limit);
  }

  @Query(() => [StatusEntity])
  statuses(): Promise<StatusEntity[]> {
    return this.statusRepo.find();
  }

  @Query(() => StatusEntity)
  status(
    @Arg('id')
    id: string,
  ): Promise<StatusEntity> {
    return this.statusRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }
}
