import * as fs from 'fs';
import { Field, ObjectType, Resolver } from 'type-graphql';

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
}
