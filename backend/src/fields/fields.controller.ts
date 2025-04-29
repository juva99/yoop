import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { Field } from './fields.entity';
import { CreateFieldDto } from './dto/create-field.dto';

@Controller('fields')
export class FieldsController {

    constructor(private readonly fieldService: FieldsService) {}

    @Get()
    async getAll(): Promise<Field[]> {
      return await this.fieldService.findAll();
    }
  
    @Get("/:id")
    async getById(@Param('id') id: string): Promise<Field>{
      return await this.fieldService.findById(id);
    }

    @Post()
    async create(@Body() createFieldDto: CreateFieldDto): Promise<Field> {
      return await this.fieldService.create(createFieldDto);
    }

    @Delete('/:id')
    async deleteOne(@Param('id') id: string){
      return await this.fieldService.deleteOne(id);
    }
}
