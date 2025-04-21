import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  // TODO: add return type
  @Post('signup')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
