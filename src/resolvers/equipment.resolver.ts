import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import {
  AccessoryEntity,
  ArmorEntity,
  EquipmentTypeEntity,
  WeaponEntity,
} from '../models/equipment.entity';
import { paginate, Pagination } from '../helpers/pagination';

@ObjectType()
class PaginationEquipmentTypeEntity extends Pagination<EquipmentTypeEntity> {
  @Field(() => [EquipmentTypeEntity])
  items: EquipmentTypeEntity[];
}

@Resolver()
export class EquipmentTypeResolver {
  constructor(private equipmentTypeRepo = getRepository(EquipmentTypeEntity)) {}

  @Query(() => EquipmentTypeEntity)
  equipmentType(
    @Arg('id')
    id: string,
  ): Promise<EquipmentTypeEntity> {
    return this.equipmentTypeRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => [EquipmentTypeEntity])
  equipmentTypes(): Promise<EquipmentTypeEntity[]> {
    return this.equipmentTypeRepo.find();
  }

  @Query(() => PaginationEquipmentTypeEntity)
  equipmentTypePaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<EquipmentTypeEntity>> {
    return paginate<EquipmentTypeEntity>(this.equipmentTypeRepo, page, limit);
  }
}

@ObjectType()
class PaginationWeaponEntity extends Pagination<WeaponEntity> {
  @Field(() => [WeaponEntity])
  items: WeaponEntity[];
}

@Resolver()
export class WeaponResolver {
  constructor(private weaponRepo = getRepository(WeaponEntity)) {}

  @Query(() => WeaponEntity)
  weapon(
    @Arg('id')
    id: string,
  ): Promise<WeaponEntity> {
    return this.weaponRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => [WeaponEntity])
  weapons(): Promise<WeaponEntity[]> {
    return this.weaponRepo.find();
  }

  @Query(() => PaginationWeaponEntity)
  weaponPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<WeaponEntity>> {
    return paginate<WeaponEntity>(this.weaponRepo, page, limit);
  }
}

@ObjectType()
class PaginationArmorEntity extends Pagination<ArmorEntity> {
  @Field(() => [ArmorEntity])
  items: ArmorEntity[];
}

@Resolver()
export class ArmorResolver {
  constructor(private armorRepo = getRepository(ArmorEntity)) {}

  @Query(() => ArmorEntity)
  armor(
    @Arg('id')
    id: string,
  ): Promise<ArmorEntity> {
    return this.armorRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => [ArmorEntity])
  armors(): Promise<ArmorEntity[]> {
    return this.armorRepo.find();
  }

  @Query(() => PaginationArmorEntity)
  armorPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<ArmorEntity>> {
    return paginate<ArmorEntity>(this.armorRepo, page, limit);
  }
}

@ObjectType()
class PaginationAccessoryEntity extends Pagination<AccessoryEntity> {
  @Field(() => [AccessoryEntity])
  items: AccessoryEntity[];
}

@Resolver()
export class AccessoryResolver {
  constructor(private accessoryRepo = getRepository(AccessoryEntity)) {}

  @Query(() => AccessoryEntity)
  accessory(
    @Arg('id')
    id: string,
  ): Promise<AccessoryEntity> {
    return this.accessoryRepo.findOneOrFail({
      where: {
        uuid: id,
      },
    });
  }

  @Query(() => [AccessoryEntity])
  accessories(): Promise<AccessoryEntity[]> {
    return this.accessoryRepo.find();
  }

  @Query(() => PaginationAccessoryEntity)
  accessoryPaged(
    @Arg('page', { defaultValue: 1 })
    page: number,
    @Arg('limit', { defaultValue: 50 })
    limit: number,
  ): Promise<Pagination<AccessoryEntity>> {
    return paginate<AccessoryEntity>(this.accessoryRepo, page, limit);
  }
}
