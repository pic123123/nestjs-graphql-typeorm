import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

import { CoreOutput } from 'src/common/dtos/core.dto';

@InputType()
export class AuthInput {
  @Field((type) => String)
  @IsString()
  token: string;
}

@ObjectType()
export class AuthOutput extends CoreOutput {}
