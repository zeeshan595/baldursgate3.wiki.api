import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { SpellEntity } from '../models/spell.entity';
import { getRepository } from 'typeorm';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationSpellEntity extends Pagination<SpellEntity> {
  @Field(() => [SpellEntity])
  items: SpellEntity[];
}

@Resolver()
export class SpellResolver {
  constructor(private spellRepo = getRepository(SpellEntity)) {}

  @Query(() => [SpellEntity])
  spells(): Promise<SpellEntity[]> {
    return this.spellRepo.find();
  }

  @Query(() => SpellEntity)
  spell(@Arg('id') id: string): Promise<SpellEntity> {
    return this.spellRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => PaginationSpellEntity)
  spellPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<SpellEntity>> {
    return paginate<SpellEntity>(this.spellRepo, page, limit);
  }
}
