import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';

type TagJson = {
  name: string;
  attributes: {
    Description: {
      type: number;
      value: string;
    };
    DisplayDescription: {
      type: number;
      value: string;
    };
    DisplayName: {
      type: number;
      value: string;
    };
    Icon: {
      type: number;
      value: string;
    };
    Name: {
      type: number;
      value: string;
    };
    UUID: {
      type: number;
      value: string;
    };
  };
  children: {
    name: string;
    attributes: {};
    children: {
      attributes: {
        Name: {
          type: number;
          value: string;
        };
      };
    }[];
  }[];
};

@ObjectType()
export class Tag {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field()
  displayName: string;

  @Field()
  description: string;

  @Field(() => [String], { nullable: true })
  categories: string[];
}

@Resolver()
export class TagResolver {
  cache: Tag[];

  map(tag: TagJson): Tag {
    return {
      uuid: tag.attributes.UUID.value,
      name: tag.attributes.Name.value,
      displayName: tag.attributes.DisplayName.value,
      description: tag.attributes.DisplayDescription.value,
      categories: tag.children[0].children.map((c) => c.attributes.Name.value),
    };
  }
  load(): Tag[] {
    if (this.cache) {
      return this.cache;
    }

    const tags: Tag[] = [];
    const tagFiles = fs.readdirSync('assets/tags');
    for (const tag of tagFiles) {
      const rawtag: TagJson = JSON.parse(
        fs.readFileSync(`assets/tags/${tag}`, { encoding: 'utf8' }),
      );
      tags.push(this.map(rawtag));
    }
    this.cache = tags;
    return tags;
  }

  @Query(() => [Tag])
  tags(): Tag[] {
    return this.load();
  }

  @Query(() => Tag)
  tag(@Arg('uuid') uuid: string): Tag {
    return this.load().find((t) => t.uuid === uuid);
  }
}
