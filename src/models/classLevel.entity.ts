import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { ActionEntity } from './action.entity';
import { BaseEntity } from './base.entity';
import { FeatureEntity } from './feature.entity';
import { SpellEntity } from './spell.entity';
import { ClassEntity } from './class.entity';
import { SubClassEntity } from './subClass.entity';
import { ObjectType, Field } from 'type-graphql';

@Entity({ name: 'classLevel' })
@ObjectType()
@Unique(['level', 'baseClass'])
export class ClassLevelEntity extends BaseEntity {
  @Column()
  @Field()
  level: number;

  @Column({
    type: 'text',
    array: true,
  })
  @Field(() => [Number])
  spellSlots: number[];

  @Column()
  @Field()
  knownSpells: number;

  @Column()
  @Field()
  proficiencyBonus: number;

  @Column()
  @Field()
  rage: number;

  @Column()
  @Field()
  rageDamage: number;

  @Column()
  @Field()
  sorcery: number;

  @ManyToOne(() => ClassEntity, (cls) => cls.levels, { nullable: false })
  @Field(() => ClassEntity)
  baseClass: ClassEntity;

  @OneToMany(() => SubClassEntity, (subclass) => subclass)
  @Field(() => [SubClassEntity])
  subclasses: SubClassEntity[];

  @ManyToMany(() => ActionEntity)
  @JoinTable()
  @Field(() => [ActionEntity])
  actions: ActionEntity[];

  @ManyToMany(() => SpellEntity)
  @JoinTable()
  @Field(() => [SpellEntity])
  spells: SpellEntity[];

  @ManyToMany(() => FeatureEntity)
  @JoinTable()
  @Field(() => [FeatureEntity])
  features: FeatureEntity[];
}
