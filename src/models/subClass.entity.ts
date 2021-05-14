import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { FeatureEntity } from './feature.entity';
import { ClassEntity } from './class.entity';
import { ClassLevelEntity } from './classLevel.entity';
import { ObjectType, Field } from 'type-graphql';

@Entity({ name: 'subClass' })
@ObjectType()
@Unique(['name', 'baseClass'])
export class SubClassEntity extends BaseEntity {
  @Column({ length: 20 })
  @Field()
  name: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @ManyToMany(() => FeatureEntity)
  @JoinTable()
  @Field(() => [FeatureEntity])
  features: FeatureEntity[];

  @ManyToOne(() => ClassEntity, (cls) => cls.subclasses, { nullable: false })
  @Field(() => ClassEntity)
  baseClass: ClassEntity;

  @ManyToOne(() => ClassLevelEntity, (classLevel) => classLevel.subclasses, {
    nullable: false,
  })
  @Field(() => ClassLevelEntity)
  level: ClassLevelEntity;
}
