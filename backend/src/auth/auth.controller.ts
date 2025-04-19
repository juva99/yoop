import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-users.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  // TODO: add return type
  @Post('signup')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto)
  }
}
