import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { paginate, Pagination } from '../helpers/pagination';
import { ClassLevelEntity } from '../models/classLevel.entity';

@ObjectType()
class PaginationClassLevelEntity extends Pagination<ClassLevelEntity> {
  @Field(() => [ClassLevelEntity])
  items: ClassLevelEntity[];
}

@Resolver()
export class ClassLevelResolver {
  constructor(private classLevelRepo = getRepository(ClassLevelEntity)) {}

  @Query(() => [ClassLevelEntity])
  classLevels(): Promise<ClassLevelEntity[]> {
    return this.classLevelRepo.find();
  }

  @Query(() => ClassLevelEntity)
  classLevel(@Arg('id') id: string): Promise<ClassLevelEntity> {
    return this.classLevelRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => PaginationClassLevelEntity)
  classLevelPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<ClassLevelEntity>> {
    return paginate<ClassLevelEntity>(this.classLevelRepo, page, limit);
  }
}
