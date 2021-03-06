import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthInput, AuthOutput } from './dtos/auth.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JokerUser } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => JokerUser)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // query{
  //     getHello
  //   }
  @Query((returns) => String)
  getHello(): string {
    return this.usersService.getHello();
  }
  // mutation{
  //     createAccount(input:{
  //       email:"pic123123@nate.com125",
  //       password:"1111",
  //     })
  //     {
  //       success
  //       message
  //     }
  //   }
  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  // mutation{
  //     login(input:{
  //       email:"pic123123@nate.com125",
  //       password:"1111"
  //     })
  //     {
  //       success
  //       message
  //       token
  //     }
  //   }
  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  // query{
  //     auth(input:{
  //       token:""
  //     })
  //     {
  //       success
  //       message
  //     }
  //   }
  @Query((returns) => AuthOutput)
  async auth(@Args('input') authInput: AuthInput): Promise<AuthOutput> {
    return await this.usersService.auth(authInput);
  }
}
