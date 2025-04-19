import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService
  ) {}


  // TODO: add return type
  async registerUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.userEmail);
    if (existingUser) {
      throw new ConflictException("User with this email is already registered") 
    }
    return this.usersService.create(createUserDto);
  }
}
