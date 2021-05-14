import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { FeatureEntity } from '../models/feature.entity';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationFeatureEntity extends Pagination<FeatureEntity> {
  @Field(() => [FeatureEntity])
  items: FeatureEntity[];
}

@Resolver()
export class FeatureResolver {
  constructor(private featureRepo = getRepository(FeatureEntity)) {}

  @Query(() => FeatureEntity)
  feature(
    @Arg('id')
    id: string,
  ): Promise<FeatureEntity> {
    return this.featureRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => [FeatureEntity])
  features() {
    return this.featureRepo.find();
  }

  @Query(() => PaginationFeatureEntity)
  featurePaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<FeatureEntity>> {
    return paginate<FeatureEntity>(this.featureRepo, page, limit);
  }
}
