import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@ObjectType()
export class CoreOutput {
  @Field(() => Boolean)
  @IsBoolean()
  success: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  message?: string; //? = Not required
}
