import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { User } from '../users/users.entity';
import { authenticatedUser } from './types/authenticatedUser';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/get-user.decorator';

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
  async login(@GetUser() user): Promise<authenticatedUser> {
    return this.authService.login(user.uid, user.role, user.name);
  }

  @Get('protected')
  async getAll(@GetUser() user): Promise<{ message: string }> {
    return {
      message: `Permission granted for this protected API. Your ID: ${user.uid}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@GetUser() user): Promise<authenticatedUser> {
    return this.authService.refreshToken(user.uid, user.role, user.name);
  }

  @Post('signout')
  async signOut(@GetUser() user): Promise<void> {
    return this.authService.signOut(user.uid);
  }
}
