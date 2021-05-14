import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { ClassEntity } from '../models/class.entity';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationClassEntity extends Pagination<ClassEntity> {
  @Field(() => [ClassEntity])
  items: ClassEntity[];
}

@Resolver()
export class ClassResolver {
  constructor(private classRepo = getRepository(ClassEntity)) {}

  @Query(() => [ClassEntity])
  classes(): Promise<ClassEntity[]> {
    return this.classRepo.find();
  }

  @Query(() => ClassEntity)
  class(@Arg('id') id: string) {
    return this.classRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => PaginationClassEntity)
  classPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<ClassEntity>> {
    return paginate<ClassEntity>(this.classRepo, page, limit);
  }
}
