import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ArmorEntity, WeaponEntity, AccessoryEntity } from './equipment.entity';

@Entity({ name: 'quality' })
@ObjectType()
export class QualityEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @Column({ length: 200 })
  description: string;

  @OneToMany(() => WeaponEntity, (weapon) => weapon.quality)
  @Field(() => [WeaponEntity])
  weapons: WeaponEntity[];

  @OneToMany(() => ArmorEntity, (armor) => armor.quality)
  @Field(() => [ArmorEntity])
  armors: ArmorEntity[];

  @OneToMany(() => AccessoryEntity, (accessory) => accessory.quality)
  @Field(() => [AccessoryEntity])
  accessories: AccessoryEntity[];
}
