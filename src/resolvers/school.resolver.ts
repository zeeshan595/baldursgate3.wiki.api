import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { SchoolEntity } from '../models/school.entity';
import { getRepository } from 'typeorm';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationSchoolEntity extends Pagination<SchoolEntity> {
  @Field(() => [SchoolEntity])
  items: SchoolEntity[];
}

@Resolver()
export class SchoolResolver {
  constructor(private schoolRepo = getRepository(SchoolEntity)) {}

  @Query(() => [SchoolEntity])
  schools() {
    return this.schoolRepo.find();
  }

  @Query(() => SchoolEntity)
  school(@Arg('id') id: string): Promise<SchoolEntity> {
    return this.schoolRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => PaginationSchoolEntity)
  schoolPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<SchoolEntity>> {
    return paginate<SchoolEntity>(this.schoolRepo, page, limit);
  }
}
