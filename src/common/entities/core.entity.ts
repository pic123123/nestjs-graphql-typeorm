import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsInt, IsDate } from 'class-validator';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn({ comment: 'Primary key' }) //id = primary key TYPEORM DB Column
  @Field(() => Number) //Graphql
  @IsInt() //Validator
  id: number;

  @CreateDateColumn({ comment: 'CreateDate' }) //TypeORM Special Columns
  @Field(() => Date)
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ comment: 'UpdateDate' }) //TypeORM Special Columns
  @Field(() => Date)
  @IsDate()
  updatedAt: Date;
}
