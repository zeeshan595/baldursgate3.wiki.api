import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ResourceEntity } from './resource.entity';
import { SchoolEntity } from './school.entity';

@Entity({ name: 'spell' })
@ObjectType()
export class SpellEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @Column()
  @Field()
  level: number;

  @ManyToOne(() => SchoolEntity, (school) => school.spells, { nullable: false })
  @Field(() => SchoolEntity)
  school: SchoolEntity;

  @ManyToMany(() => ResourceEntity)
  @JoinTable()
  @Field(() => [ResourceEntity])
  resources: ResourceEntity[];
}
