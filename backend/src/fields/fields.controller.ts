import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { Field } from './fields.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Game } from 'src/games/games.entity';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldService: FieldsService) {}

  @Get()
  async getAll(): Promise<Field[]> {
    return await this.fieldService.findAll();
  }

  @Get('/by-city')
  async getByCity(@Query('city') city: string): Promise<Field[]> {
    return await this.fieldService.findByCity(city);
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Field> {
    return await this.fieldService.findById(id);
  }

  @Post()
  async create(@Body() createFieldDto: CreateFieldDto): Promise<Field> {
    return await this.fieldService.create(createFieldDto);
  }

  @Delete('/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.fieldService.deleteOne(id);
  }

  @Roles(Role.ADMIN, Role.FIELD_MANAGER)
  @Patch('/:id/approve')
  async approveGame(@Param('id') gameId: string): Promise<Game> {
    return await this.fieldService.approveGame(gameId);
  }

  @Roles(Role.ADMIN, Role.FIELD_MANAGER)
  @Patch('/:id/decline')
  async declineGame(@Param('id') gameId: string): Promise<void> {
    await this.fieldService.declineGame(gameId);
  }
}
