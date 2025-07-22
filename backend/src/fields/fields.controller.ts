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
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/users.entity';

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
  async create(
    @Body() createFieldDto: CreateFieldDto,
    @GetUser() fieldManager: User,
  ): Promise<Field> {
    return await this.fieldService.create(createFieldDto, fieldManager);
  }

  @Roles(Role.ADMIN, Role.FIELD_MANAGER)
  @Delete('/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.fieldService.deleteOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch('/:fieldId/setManager/:userId')
  async setManagerToField(
    @Param('fieldId') fieldId: string,
    @Param('userId') userId: string,
  ): Promise<Field> {
    return await this.fieldService.setManagerToField(fieldId, userId);
  }

  @Roles(Role.ADMIN)
  @Patch('/:fieldId/setPublic')
  async setFieldPublic(@Param('fieldId') fieldId: string): Promise<Field> {
    return await this.fieldService.setFieldPublic(fieldId);
  }

  @Roles(Role.ADMIN, Role.FIELD_MANAGER)
  @Get('/:userId/allFields')
  async getFieldsByUser(@Param('userId') userId: string): Promise<Field[]> {
    return await this.fieldService.getFieldsByUser(userId);
  }
}
