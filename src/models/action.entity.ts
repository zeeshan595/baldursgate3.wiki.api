import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ResourceEntity } from './resource.entity';

@Entity({ name: 'action' })
@ObjectType()
export class ActionEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  @Field()
  name: string;

  @Column({ length: 200 })
  @Field()
  description: string;

  @Column()
  @Field()
  range: number;

  @Column({ length: 200 })
  @Field()
  requirement: string;

  @ManyToMany(() => ResourceEntity)
  @JoinTable()
  @Field(() => [ResourceEntity])
  resources: ResourceEntity[];
}
