import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { paginate, Pagination } from '../helpers/pagination';

type ResourceJson = {
  attributes: {
    UUID: { value: string };
    Name: { value: string };
    Description: { value: string };
    DisplayName: { value: string };
    IsSpellResource: { value: boolean };
    MaxLevel: { value: number };
    DiceType: { value: number };
    PartyActionResource: { value: boolean };
    ReplenishType: { value: string };
    ShowOnActionResourcePanel: { value: boolean };
    UpdatesSpellPowerLevel: { value: boolean };
  };
};

type ResourceJsonContainer = {
  children: ResourceJson[];
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

@ObjectType()
export class PaginatedResource extends Pagination<Resource> {
  @Field(() => [Resource])
  items: Resource[];
}

@Resolver()
export class ResourceResolver {
  private cache: Resource[];

  private map(resource: ResourceJson): Resource {
    return {
      uuid: resource.attributes.UUID.value,
      name: resource.attributes.Name.value,
      description: resource.attributes.Description.value,
      displayName: resource.attributes.DisplayName.value,
      diceType: resource.attributes.DiceType.value,
      isSpellResource: resource.attributes.IsSpellResource.value,
      maxLevel: resource.attributes.MaxLevel.value,
      partyActionResource: resource.attributes.PartyActionResource.value,
      replenishType: resource.attributes.ReplenishType.value,
      showOnActionResourcePanel:
        resource.attributes.ShowOnActionResourcePanel.value,
      updateSpellPowerLevel: resource.attributes.UpdatesSpellPowerLevel.value,
    };
  }
  private load(): Resource[] {
    if (this.cache) {
      return this.cache;
    }

    const data: ResourceJsonContainer = JSON.parse(
      fs.readFileSync('assets/resources/ActionResourceDefinitions.json', {
        encoding: 'utf8',
      }),
    );
    this.cache = data.children.map((c) => this.map(c));
    return this.cache;
  }

  @Query(() => [Resource])
  resources() {
    return this.load();
  }

  @Query(() => Resource)
  resource(@Arg('uuid') uuid: string) {
    return this.load().find((r) => r.uuid === uuid);
  }

  @Query(() => PaginatedResource)
  paginatedResource(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
  ): Pagination<Resource> {
    return paginate(this.load(), page, limit);
  }
}
