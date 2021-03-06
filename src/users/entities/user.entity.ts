import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

enum MasterRole {
  Users, //0 = user
  Master, // 1 = master
}

registerEnumType(MasterRole, { name: 'MasterRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class JokerUser extends CoreEntity {
  @Column({ length: 100, comment: 'user email', nullable: false })
  @Field((type) => String)
  @IsString()
  email: string;

  @Column({ select: false, length: 200, comment: 'password', nullable: false })
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({
    select: false,
    length: 100,
    comment: 'Value for password encryption verification',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  @IsString()
  salt?: string;

  @Column({
    type: 'enum',
    enum: MasterRole,
    comment: 'Users(0), Master(1)',
    nullable: true,
    default: 0,
  })
  @Field((type) => MasterRole, { nullable: true })
  role?: MasterRole;
}
