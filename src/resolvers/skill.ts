import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';

type SkillListJson = {
  attributes: {
    UUID: { value: string };
    Skills: { value: string };
  };
};

type SkillListJsonContainer = {
  children: SkillListJson[];
};

@ObjectType()
export class SkillList {
  @Field() uuid: string;
  @Field(() => [String]) skills: string[];
}

@Resolver()
export class SkillResolver {
  private cache: SkillList[];

  private map(skillList: SkillListJson): SkillList {
    return {
      uuid: skillList.attributes.UUID.value,
      skills: skillList.attributes.Skills.value.split(',').map((s) => s.trim()),
    };
  }
  private load(): SkillList[] {
    if (this.cache) {
      return this.cache;
    }
    const data: SkillListJsonContainer = JSON.parse(
      fs.readFileSync('assets/lists/SkillLists.json', { encoding: 'utf8' }),
    );
    this.cache = data.children.map((s) => this.map(s));
    return this.cache;
  }

  @Query(() => [SkillList])
  skillLists(): SkillList[] {
    return this.load();
  }

  @Query(() => SkillList)
  skillList(@Arg('uuid') uuid: string) {
    return this.load().find((s) => s.uuid === uuid);
  }

  @Query(() => [String])
  skills(): string[] {
    return [
      'Acrobatics',
      'AnimalHandling',
      'Arcana',
      'Athletics',
      'Deception',
      'History',
      'Insight',
      'Intimidation',
      'Investigation',
      'Medicine',
      'Nature',
      'Perception',
      'Performance',
      'Persuasion',
      'Religion',
      'SleightOfHand',
      'Stealth',
      'Survival',
    ];
  }
}
