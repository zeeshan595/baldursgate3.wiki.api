import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { BackgroundEntity } from '../models/background.entity';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationBackgroundEntity extends Pagination<BackgroundEntity> {
  @Field(() => [BackgroundEntity])
  items: BackgroundEntity[];
}

@Resolver()
export class BackgroundResolver {
  constructor(private backgroundRepo = getRepository(BackgroundEntity)) {}

  @Query(() => BackgroundEntity)
  background(
    @Arg('id')
    id: string,
  ): Promise<BackgroundEntity> {
    return this.backgroundRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => [BackgroundEntity])
  backgrounds(): Promise<BackgroundEntity[]> {
    return this.backgroundRepo.find();
  }

  @Query(() => PaginationBackgroundEntity)
  backgroundPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<BackgroundEntity>> {
    return paginate<BackgroundEntity>(this.backgroundRepo, page, limit);
  }
}
