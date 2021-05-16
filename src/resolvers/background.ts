import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { paginate, Pagination } from '../helpers/pagination';

type BackgroundJson = {
  name: string;
  attributes: {
    Description: {
      type: number;
      value: string;
    };
    DisplayName: {
      type: number;
      value: string;
    };
    Passives: {
      type: number;
      value: string;
    };
    UUID: {
      type: number;
      value: string;
    };
  };
  children: {
    name: string;
    attributes: {
      Object: {
        type: number;
        value: string;
      };
    };
  }[];
};

type BackgroundJsonContainer = {
  children: BackgroundJson[];
};

@ObjectType()
export class Background {
  @Field(() => String) uuid: string;
  @Field(() => String) description: string;
  @Field(() => String) displayName: string;
  @Field(() => String) passives: string;
  @Field(() => [String]) tags: string[];
}

@ObjectType()
export class PaginatedBackground extends Pagination<Background> {
  @Field(() => [Background])
  items: Background[];
}

@Resolver()
export class BackgroundResolver {
  cache: Background[];

  map(background: BackgroundJson): Background {
    return {
      uuid: background.attributes.UUID.value,
      description: background.attributes.Description.value,
      displayName: background.attributes.DisplayName.value,
      passives: background.attributes.Passives.value,
      tags: background.children.map((t) => t.attributes.Object.value),
    };
  }
  load(): Background[] {
    if (this.cache) {
      return this.cache;
    }

    const data = JSON.parse(
      fs.readFileSync('assets/backgrounds/Backgrounds.json', {
        encoding: 'utf8',
      }),
    ) as BackgroundJsonContainer;
    this.cache = data.children.map((b) => this.map(b));
    return this.cache;
  }

  @Query(() => [Background])
  backgrounds(): Background[] {
    return this.load();
  }

  @Query(() => Background)
  background(@Arg('uuid') uuid: string): Background {
    return this.load().find((b) => b.uuid === uuid);
  }

  @Query(() => PaginatedBackground)
  paginatedBackgrounds(
    @Arg('page', { defaultValue: 1 }) page: number,
    @Arg('limit', { defaultValue: 50 }) limit: number,
  ): Pagination<Background> {
    return paginate(this.load(), page, limit);
  }
}
