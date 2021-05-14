import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'status' })
@ObjectType()
export class StatusEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @Column({ length: 200 })
  @Field()
  description: string;
}
