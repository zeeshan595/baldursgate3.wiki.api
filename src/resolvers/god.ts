import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { paginate, Pagination } from '../helpers/pagination';

type GodJson = {
  name: string;
  attributes: {
    UUID: { value: string };
    Name: { value: string };
    DisplayName: { value: string };
    Description: { value: string };
  };
  children: {
    name: string;
    attributes: {
      Object: {
        value: string;
      };
    };
  }[];
};

type GodJsonContainer = {
  children: GodJson[];
};

@ObjectType()
export class God {
  @Field() uuid: string;
  @Field() name: string;
  @Field() displayName: string;
  @Field() description: string;
  @Field(() => [String]) tags: string[];
}

@ObjectType()
export class PaginatedGods extends Pagination<God> {
  @Field(() => [God]) items: God[];
}

@Resolver()
export class GodResolver {
  private cache: God[];

  private map(god: GodJson): God {
    return {
      uuid: god.attributes.UUID.value,
      name: god.attributes.Name.value,
      displayName: god.attributes.DisplayName.value,
      description: god.attributes.Description.value,
      tags: god.children.map((c) => c.attributes.Object.value),
    };
  }
  private load() {
    if (this.cache) {
      return this.cache;
    }

    const data: GodJsonContainer = JSON.parse(
      fs.readFileSync('assets/gods/Gods.json', { encoding: 'utf8' }),
    );
    this.cache = data.children.map((c) => this.map(c));
    return this.cache;
  }

  @Query(() => [God])
  gods() {
    return this.load();
  }

  @Query()
  god(@Arg('uuid') uuid: string): God {
    return this.load().find(g => g.uuid === uuid);
  }

  @Query(() => PaginatedGods)
  paginatedGod(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
  ): Pagination<God> {
    return paginate(this.load(), page, limit);
  }
}
