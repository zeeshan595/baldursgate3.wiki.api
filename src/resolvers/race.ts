import * as fs from 'fs';
import { Field, ObjectType, Query, Resolver } from 'type-graphql';

type RaceJsonChild = {
  name: string;
  attributes: {
    Object: { value: string };
  };
};

type RaceJson = {
  attributes: {
    UUID: { value: string };
    Name: { value: string };
    Description: { value: string };
    DisplayName: { value: string };
    ParentGuid: { value: string };
  };
  children: RaceJsonChild[];
};

type RaceJsonContainer = {
  children: RaceJson[];
};

@ObjectType()
export class Race {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  parentRace: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => [String])
  eyeColors: string[];

  @Field(() => [String])
  hairColors: string[];

  @Field(() => [String])
  makeupColors: string[];

  @Field(() => [String])
  skinColors: string[];

  @Field(() => [String])
  tattooColors: string[];

  @Field(() => [String])
  visuals: string[];

  @Field(() => [String])
  subRaces: string[];
}

@Resolver()
export class RaceResolver {
  jsonCache: RaceJson[];
  cache: Race[];

  map(race: RaceJson): Race {
    const eyeColors = race.children.filter((c) => c.name === 'EyeColors');
    const hairColors = race.children.filter((c) => c.name === 'HairColors');
    const makeupColors = race.children.filter((c) => c.name === 'MakeupColors');
    const skinColors = race.children.filter((c) => c.name === 'SkinColors');
    const tattooColors = race.children.filter((c) => c.name === 'TattooColors');
    const visuals = race.children.filter((c) => c.name === 'Visuals');
    const tags = race.children.filter((c) => c.name === 'Tags');
    const subRaces = this.jsonCache.filter(
      (r) => r.attributes.ParentGuid.value === race.attributes.UUID.value,
    );

    let parentUUid = null;
    if (
      race.attributes.ParentGuid.value !==
      '00000000-0000-0000-0000-000000000000'
    ) {
      parentUUid = race.attributes.ParentGuid.value;
    }
    return {
      uuid: race.attributes.UUID.value,
      name: race.attributes.Name.value,
      description: race.attributes.Description.value,
      displayName: race.attributes.DisplayName.value,
      parentRace: parentUUid,
      eyeColors: eyeColors.map((e) => e.attributes.Object.value),
      hairColors: hairColors.map((e) => e.attributes.Object.value),
      makeupColors: makeupColors.map((e) => e.attributes.Object.value),
      skinColors: skinColors.map((e) => e.attributes.Object.value),
      tattooColors: tattooColors.map((e) => e.attributes.Object.value),
      visuals: visuals.map((e) => e.attributes.Object.value),
      tags: tags.map((t) => t.attributes.Object.value),
      subRaces: subRaces.map((e) => e.attributes.UUID.value),
    };
  }
  load(): Race[] {
    if (this.cache) {
      return this.cache;
    }

    const data: RaceJsonContainer = JSON.parse(
      fs.readFileSync('assets/races/Races.json', { encoding: 'utf8' }),
    );
    const races: Race[] = [];
    this.jsonCache = data.children;
    for (const race of data.children) {
      races.push(this.map(race));
    }

    this.cache = races;
    return races;
  }

  @Query(() => [Race])
  races(): Race[] {
    return this.load();
  }
}