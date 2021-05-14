import { NonEmptyArray } from 'type-graphql';
import { AbilityResolver } from './ability.resolver';
import { ActionResolver } from './action.resolver';
import { BackgroundResolver } from './background.resolver';
import { ClassResolver } from './class.resolver';
import { ClassLevelResolver } from './classLevel.resolver';
import {
  AccessoryResolver,
  ArmorResolver,
  EquipmentTypeResolver,
  WeaponResolver,
} from './equipment.resolver';
import { FeatureResolver } from './feature.resolver';
import { ItemResolver } from './item.resolver';
import { QualityResolver } from './quality.resolver';
import { RaceResolver } from './race.resolver';
import { ResourceResolver } from './resource.resolver';
import { SchoolResolver } from './school.resolver';
import { SkillResolver } from './skill.resolver';
import { SpellResolver } from './spell.resolver';
import { StatusResolver } from './status.resolver';
import { SubClassResolver } from './subClass.resolver';

export const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  AbilityResolver,
  ActionResolver,
  BackgroundResolver,
  ClassResolver,
  ClassLevelResolver,
  EquipmentTypeResolver,
  WeaponResolver,
  ArmorResolver,
  AccessoryResolver,
  FeatureResolver,
  ItemResolver,
  QualityResolver,
  RaceResolver,
  ResourceResolver,
  SchoolResolver,
  SkillResolver,
  SpellResolver,
  StatusResolver,
  SubClassResolver,
];
