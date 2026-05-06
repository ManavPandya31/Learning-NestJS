import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
) {}
  
  async register(email: string, password: string) {

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    return {
      message: 'User Registered Successfully...',
      user,
    };
  }

  async login(email:string, password: string){

    const user = await this.usersService.findByEmail(email);
    
     if (!user) {
        throw new UnauthorizedException('Invalid credentials');
  }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET as string,
      expiresIn: process.env.JWT_REFRESH_EXPIRES as ms.StringValue,
    });

    return {
      user,
      message: 'User Login Successfully...',
      accessToken,
      refreshToken,
    };
  }
}