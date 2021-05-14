import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { AbilityEntity } from '../models/ability.entity';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationAbilityEntity extends Pagination<AbilityEntity> {
  @Field(() => [AbilityEntity])
  items: AbilityEntity[];
}

@Resolver()
export class AbilityResolver {
  constructor(private abilityRepo = getRepository(AbilityEntity)) {}

  @Query(() => AbilityEntity)
  ability(
    @Arg('id')
    id: string,
  ): Promise<AbilityEntity> {
    return this.abilityRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => [AbilityEntity])
  abilities() {
    return this.abilityRepo.find();
  }

  @Query(() => PaginationAbilityEntity)
  abilityPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<AbilityEntity>> {
    return paginate<AbilityEntity>(this.abilityRepo, page, limit);
  }
}
