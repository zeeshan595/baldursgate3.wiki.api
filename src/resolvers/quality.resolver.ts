import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { QualityEntity } from '../models/quality.entity';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationQualityEntity extends Pagination<QualityEntity> {
  @Field(() => [QualityEntity])
  items: QualityEntity[];
}

@Resolver()
export class QualityResolver {
  constructor(private qualityRepo = getRepository(QualityEntity)) {}

  @Query(() => [QualityEntity])
  qualities(): Promise<QualityEntity[]> {
    return this.qualityRepo.find();
  }

  @Query(() => QualityEntity)
  quality(
    @Arg('id')
    id: string,
  ) {
    return this.qualityRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => PaginationQualityEntity)
  qualityPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<QualityEntity>> {
    return paginate<QualityEntity>(this.qualityRepo, page, limit);
  }
}
