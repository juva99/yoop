import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { User } from '../users/users.entity';
import { authenticatedUser } from './types/authenticatedUser';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.registerUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<authenticatedUser> {
    return this.authService.login(req.user.uid, req.user.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async getAll(@Request() req): Promise<{ message: string }> {
    return {
      message: `Permission granted for this protected API. Your ID: ${req.user.uid}`,
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req): Promise<authenticatedUser> {
    return this.authService.refreshToken(req.user.uid, req.user.name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOut(@Request() req): Promise<void> {
    return this.authService.signOut(req.user.uid)
  }
}
