import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { AbilityEntity } from './ability.entity';
import { BaseEntity } from './base.entity';
import { FeatureEntity } from './feature.entity';
import { ClassLevelEntity } from './classLevel.entity';
import { SubClassEntity } from './subClass.entity';
import { ObjectType, Field } from 'type-graphql';

@Entity({ name: 'class' })
@ObjectType()
export class ClassEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @Column()
  @Field()
  startingHp: number;

  @Column()
  @Field()
  hpOnEveryLevel: number;

  @ManyToMany(() => AbilityEntity)
  @JoinTable()
  @Field(() => [AbilityEntity], { nullable: false })
  primaryAbilities: AbilityEntity[];

  @ManyToMany(() => AbilityEntity)
  @JoinTable()
  @Field(() => [AbilityEntity], { nullable: false })
  savingThrows: AbilityEntity[];

  @ManyToMany(() => FeatureEntity)
  @JoinTable()
  @Field(() => [FeatureEntity], { nullable: false })
  features: FeatureEntity[];

  @OneToMany(() => SubClassEntity, (subclass) => subclass.baseClass)
  @Field(() => [SubClassEntity], { nullable: false })
  subclasses: SubClassEntity[];

  @OneToMany(() => ClassLevelEntity, (levels) => levels.baseClass)
  @Field(() => [ClassLevelEntity], { nullable: false })
  levels: ClassLevelEntity[];
}
