import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { paginate, Pagination } from '../helpers/pagination';

type ClassJson = {
  attributes: {
    UUID: { value: string };
    BaseHp: { value: number };
    CanLearnSpells: { value: boolean };
    ClassEquipment: { value: string };
    Description: { value: string };
    DisplayName: { value: string };
    HasGod: { value: boolean };
    HpPerLevel: { value: number };
    LearningStrategy: { value: number };
    MagicType: { value: number };
    MustPrepareSpells: { value: boolean };
    Name: { value: string };
    ParentGuid: { value: string };
    PrimaryAbility: { value: number };
    SpellCastingAbility: { value: number };
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

type ClassJsonContainer = {
  children: ClassJson[];
};

@ObjectType()
export class BgClass {
  @Field() uuid: string;
  @Field() name: string;
  @Field() description: string;
  @Field() displayName: string;
  @Field() baseHp: number;
  @Field() hpPerLevel: number;
  @Field() hasGod: boolean;
  @Field() canLearnSpells: boolean;
  @Field() classEquipment: string;
  @Field() learningStrategy: number;
  @Field() mustPrepareSpells: boolean;
  @Field() primaryAbility: number;
  @Field() spellCastingAbility: number;
  @Field({ nullable: true }) parent: string;

  @Field(() => [String])
  subClasses: string[];
}

@ObjectType()
export class PaginatedClass extends Pagination<BgClass> {
  @Field(() => [BgClass])
  items: BgClass[];
}

@Resolver()
export class ClassResolver {
  private cacheJson: ClassJson[];
  private cache: BgClass[];

  private map(bgClass: ClassJson): BgClass {
    const subClasses = this.cacheJson.filter(
      (c) => c.attributes.ParentGuid.value === bgClass.attributes.UUID.value,
    );
    let parentGuid = null;
    if (
      bgClass.attributes.ParentGuid.value !==
      '00000000-0000-0000-0000-000000000000'
    ) {
      parentGuid = bgClass.attributes.ParentGuid.value;
    }
    return {
      uuid: bgClass.attributes.UUID.value,
      name: bgClass.attributes.Name.value,
      description: bgClass.attributes.Description.value,
      displayName: bgClass.attributes.DisplayName.value,
      baseHp: bgClass.attributes.BaseHp.value,
      canLearnSpells: bgClass.attributes.CanLearnSpells.value,
      classEquipment: bgClass.attributes.ClassEquipment.value,
      hasGod: bgClass.attributes.HasGod.value,
      hpPerLevel: bgClass.attributes.HpPerLevel.value,
      learningStrategy: bgClass.attributes.LearningStrategy.value,
      mustPrepareSpells: bgClass.attributes.MustPrepareSpells.value,
      primaryAbility: bgClass.attributes.PrimaryAbility.value,
      spellCastingAbility: bgClass.attributes.SpellCastingAbility.value,
      parent: parentGuid,
      subClasses: subClasses.map((c) => c.attributes.UUID.value),
    };
  }
  private load(): BgClass[] {
    if (this.cache) {
      return this.cache;
    }
    this.cache = [];
    const data: ClassJsonContainer = JSON.parse(
      fs.readFileSync('assets/class/ClassDescriptions.json', {
        encoding: 'utf8',
      }),
    );
    this.cacheJson = data.children;
    for (const bgClass of this.cacheJson) {
      this.cache.push(this.map(bgClass));
    }
    this.cacheJson = [];
    return this.cache;
  }

  @Query(() => [BgClass])
  classes(): BgClass[] {
    return this.load();
  }

  @Query()
  class(@Arg('uuid') uuid: string): BgClass {
    return this.load().find((c) => c.uuid === uuid);
  }

  @Query(() => PaginatedClass)
  paginatedClass(
    @Arg('page', { defaultValue: 1 }) page: number,
    @Arg('limit', { defaultValue: 50 }) limit: number,
  ): Pagination<BgClass> {
    return paginate(this.load(), page, limit);
  }
}
