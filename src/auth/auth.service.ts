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
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
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

  //Refresh Token Api...
  async refreshToken(token: string) {

    //Token Is Verified Is This Token Is Valid Or Not...
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      //console.log("Payload...",payload);
      
      //When Access Token IS Expired Then Create New Access Token...
      const newAccessToken = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
      });

      return {
        accessToken: newAccessToken,
      };

    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}