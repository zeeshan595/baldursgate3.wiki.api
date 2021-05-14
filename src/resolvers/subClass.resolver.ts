import { paginate, Pagination } from '../helpers/pagination';
import { SubClassEntity } from '../models/subClass.entity';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';

@ObjectType()
class PaginationSubClassEntity extends Pagination<SubClassEntity> {
  @Field(() => [SubClassEntity])
  items: SubClassEntity[];
}

@Resolver()
export class SubClassResolver {
  constructor(private subClassRepo = getRepository(SubClassEntity)) {}

  @Query(() => [SubClassEntity])
  subClasses(): Promise<SubClassEntity[]> {
    return this.subClassRepo.find();
  }

  @Query(() => SubClassEntity)
  subClass(@Arg('id') id: string): Promise<SubClassEntity> {
    return this.subClassRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => PaginationSubClassEntity)
  subClassPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<SubClassEntity>> {
    return paginate<SubClassEntity>(this.subClassRepo, page, limit);
  }
}
