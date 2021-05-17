import * as fs from 'fs';
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { paginate, Pagination } from '../helpers/pagination';

type LocalizationJson = {
  attributes: {
    UUID: string;
    Content: string;
  };
};

type LocalizationJsonContainer = {
  children: {
    children: LocalizationJson[];
  }[];
};

@ObjectType()
export class Localization {
  @Field() uuid: string;
  @Field() key: string;
}

@ObjectType()
export class PaginatedLocalization extends Pagination<Localization> {
  @Field(() => [Localization]) items: Localization[];
}

@Resolver()
export class LocalizationResolver {
  private cache: Localization[];
  private cacheEnglish: {
    [key: string]: string;
  };

  private map(localization: LocalizationJson): Localization {
    let key = '';
    if (typeof localization.attributes.Content === 'string') {
      key = localization.attributes.Content;
    } else {
      key = (localization.attributes.Content as any).handle;
    }
    return {
      uuid: localization.attributes.UUID,
      key,
    };
  }
  private loadRecursive(path: string): Localization[] {
    let rtn: Localization[] = [];
    if (fs.lstatSync(path).isDirectory()) {
      const files = fs.readdirSync(path);
      for (const file of files) {
        const data = this.loadRecursive(`${path}/${file}`);
        rtn = [...rtn, ...data];
      }
    } else {
      const content: LocalizationJsonContainer[] = JSON.parse(
        fs.readFileSync(path, {
          encoding: 'utf8',
        }),
      );
      const data = content[0].children[0].children.map((c) => this.map(c));
      rtn = [...rtn, ...data];
    }

    return rtn;
  }
  private load() {
    if (this.cache) {
      return this.cache;
    }
    this.cache = this.loadRecursive('assets/localization');
    return this.cache;
  }
  private loadEnglish(): {
    [key: string]: string;
  } {
    if (this.cacheEnglish) {
      return this.cacheEnglish;
    }

    this.cacheEnglish = JSON.parse(
      fs.readFileSync('assets/localization.json', { encoding: 'utf8' }),
    );
    return this.cacheEnglish;
  }

  @Query(() => [Localization])
  localizations(): Localization[] {
    return this.load();
  }

  @Query(() => Localization)
  localization(@Arg('uuid') uuid: string): Localization {
    return this.load().find((l) => l.uuid === uuid);
  }

  @Query(() => String)
  english(@Arg('key') key: string): string {
    return this.loadEnglish()[key];
  }

  @Query(() => String)
  translate(@Arg('key') key: string): string {
    if (key.includes('_')) {
      return this.english(this.localization(key).key);
    } else {
      return this.english(key);
    }
  }

  @Query(() => PaginatedLocalization)
  paginatedLocalization(
    @Arg('page', { defaultValue: 1 }) page: number,
    @Arg('limit', { defaultValue: 50 }) limit: number,
  ): Pagination<Localization> {
    return paginate(this.load(), page, limit);
  }
}
