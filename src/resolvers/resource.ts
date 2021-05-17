import { Field, ObjectType, Resolver } from "type-graphql";

type ResourceJson = {
  
};

@ObjectType()
export class Resource {
  @Field() uuid: string;
  @Field() name: string;
  @Field() description: string;
  @Field() displayName: string;
  @Field() isSpellResource: boolean;
  @Field() maxLevel: number;
  @Field() partyActionResource: boolean;
  @Field() replenishType: string;
  @Field() showOnActionResourcePanel: boolean;
  @Field() updateSpellPowerLevel: boolean;
  @Field() diceType: number;
}

@Resolver()
export class ResourceResolver {
}