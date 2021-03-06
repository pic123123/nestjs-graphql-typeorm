import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { JokerUser } from './entities/user.entity';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthInput, AuthOutput } from './dtos/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(JokerUser) private readonly users: Repository<JokerUser>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createAccount({
    email,
    password,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    console.log(`Create Account Start: email:${email}`);
    try {
      const emailCheck = await this.users.findOne({ email });
      //console.log(emailCheck);
      //If the e-mail address exists in the database, fail. If not, start signing up.
      if (emailCheck) {
        return {
          success: false,
          message: 'You are already a registered member.',
        };
      } else {
        const salt = Math.round(new Date().valueOf() * Math.random()) + ''; //Current Time * Random Value
        // createHash(algorithm sha512)
        // update(apssword + salt)
        // digest(Encoding method)
        const hashPassword = crypto
          .createHash('sha512')
          .update(password + salt)
          .digest('base64');
        const user = await this.users.save(
          this.users.create({ email, password: hashPassword, salt }),
        );
        //console.log(user);
        return {
          success: true,
          message: 'You have successfully registered as a member.',
        };
      }
    } catch (e) {
      console.log(`${e} + createAccount Error`);
      return { success: false, message: 'Failed to sign up for membership' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    console.log(`Login Start: email: ${email}`);
    try {
      const userInfo = await this.users.findOne(
        { email },
        { select: ['id', 'password', 'salt'] },
      );
      //Check your email in DataBase and log in if it exists, or log in if it does not.
      if (!userInfo) {
        return {
          success: false,
          message:
            'This member does not exist. Please sign in after registering as a member.',
        };
      }
      const salt = userInfo.salt;
      const hashPassword = crypto
        .createHash('sha512')
        .update(password + salt)
        .digest('base64');
      if (hashPassword !== userInfo?.password) {
        return {
          success: false,
          message: 'The password is incorrect. Please check again.',
        };
      }

      const payLoad = {
        email: email,
        uuid4: uuidv4(),
      };
      const token = jwt.sign(payLoad, process.env.JWT_SECRET_KEY, {
        expiresIn: '3h',
        algorithm: 'HS512',
      });

      return { success: true, message: 'Login succeeded.', token: token };
    } catch (e) {
      console.log(`${e} + Login Error`);
      return { success: false, message: 'Login failed. Please check again.' };
    }
  }

  async auth({ token }: AuthInput): Promise<AuthOutput> {
    console.log(`Auth Start`);
    try {
      const decodedData: any = jwt.verify(token, process.env.JWT_SECRET_KEY); //1. JWT Decode
      const email = decodedData?.email;
      const emailCheck = await this.users.findOne({ email });
      //If the email decoded from JSONWebToken and the email existing in the database are the same, authentication is successful.
      if (!emailCheck) {
        return { success: false, message: 'Authentication failed.' };
      }
      return { success: true, message: 'Authentication successful' };
    } catch (e) {
      console.log(`${e} + Auth Error`);
      if (e.message === 'invalid signature') {
        return { success: false, message: 'The token is not normal.' };
      }
      if (e.message === 'TokenExpiredError' || 'jwt expired') {
        return {
          success: false,
          message: 'The token has expired. Please log in again.',
        };
      }
      return { success: false, message: 'Authentication failed.' };
    }
  }
}
