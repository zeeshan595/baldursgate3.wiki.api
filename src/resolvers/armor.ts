import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { paginate, Pagination } from '../helpers/pagination';

type ArmorJson = {
  name: string;
  type: string;
  using: string;
  data: {
    Slot: string;
    InventoryTab: string;
    ArmorType: string;
    shield: string;
    'Armor Class Ability': string;
    'Proficiency Group': string;
    ObjectCategory: string;
    Boosts: string;
    Level: string;
    ValueLevel: string;
    MinLevel: string;
    Priority: string;
    ValueScale: string;
    Weight: string;
    MinAmount: string;
    MaxAmount: string;
    ArmorClass: string;
    ValueOverride: string;
    'Ability Modifier Cap': string;
  };
};

@ObjectType()
export class Armor {
  @Field() name: string;
  @Field({ nullable: true }) slot?: string;
  @Field({ nullable: true }) inventoryTab?: string;
  @Field({ nullable: true }) type?: string;
  @Field({ nullable: true }) armorClassAbility?: string;
  @Field({ nullable: true }) proficiencyGroup?: string;
  @Field({ nullable: true }) objectCategory?: string;
  @Field({ nullable: true }) boosts?: string;
  @Field({ nullable: true }) shield?: boolean;
  @Field({ nullable: true }) level?: number;
  @Field({ nullable: true }) valueLevel?: number;
  @Field({ nullable: true }) minLevel?: number;
  @Field({ nullable: true }) priority?: number;
  @Field({ nullable: true }) valueScale?: number;
  @Field({ nullable: true }) weight?: number;
  @Field({ nullable: true }) minAmount?: number;
  @Field({ nullable: true }) maxAmount?: number;
  @Field({ nullable: true }) armorClass?: number;
  @Field({ nullable: true }) ValueOverride?: number;
  @Field({ nullable: true }) abilityModifierCap?: number;
}

@ObjectType()
export class PaginatedArmor extends Pagination<Armor> {
  @Field(() => [Armor]) items: Armor[];
}

@Resolver()
export class ArmorResolver {
  private cacheJson: ArmorJson[];
  private cache: Armor[];

  private getBaseArmorData(armor: ArmorJson): ArmorJson {
    const baseArmor = this.cacheJson.find((a) => a.name === armor.using);
    let data = armor.data;
    if (baseArmor) {
      if (baseArmor.using) {
        const parent = this.getBaseArmorData(baseArmor);
        data = {
          ...parent.data,
          ...baseArmor.data,
          ...data,
        };
      } else {
        data = {
          ...baseArmor.data,
          ...data,
        };
      }
    }

    return {
      ...armor,
      data,
    };
  }
  private map(armor: ArmorJson): Armor {
    if (!armor.data) {
      return {
        name: armor.name,
      };
    }
    armor = this.getBaseArmorData(armor);
    return {
      name: armor.name,
      slot: armor.data?.Slot,
      inventoryTab: armor.data?.InventoryTab,
      type: armor.data?.ArmorType,
      armorClassAbility: armor.data['Armor Class Ability'],
      proficiencyGroup: armor.data['Proficiency Group'],
      objectCategory: armor.data?.ObjectCategory,
      boosts: armor.data?.Boosts,
      shield: armor.data?.shield === 'Yes',
      level: armor.data.Level ? Number.parseFloat(armor.data.Level) : null,
      valueLevel: armor.data.ValueLevel
        ? Number.parseFloat(armor.data.ValueLevel)
        : null,
      minLevel: armor.data.MinLevel
        ? Number.parseFloat(armor.data.MinLevel)
        : null,
      priority: armor.data.Priority
        ? Number.parseFloat(armor.data.Priority)
        : null,
      valueScale: armor.data.ValueScale
        ? Number.parseFloat(armor.data.ValueScale)
        : null,
      weight: armor.data.Weight ? Number.parseFloat(armor.data.Weight) : null,
      minAmount: armor.data.MinAmount
        ? Number.parseFloat(armor.data.MinAmount)
        : null,
      maxAmount: armor.data.MaxAmount
        ? Number.parseFloat(armor.data.MaxAmount)
        : null,
      armorClass: armor.data.ArmorClass
        ? Number.parseFloat(armor.data.ArmorClass)
        : null,
      ValueOverride: armor.data.ValueOverride
        ? Number.parseFloat(armor.data.ValueOverride)
        : null,
      abilityModifierCap: armor.data['Ability Modifier Cap']
        ? Number.parseFloat(armor.data['Ability Modifier Cap'])
        : null,
    };
  }
  private load(): Armor[] {
    if (this.cache) {
      return this.cache;
    }

    const data: ArmorJson[] = JSON.parse(
      fs.readFileSync('assets/generated/Armor.json', { encoding: 'utf8' }),
    );
    this.cacheJson = data;
    this.cache = data.map((a) => this.map(a));
    this.cacheJson = [];
    return this.cache;
  }

  @Query(() => [Armor])
  armors(): Armor[] {
    return this.load();
  }

  @Query(() => Armor)
  armor(@Arg('name') name: string): Armor {
    return this.load().find((a) => a.name === name);
  }

  @Query(() => PaginatedArmor)
  paginatedArmor(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
  ): Pagination<Armor> {
    return paginate(this.load(), page, limit);
  }
}
