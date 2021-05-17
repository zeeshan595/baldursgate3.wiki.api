import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';

type AbilityListJson = {
  attributes: {
    UUID: { value: string };
    Abilities: { value: string };
  };
};

type AbilityListJsonContainer = {
  children: AbilityListJson[];
};

@ObjectType()
export class AbilityList {
  @Field()
  uuid: string;
  @Field(() => [String])
  abilities: string[];
}

@Resolver()
export class AbilityResolver {
  private cache: AbilityList[];

  map(abilityList: AbilityListJson): AbilityList {
    return {
      uuid: abilityList.attributes.UUID.value,
      abilities: abilityList.attributes.Abilities.value
        .split(';')
        .map((a) => a.trim()),
    };
  }
  load() {
    if (this.cache) {
      return this.cache;
    }
    const data: AbilityListJsonContainer = JSON.parse(
      fs.readFileSync('assets/lists/AbilityLists.json', { encoding: 'utf8' }),
    );
    this.cache = data.children.map((c) => this.map(c));
    return this.cache;
  }

  @Query(() => [String])
  abilities(): string[] {
    return [
      'Strength',
      'Dexterity',
      'Constitution',
      'Intelligence',
      'Wisdom',
      'Charisma',
    ];
  }

  @Query(() => [AbilityList])
  abilityLists(): AbilityList[] {
    return this.load();
  }

  @Query()
  abilityList(@Arg('uuid') uuid: string): AbilityList {
    return this.load().find((a) => a.uuid === uuid);
  }
}
