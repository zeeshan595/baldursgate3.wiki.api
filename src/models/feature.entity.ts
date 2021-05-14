import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ArmorEntity, WeaponEntity } from './equipment.entity';

/**
 * types: trait, feat, proficiency, feature, classPassive, equipment
 */

@Entity({ name: 'featureType' })
@ObjectType()
export class FeatureTypeEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @OneToMany(() => FeatureEntity, (feature) => feature.type)
  @Field(() => [FeatureEntity])
  features: FeatureEntity[];
}

@Entity({ name: 'feature' })
@ObjectType()
export class FeatureEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @Column({ length: 200 })
  @Field()
  requirement: string;

  @ManyToOne(() => FeatureTypeEntity, (type) => type.features, {
    nullable: false,
  })
  @Field(() => FeatureTypeEntity)
  type: FeatureTypeEntity;

  @OneToMany(() => ArmorEntity, (armor) => armor.proficiencyRequired)
  @Field(() => [ArmorEntity])
  armors: ArmorEntity[];

  @OneToMany(() => WeaponEntity, (weapon) => weapon.proficiencyRequired)
  @Field(() => [WeaponEntity])
  weapons: WeaponEntity[];
}
