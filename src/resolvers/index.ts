import { NonEmptyArray } from 'type-graphql';
import { SpellResolver } from './spell';
import { BackgroundResolver } from './background';
import { TagResolver } from './tag';
import { RaceResolver } from './race';
import { ClassResolver } from './class';
import { WeaponResolver } from './weapon';
import { FeatResolver } from './feat';
import { GodResolver } from './god';
import { ResourceResolver } from './resource';
import { AbilityResolver } from './ability';
import { PassiveResolver } from './passive';

export const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  SpellResolver,
  BackgroundResolver,
  TagResolver,
  RaceResolver,
  ClassResolver,
  WeaponResolver,
  FeatResolver,
  GodResolver,
  ResourceResolver,
  AbilityResolver,
  PassiveResolver,
];
