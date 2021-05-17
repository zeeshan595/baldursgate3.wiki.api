import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { paginate, Pagination } from '../helpers/pagination';

type CharacterJson = {
  name: string;
  type: string;
  using: string;
  data: {
    Level: string;
    Strength: string;
    Dexterity: string;
    Constitution: string;
    Intelligence: string;
    Wisdom: string;
    Charisma: string;
    Armor: string;
    Vitality: string;
    XPReward: string;
    Sight: string;
    Hearing: string;
    FOV: string;
    Weight: string;
    StepsType: string;
    PathInfluence: string;
    ProficiencyBonus: string;
    SpellCastingAbility: string;
    UnarmedAttackAbility: string;
    UnarmedRangedAttackAbility: string;
    ActionResources: string;
    Passives: string;
    MinimumDetectionRange: string;
    DarkvisionRange: string;
    FallingHitEffect: string;
    FallingLandEffect: string;
    'Proficiency Group': string;
    ArmorType: string;
    PersonalStatusImmunities: string;
    DefaultBoosts: string;
  };
};

@ObjectType()
export class Character {
  @Field() name: string;
  @Field({ nullable: true }) level?: number;
  @Field({ nullable: true }) strength?: number;
  @Field({ nullable: true }) dexterity?: number;
  @Field({ nullable: true }) constitution?: number;
  @Field({ nullable: true }) intelligence?: number;
  @Field({ nullable: true }) wisdom?: number;
  @Field({ nullable: true }) charisma?: number;
  @Field({ nullable: true }) armor?: number;
  @Field({ nullable: true }) vitality?: number;
  @Field({ nullable: true }) xpReward?: string;
  @Field({ nullable: true }) sight?: number;
  @Field({ nullable: true }) hearing?: number;
  @Field({ nullable: true }) fOV?: number;
  @Field({ nullable: true }) weight?: number;
  @Field({ nullable: true }) stepsType?: string;
  @Field({ nullable: true }) proficiencyBonus?: number;
  @Field({ nullable: true }) spellCastingAbility?: string;
  @Field({ nullable: true }) unarmedAttackAbility?: string;
  @Field({ nullable: true }) unarmedRangedAttackAbility?: string;
  @Field({ nullable: true }) minimumDetectionRange?: number;
  @Field({ nullable: true }) darkvisionRange?: number;
  @Field({ nullable: true }) fallingHitEffect?: string;
  @Field({ nullable: true }) fallingLandEffect?: string;
  @Field(() => [String]) pathInfluence: string[];
  @Field(() => [String]) actionResources: string[];
  @Field(() => [String]) passives: string[];
}

@ObjectType()
export class PaginatedCharacter extends Pagination<Character> {
  @Field(() => [Character]) items: Character[];
}

@Resolver()
export class CharacterResolver {
  private cacheJson: CharacterJson[];
  private cache: Character[];

  private baseCharacterData(character: CharacterJson): CharacterJson {
    let data = character.data;
    if (character.using) {
      const base = this.cacheJson.find((c) => c.name === character.using);
      const baseBaseData = this.baseCharacterData(base);
      data = {
        ...base.data,
        ...baseBaseData.data,
        ...data,
      };
    }
    return {
      ...character,
      data,
    };
  }
  private map(character: CharacterJson): Character {
    character = this.baseCharacterData(character);
    return {
      name: character.name,
      level: character.data.Level
        ? Number.parseFloat(character.data.Level)
        : null,
      strength: character.data.Strength
        ? Number.parseFloat(character.data.Strength)
        : null,
      dexterity: character.data.Dexterity
        ? Number.parseFloat(character.data.Dexterity)
        : null,
      constitution: character.data.Constitution
        ? Number.parseFloat(character.data.Constitution)
        : null,
      intelligence: character.data.Intelligence
        ? Number.parseFloat(character.data.Intelligence)
        : null,
      wisdom: character.data.Wisdom
        ? Number.parseFloat(character.data.Wisdom)
        : null,
      charisma: character.data.Charisma
        ? Number.parseFloat(character.data.Charisma)
        : null,
      armor: character.data.Armor
        ? Number.parseFloat(character.data.Armor)
        : null,
      vitality: character.data.Vitality
        ? Number.parseFloat(character.data.Vitality)
        : null,
      xpReward: character.data.XPReward,
      sight: character.data.Sight
        ? Number.parseFloat(character.data.Sight)
        : null,
      hearing: character.data.Hearing
        ? Number.parseFloat(character.data.Hearing)
        : null,
      fOV: character.data.FOV ? Number.parseFloat(character.data.FOV) : null,
      weight: character.data.Weight
        ? Number.parseFloat(character.data.Weight)
        : null,
      stepsType: character.data.StepsType,
      proficiencyBonus: character.data.ProficiencyBonus
        ? Number.parseFloat(character.data.ProficiencyBonus)
        : null,
      spellCastingAbility: character.data.SpellCastingAbility,
      unarmedAttackAbility: character.data.UnarmedAttackAbility,
      unarmedRangedAttackAbility: character.data.UnarmedRangedAttackAbility,
      minimumDetectionRange: character.data.MinimumDetectionRange
        ? Number.parseFloat(character.data.MinimumDetectionRange)
        : null,
      darkvisionRange: character.data.DarkvisionRange
        ? Number.parseFloat(character.data.DarkvisionRange)
        : null,
      fallingHitEffect: character.data.FallingHitEffect,
      fallingLandEffect: character.data.FallingLandEffect,
      pathInfluence: character.data.PathInfluence.split(';'),
      actionResources: character.data.ActionResources.split(';'),
      passives: character.data.Passives.split(';'),
    };
  }
  private load() {
    if (this.cache) {
      return this.cache;
    }
    const data: CharacterJson[] = JSON.parse(
      fs.readFileSync('assets/generated/Character.json', { encoding: 'utf8' }),
    );
    this.cacheJson = data;
    this.cache = data.map((c) => this.map(c));
    return this.cache;
  }

  @Query(() => [Character])
  characters(): Character[] {
    return this.load();
  }

  @Query(() => Character)
  character(@Arg('name') name: string): Character {
    return this.load().find((c) => c.name === name);
  }

  @Query(() => PaginatedCharacter)
  paginatedCharacters(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
  ): Pagination<Character> {
    return paginate(this.load(), page, limit);
  }
}
