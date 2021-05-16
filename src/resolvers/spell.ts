import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';

type SpellJsonData = {
  [key: string]: string;
};

type SpellJson = {
  name: string;
  type: string;
  using: string;
  data: SpellJsonData;
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

@Resolver()
export class SpellResolver {
  jsonCache: SpellJson[];
  cache: Spell[];

  getBaseSpellData(spell: SpellJson): SpellJsonData {
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
  map(spell: SpellJson): Spell {
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
  load(): Spell[] {
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
}
