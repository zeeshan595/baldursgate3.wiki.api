import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SpellEntity } from './spell.entity';

@Entity({ name: 'school' })
@ObjectType()
export class SchoolEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @OneToMany(() => SpellEntity, (spell) => spell.school)
  @Field(() => [SpellEntity])
  spells: SpellEntity[];
}
