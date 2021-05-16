import { ObjectType, Resolver } from 'type-graphql';

@ObjectType()
export class God {
  uuid: string;
  name: string;
  displayName: string;
  description: string;
  tags: string[];
}

@Resolver()
export class GodResolver {
  
}
