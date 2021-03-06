import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { paginate, Pagination } from '../helpers/pagination';

type SpellJsonData = {
  [key: string]: string;
};

type SpellJson = {
  name: string;
  type: string;
  using: string;
  data: SpellJsonData;
};

type SpellListJson = {
  attributes: {
    UUID: { value: string };
    Spells: { value: string };
  };
};

type SpellListJsonContainer = {
  children: SpellListJson[];
};

@ObjectType()
export class Spell {
  @Field({ nullable: true }) name: string;
  @Field({ nullable: true }) spellType: string;
  @Field({ nullable: true }) spellProperties: string;
  @Field({ nullable: true }) targetRadius: string;
  @Field({ nullable: true }) spellRoll: string;
  @Field({ nullable: true }) spellSuccess: string;
  @Field({ nullable: true }) targetConditions: string;
  @Field({ nullable: true }) projectileCount: string;
  @Field({ nullable: true }) template: string;
  @Field({ nullable: true }) icon: string;
  @Field({ nullable: true }) displayName: string;
  @Field({ nullable: true }) description: string;
  @Field({ nullable: true }) descriptionParams: string;
  @Field({ nullable: true }) tooltipDamageList: string;
  @Field({ nullable: true }) tooltipAttackSave: string;
  @Field({ nullable: true }) previewCursor: string;
  @Field({ nullable: true }) castTextEvent: string;
  @Field({ nullable: true }) cycleConditions: string;
  @Field({ nullable: true }) useCosts: string;
  @Field({ nullable: true }) spellAnimationArcaneMagic: string;
  @Field({ nullable: true }) spellAnimationDivineMagic: string;
  @Field({ nullable: true }) spellAnimationNoneMagic: string;
  @Field({ nullable: true }) weaponTypes: string;
  @Field({ nullable: true }) spellFlags: string;
  @Field({ nullable: true }) spellAnimationIntentType: string;
  @Field({ nullable: true }) castSound: string;
  @Field({ nullable: true }) cooldown: string;
  @Field({ nullable: true }) areaRadius: string;
  @Field({ nullable: true }) explodeRadius: string;
  @Field({ nullable: true }) prepareEffect: string;
  @Field({ nullable: true }) castEffect: string;
  @Field({ nullable: true }) verbalIntent: string;
  @Field({ nullable: true }) spellActionType: string;
  @Field({ nullable: true }) spellJumpType: string;
  @Field({ nullable: true }) spellFail: string;
  @Field({ nullable: true }) extraDescription: string;
}

@ObjectType()
export class SpellList {
  @Field() uuid: string;
  @Field(() => [String]) spells: string[];
}

@ObjectType()
export class PaginatedSpell extends Pagination<Spell> {
  @Field(() => [Spell])
  items: Spell[];
}

@Resolver()
export class SpellResolver {
  private jsonCache: SpellJson[];
  private cache: Spell[];
  private cacheList: SpellList[];

  private getBaseSpellData(spell: SpellJson): SpellJsonData {
    let rtn = {};
    if (spell.using) {
      const baseSpell = this.jsonCache.find((s) => s.name === spell.using);
      if (baseSpell) {
        if (baseSpell.using) {
          rtn = {
            ...rtn,
            ...this.getBaseSpellData(baseSpell),
          };
        }
        rtn = {
          ...rtn,
          ...baseSpell.data,
        };
      }
    }
    return rtn;
  }
  private map(spell: SpellJson): Spell {
    const baseSpellData = this.getBaseSpellData(spell);
    const rtn = {
      name: spell.name,
    };

    // base data
    for (const key of Object.keys(baseSpellData)) {
      const newKey = key[0].toLowerCase() + key.substr(1, key.length - 1);
      rtn[newKey] = baseSpellData[key];
    }

    // overrides
    for (const key of Object.keys(spell.data)) {
      const newKey = key[0].toLowerCase() + key.substr(1, key.length - 1);
      rtn[newKey] = spell.data[key];
    }

    return rtn as Spell;
  }
  private load(): Spell[] {
    if (this.cache) {
      return this.cache;
    }
    const spells: Spell[] = [];

    const files = fs.readdirSync('assets/generated');
    for (const file of files) {
      if (file.startsWith('Spell') === false) {
        continue;
      }

      const spellList: SpellJson[] = JSON.parse(
        fs.readFileSync(`assets/generated/${file}`, { encoding: 'utf8' }),
      );
      this.jsonCache = spellList;
      for (const spell of spellList) {
        spells.push(this.map(spell));
      }
    }

    this.cache = spells;
    this.jsonCache = [];
    return spells;
  }
  private mapList(spellList: SpellListJson): SpellList {
    return {
      uuid: spellList.attributes.UUID.value,
      spells: spellList.attributes.Spells.value.split(';').map((s) => s.trim()),
    };
  }
  private loadList(): SpellList[] {
    if (this.cacheList) {
      return this.cacheList;
    }
    const data: SpellListJsonContainer = JSON.parse(
      fs.readFileSync('assets/lists/SpellList.json', {
        encoding: 'utf8',
      }),
    );
    this.cacheList = data.children.map((c) => this.mapList(c));
    return this.cacheList;
  }

  @Query(() => [SpellList])
  spellLists(): SpellList[] {
    return this.loadList();
  }

  @Query(() => [Spell])
  spellLsit(@Arg('uuid') uuid: string): SpellList {
    return this.loadList().find((s) => s.uuid === uuid);
  }

  @Query(() => Spell)
  spell(@Arg('name') name: string): Spell {
    return this.load().find((s) => s.name === name);
  }

  @Query(() => [Spell])
  spellsOfType(@Arg('type') type: string): Spell[] {
    return this.load().filter((s) => s.spellType === type);
  }

  @Query(() => [Spell])
  spells(): Spell[] {
    return this.load();
  }

  @Query(() => PaginatedSpell)
  paginatedSpells(
    @Arg('page', { defaultValue: 1 }) page: number,
    @Arg('limit', { defaultValue: 50 }) limit: number,
  ): Pagination<Spell> {
    return paginate(this.load(), page, limit);
  }
}
