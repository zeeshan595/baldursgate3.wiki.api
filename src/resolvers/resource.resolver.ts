import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { ResourceEntity } from '../models/resource.entity';
import { getRepository } from 'typeorm';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationResourceEntity extends Pagination<ResourceEntity> {
  @Field(() => [ResourceEntity])
  items: ResourceEntity[];
}

@Resolver()
export class ResourceResolver {
  constructor(private resourceRepo = getRepository(ResourceEntity)) {}

  @Query(() => [ResourceEntity])
  resources(): Promise<ResourceEntity[]> {
    return this.resourceRepo.find();
  }

  @Query(() => ResourceEntity)
  resource(
    @Arg('id')
    id: string,
  ): Promise<ResourceEntity> {
    return this.resourceRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => PaginationResourceEntity)
  resourcePaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<ResourceEntity>> {
    return paginate<ResourceEntity>(this.resourceRepo, page, limit);
  }
}
