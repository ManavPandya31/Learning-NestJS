import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { UseGuards, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
    //secure: false, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  return {
    accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
    getProfile(@CurrentUser() user: any) {
      return {
        message: 'Profile fetched successfully',
        user,
    };
}

  @Post('refresh')
  refresh(@Req() req: Request) {
    const refreshToken = req.cookies.refreshToken;

    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
      res.clearCookie('refreshToken');

      return {
        message: 'Logged out successfully...',
      };
    }
}