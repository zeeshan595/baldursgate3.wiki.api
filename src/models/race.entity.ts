import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinTable, ManyToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FeatureEntity } from './feature.entity';

@Entity({ name: 'race' })
@Unique(['name', 'subclass'])
@ObjectType()
export class RaceEntity extends BaseEntity {
  @Column({ length: 20 })
  @Field()
  name: string;

  @Column({ length: 20 })
  @Field()
  subclass: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @ManyToMany(() => FeatureEntity)
  @JoinTable()
  @Field(() => [FeatureEntity])
  features: FeatureEntity[];
}
