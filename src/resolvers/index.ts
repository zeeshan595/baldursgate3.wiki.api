import { NonEmptyArray } from 'type-graphql';
import { SpellResolver } from './spell';
import { BackgroundResolver } from './background';
import { TagResolver } from './tag';
import { RaceResolver } from './race';
import { ClassResolver } from './class';
import { WeaponResolver } from './weapon';

export const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  SpellResolver,
  BackgroundResolver,
  TagResolver,
  RaceResolver,
  ClassResolver,
  WeaponResolver,
];
