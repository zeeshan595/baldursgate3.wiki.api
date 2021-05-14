import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { RaceEntity } from '../models/race.entity';
import { getRepository } from 'typeorm';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationRaceEntity extends Pagination<RaceEntity> {
  @Field(() => [RaceEntity])
  items: RaceEntity[];
}

@Resolver()
export class RaceResolver {
  constructor(private raceRepo = getRepository(RaceEntity)) {}

  @Query(() => [RaceEntity])
  races(): Promise<RaceEntity[]> {
    return this.raceRepo.find();
  }

  @Query(() => RaceEntity)
  race(@Arg('id') id: string): Promise<RaceEntity> {
    return this.raceRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => PaginationRaceEntity)
  racePaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<RaceEntity>> {
    return paginate<RaceEntity>(this.raceRepo, page, limit);
  }
}
