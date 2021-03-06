import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { JokerUser } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(JokerUser, [
  'email',
  'password',
]) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
