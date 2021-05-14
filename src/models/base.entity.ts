import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';

@ObjectType({
  isAbstract: true,
})
export class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    generated: 'uuid',
    unique: true,
  })
  @Field({
    name: 'id',
  })
  uuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 200 })
  @Field()
  icon: string;
}
