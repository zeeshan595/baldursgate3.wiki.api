import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SkillEntity } from './skill.entity';

@Entity({ name: 'ability' })
@ObjectType()
export class AbilityEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @OneToMany(() => SkillEntity, (skill) => skill.ability)
  @Field(() => SkillEntity)
  skills: SkillEntity[];
}
