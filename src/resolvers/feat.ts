import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { paginate, Pagination } from '../helpers/pagination';

type FeatJson = {
  name: string;
  attributes: {
    UUID: { value: string };
    Name: { value: string };
    PassivesAdded: { value: string };
    PassivesRemoved: { value: string };
    Requirements: { value: string };
    Selectors: { value: string };
    CanBeTakenMultipleTimes: { value: boolean };
  };
};

type FeatJsonContainer = {
  children: FeatJson[];
};

@ObjectType()
export class Feat {
  @Field() uuid: string;
  @Field() name: string;
  @Field() canBeTakenMultipleTimes: boolean;
  @Field(() => [String]) selectors: string[];
  @Field(() => [String]) passivesAdded: string[];
  @Field(() => [String]) passivesRemoved: string[];
  @Field(() => [String]) requirements: string[];
}

@ObjectType()
export class PaginatedFeat extends Pagination<Feat> {
  @Field(() => [Feat])
  items: Feat[];
}

@Resolver()
export class FeatResolver {
  private cache: Feat[];

  private map(feat: FeatJson): Feat {
    return {
      uuid: feat.attributes.UUID.value,
      name: feat.attributes.Name.value,
      canBeTakenMultipleTimes: feat.attributes.CanBeTakenMultipleTimes.value,
      passivesAdded: feat.attributes.PassivesAdded.value.split(';'),
      passivesRemoved: feat.attributes.PassivesRemoved.value.split(';'),
      requirements: feat.attributes.Requirements.value.split(';'),
      selectors: feat.attributes.Selectors.value.split(';'),
    };
  }
  private load(): Feat[] {
    if (this.cache) {
      return this.cache;
    }
    const data: FeatJsonContainer = JSON.parse(
      fs.readFileSync('assets/feats/Feats.json', { encoding: 'utf8' }),
    );
    this.cache = data.children.map((c) => this.map(c));
    return this.cache;
  }

  @Query(() => [Feat])
  feats(): Feat[] {
    return this.load();
  }

  @Query()
  feat(@Arg('uuid') uuid: string): Feat {
    return this.load().find((f) => f.uuid === uuid);
  }

  @Query(() => PaginatedFeat)
  paginatedFeat(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
  ): Pagination<Feat> {
    return paginate(this.load(), page, limit);
  }
}
