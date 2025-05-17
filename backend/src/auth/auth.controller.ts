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
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { User } from '../users/users.entity';
import { authenticatedUser } from './types/authenticatedUser';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<authenticatedUser> {
    return this.authService.login(req.user.uid, req.user.role, req.user.name);
  }

  @Get('protected')
  async getAll(@Request() req): Promise<{ message: string }> {
    return {
      message: `Permission granted for this protected API. Your ID: ${req.user.uid}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req): Promise<authenticatedUser> {
    return this.authService.refreshToken(
      req.user.uid,
      req.user.role,
      req.user.name,
    );
  }

  @Post('signout')
  async signOut(@Request() req): Promise<void> {
    return this.authService.signOut(req.user.uid);
  }
}
