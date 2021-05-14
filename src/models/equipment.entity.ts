import { Field, ObjectType } from 'type-graphql';
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
import { QualityEntity } from './quality.entity';
import { SpellEntity } from './spell.entity';

@Entity({ name: 'equipmentType' })
@Unique(['name', 'subType'])
@ObjectType()
export class EquipmentTypeEntity extends BaseEntity {
  @Column({ length: 20 })
  @Field()
  name: string;

  @Column({ length: 20 })
  @Field()
  subType: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @OneToMany(() => ArmorEntity, (equipment) => equipment.type)
  @Field(() => [ArmorEntity])
  armors: ArmorEntity[];

  @OneToMany(() => WeaponEntity, (equipment) => equipment.type)
  @Field(() => [WeaponEntity])
  weapons: WeaponEntity[];

  @OneToMany(() => AccessoryEntity, (equipment) => equipment.type)
  @Field(() => [AccessoryEntity])
  accessories: AccessoryEntity[];
}

export class BaseEquipment extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @ManyToOne(() => QualityEntity, (quality) => quality.weapons, {
    nullable: false,
  })
  @Field(() => QualityEntity)
  quality: QualityEntity;

  @ManyToMany(() => FeatureEntity)
  @JoinTable()
  @Field(() => [FeatureEntity])
  features: FeatureEntity[];

  @ManyToMany(() => ActionEntity)
  @JoinTable()
  @Field(() => ActionEntity)
  action: ActionEntity;

  @ManyToMany(() => SpellEntity)
  @JoinTable()
  @Field(() => SpellEntity)
  spell: SpellEntity;
}

@Entity({ name: 'weapon' })
@ObjectType()
export class WeaponEntity extends BaseEquipment {
  @Column({ length: 200 })
  @Field()
  damage: string;

  @Column()
  @Field()
  range: number;

  @Column()
  @Field()
  isRanged: boolean;

  @ManyToOne(() => FeatureEntity, (feature) => feature.weapons, {
    nullable: false,
  })
  @Field(() => FeatureEntity)
  proficiencyRequired: FeatureEntity;

  @ManyToOne(() => EquipmentTypeEntity, (type) => type.weapons, {
    nullable: false,
  })
  @Field(() => EquipmentTypeEntity)
  type: EquipmentTypeEntity;
}

@Entity({ name: 'armor' })
@ObjectType()
export class ArmorEntity extends BaseEquipment {
  @Column({ length: 200 })
  @Field()
  armorClass: string;

  @ManyToOne(() => FeatureEntity, (feature) => feature.armors, {
    nullable: false,
  })
  @Field(() => FeatureEntity)
  proficiencyRequired: FeatureEntity;

  @ManyToOne(() => EquipmentTypeEntity, (type) => type.armors, {
    nullable: false,
  })
  @Field(() => EquipmentTypeEntity)
  type: EquipmentTypeEntity;
}

@Entity({ name: 'accessory' })
@ObjectType()
export class AccessoryEntity extends BaseEquipment {
  @ManyToOne(() => EquipmentTypeEntity, (type) => type.accessories, {
    nullable: false,
  })
  @Field(() => EquipmentTypeEntity)
  type: EquipmentTypeEntity;
}
