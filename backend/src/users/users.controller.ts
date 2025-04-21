import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { User } from './users.entity';

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

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Delete('/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.userService.deleteOne(id);
  }
}
