import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { paginate, Pagination } from '../helpers/pagination';

type WeaponJsonData = {
  ItemGroup: string;
  Level: string;
  Damage: string;
  WeaponRange: string;
  WeaponType: string;
  Slot: string;
  InventoryTab: string;
  Weight: string;
  WeaponFunctors: string;
  PersonalStatusImmunities: string;
  Boosts: string;
  DefaultBoosts: string;
  Flags: string;
  ValueOverride: string;
  Rarity: string;
  VersatileDamage: string;
  'Damage Type': string;
  'Weapon Group': string;
  'Proficiency Group': string;
  'Weapon Properties': string;
};

type WeaponJson = {
  name: string;
  type: string;
  using: string;
  data: WeaponJsonData;
};

@ObjectType()
export class Weapon {
  @Field() name: string;
  @Field({ nullable: true }) damage: string;
  @Field() range: number;
  @Field() type: string;
  @Field() slot: string;
  @Field() weaponGroup: string;
  @Field() itemGroup: string;
  @Field() damageType: string;
  @Field() inventoryTab: string;
  @Field({ defaultValue: 1 }) level: number;
  @Field({ defaultValue: 0 }) weight: number;
  @Field({ defaultValue: 'Common' }) rarity: string;
  @Field({ nullable: true }) versatileDamage: string;
  @Field({ nullable: true }) functors: string;
  @Field({ nullable: true }) boosts: string;
  @Field({ nullable: true }) defaultBoosts: string;
  @Field({ nullable: true }) valueOverride: number;
  @Field(() => [String]) properties: string[];
  @Field(() => [String]) proficiencies: string[];
  @Field(() => [String]) statusImmunities: string[];
  @Field(() => [String]) flags: string[];
}

@ObjectType()
export class PaginatedWeapon extends Pagination<Weapon> {
  @Field(() => [Weapon])
  items: Weapon[];
}

@Resolver()
export class WeaponResolver {
  private cacheJson: WeaponJson[];
  private cache: Weapon[];

  private getBaseWeaponData(weapon: WeaponJson): WeaponJson {
    const baseWeapon = this.cacheJson.find((w) => w.name === weapon.using);
    let data = weapon.data;
    if (baseWeapon && baseWeapon.using) {
      data = {
        ...this.getBaseWeaponData(baseWeapon).data,
        ...baseWeapon,
      };
    }
    return {
      ...baseWeapon,
      data,
    };
  }
  private map(weapon: WeaponJson): Weapon {
    if (!weapon.data) {
      return null;
    }
    const baseData = this.getBaseWeaponData(weapon).data;
    const data: WeaponJsonData = baseData;
    for (const key of Object.keys(weapon.data)) {
      if (weapon.data[key]) {
        data[key] = weapon.data[key];
      }
    }
    return {
      name: weapon.name,
      level: data.Level ? Number.parseFloat(data.Level) : 1,
      damage: data.Damage,
      range: data.WeaponRange ? Number.parseFloat(data.WeaponRange) : 150,
      weight: data.Weight ? Number.parseFloat(data.Weight) : 0,
      type: data.WeaponType ? data.WeaponType : 'None',
      slot: data.Slot ? data.Slot : 'Melee Main Weapon',
      weaponGroup: data['Weapon Group']
        ? data['Weapon Group']
        : 'SimpleMeleeWeapon',
      itemGroup: data.ItemGroup ? data.ItemGroup : 'Dummy',
      damageType: data['Damage Type'] ? data['Damage Type'] : 'Bludgeoning',
      inventoryTab: data.InventoryTab ? data.InventoryTab : 'Equipment',
      versatileDamage: data.VersatileDamage,
      functors: data.WeaponFunctors,
      boosts: data.Boosts,
      defaultBoosts: data.DefaultBoosts,
      rarity: data.Rarity ? data.Rarity : 'Common',
      valueOverride: data.ValueOverride
        ? Number.parseFloat(data.ValueOverride)
        : null,
      properties: data['Weapon Properties']
        ? data['Weapon Properties'].split(';')
        : [],
      proficiencies: data['Proficiency Group']
        ? data['Proficiency Group'].split(';')
        : [],
      statusImmunities: data.PersonalStatusImmunities
        ? data.PersonalStatusImmunities.split(';')
        : [],
      flags: data.Flags ? data.Flags.split(';') : [],
    };
  }
  private load(): Weapon[] {
    if (this.cache) {
      return this.cache;
    }

    this.cache = [];
    const data: WeaponJson[] = JSON.parse(
      fs.readFileSync('assets/generated/Weapon.json', { encoding: 'utf8' }),
    );
    this.cacheJson = data;
    this.cache = this.cacheJson
      .map((c) => this.map(c))
      .filter((c) => c !== null);
    return this.cache;
  }

  @Query(() => [Weapon])
  weapons() {
    return this.load();
  }

  @Query(() => Weapon)
  weapon(@Arg('name') name: string): Weapon {
    return this.load().find((w) => w.name === name);
  }

  @Query(() => PaginatedWeapon)
  paginatedWeapon(
    @Arg('page', { defaultValue: 1 }) page: number,
    @Arg('limit', { defaultValue: 50 }) limit: number,
  ): Pagination<Weapon> {
    return paginate(this.load(), page, limit);
  }
}
