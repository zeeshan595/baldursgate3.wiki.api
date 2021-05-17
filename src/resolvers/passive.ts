import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';

type PassiveJson = {
  name: string;
  type: string;
  using: string;
  data: {
    Icon: string;
    Boosts: string;
    Conditions: string;
    Properties: string;
    Description: string;
    DisplayName: string;
    StatsFunctors: string;
    ExtraDescription: string;
    ToggleOnFunctors: string;
    DescriptionParams: string;
    ToggleOffFunctors: string;
    StatsFunctorsContentext: string;
  };
};

type PassiveListJson = {
  attributes: {
    UUID: { value: string };
    Passives: { value: string };
  };
};

type PassiveListJsonContainer = {
  children: PassiveListJson[];
};

@ObjectType()
export class Passive {
  @Field() name: string;
  @Field({ nullable: true }) icon: string;
  @Field({ nullable: true }) boosts: string;
  @Field({ nullable: true }) conditions: string;
  @Field({ nullable: true }) properties: string;
  @Field({ nullable: true }) description: string;
  @Field({ nullable: true }) displayName: string;
  @Field({ nullable: true }) statsFunctors: string;
  @Field({ nullable: true }) extraDescription: string;
  @Field({ nullable: true }) toggleOnFunctors: string;
  @Field({ nullable: true }) descriptionParams: string;
  @Field({ nullable: true }) toggleOffFunctors: string;
  @Field({ nullable: true }) statsFunctorContext: string;
}

@ObjectType()
export class PassiveList {
  @Field() uuid: string;
  @Field(() => [String]) passives: string[];
}

@Resolver()
export class PassiveResolver {
  private cache: Passive[];
  private cacheList: PassiveList[];

  private map(passive: PassiveJson): Passive {
    return {
      name: passive.name,
      icon: passive.data?.Icon,
      boosts: passive.data?.Boosts,
      conditions: passive.data?.Conditions,
      properties: passive.data?.Properties,
      description: passive.data?.Description,
      displayName: passive.data?.DisplayName,
      statsFunctors: passive.data?.StatsFunctors,
      extraDescription: passive.data?.ExtraDescription,
      toggleOnFunctors: passive.data?.ToggleOnFunctors,
      descriptionParams: passive.data?.DescriptionParams,
      toggleOffFunctors: passive.data?.ToggleOffFunctors,
      statsFunctorContext: passive.data?.StatsFunctorsContentext,
    };
  }
  private load(): Passive[] {
    if (this.cache) {
      return this.cache;
    }

    const data: PassiveJson[] = JSON.parse(
      fs.readFileSync('assets/generated/Passive.json', { encoding: 'utf8' }),
    );
    this.cache = data.map((p) => this.map(p));
    return this.cache;
  }
  private mapList(passiveList: PassiveListJson): PassiveList {
    return {
      uuid: passiveList.attributes.UUID.value,
      passives: passiveList.attributes.Passives.value
        .split(',')
        .map((p) => p.trim()),
    };
  }
  private loadList() {
    if (this.cacheList) {
      return this.cacheList;
    }

    const data: PassiveListJsonContainer = JSON.parse(
      fs.readFileSync('assets/lists/PassiveLists.json', { encoding: 'utf8' }),
    );
    this.cacheList = data.children.map((p) => this.mapList(p));
    return this.cacheList;
  }

  @Query(() => [Passive])
  passives(): Passive[] {
    return this.load();
  }

  @Query(() => Passive)
  passive(@Arg('name') name: string) {
    return this.load().find((p) => p.name === name);
  }

  @Query(() => [PassiveList])
  passiveLists(): PassiveList[] {
    return this.loadList();
  }

  @Query(() => PassiveList)
  passiveList(@Arg('uuid') uuid: string): PassiveList {
    return this.loadList().find((p) => p.uuid === uuid);
  }
}
