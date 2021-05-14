import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbilityEntity } from './ability.entity';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'skill',
})
@ObjectType()
export class SkillEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @Column({ length: 20 })
  @Field()
  description: string;

  @ManyToOne(() => AbilityEntity, (ability) => ability.skills, {
    nullable: false,
  })
  @Field(() => AbilityEntity)
  ability: AbilityEntity;
}
