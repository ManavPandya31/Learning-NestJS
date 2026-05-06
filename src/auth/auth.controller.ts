import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Res } from '@nestjs/common';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    
  const { accessToken, refreshToken } =
    await this.authService.login(dto.email, dto.password);
    
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  return {
    accessToken,
    };
  }
}