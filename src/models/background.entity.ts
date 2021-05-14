import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SkillEntity } from './skill.entity';

@Entity({
  name: 'background',
})
@ObjectType()
export class BackgroundEntity extends BaseEntity {
  @Field()
  @Column({ length: 20, unique: true })
  name: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @ManyToMany(() => SkillEntity)
  @JoinTable()
  @Field(() => [SkillEntity])
  skill: SkillEntity[];
}
