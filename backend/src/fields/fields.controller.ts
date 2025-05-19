import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { Field } from './fields.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

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

  @Roles(Role.ADMIN, Role.FIELD_MANAGER)
  @Post()
  async create(@Body() createFieldDto: CreateFieldDto): Promise<Field> {
    return await this.fieldService.create(createFieldDto);
  }

  @Roles(Role.ADMIN, Role.FIELD_MANAGER)
  @Delete('/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.fieldService.deleteOne(id);
  }
}
