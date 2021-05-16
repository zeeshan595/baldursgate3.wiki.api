import { NonEmptyArray } from 'type-graphql';
import { SpellResolver } from './spell';
import { BackgroundResolver } from './background';
import { TagResolver } from './tag';
import { RaceResolver } from './race';

export const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  SpellResolver,
  BackgroundResolver,
  TagResolver,
  RaceResolver,
];
