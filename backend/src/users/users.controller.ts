import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { User } from './users.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  
  @Get('/:id')
  async getById(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Get('search_friends/:name')
  async getByName(@Param('name') name: string, @GetUser() user: User): Promise<User[]> {
    return await this.userService.findByName(name, user);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Delete('/:id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    return await this.userService.deleteOne(id);
  }
}
