import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { SkillEntity } from '../models/skill.entity';
import { getRepository } from 'typeorm';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationSkillEntity extends Pagination<SkillEntity> {
  @Field(() => [SkillEntity])
  items: SkillEntity[];
}

@Resolver()
export class SkillResolver {
  constructor(private skillRepo = getRepository(SkillEntity)) {}

  @Query(() => SkillEntity)
  skill(
    @Arg('id')
    id: string,
  ): Promise<SkillEntity> {
    return this.skillRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => [SkillEntity])
  skills(): Promise<SkillEntity[]> {
    return this.skillRepo.find();
  }

  @Query(() => PaginationSkillEntity)
  skillPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<SkillEntity>> {
    return paginate<SkillEntity>(this.skillRepo, page, limit);
  }
}
