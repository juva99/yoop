import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from './fields.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';


@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>) {}

  async findAll(): Promise<Field[]> {
    return await this.fieldRepository.find();
  }

  async findById(fieldId: string): Promise<Field> {
    const field = await this.fieldRepository.findOne({ where: { fieldId } });
    if (!field) {
      throw new NotFoundException(`field with id ${fieldId} not found`);
    }
    return field;
  }

  async findByCity(city: string): Promise<Field[]> {
    const fields = await this.fieldRepository.find({ where: { city } });
    if (!fields || fields.length === 0) {
      throw new NotFoundException(`No fields found in city ${city}`);
    }
    return fields;
  }

  async deleteOne(fieldId: string): Promise<void> {
    const results = await this.fieldRepository.delete(fieldId);
    if (results.affected === 0) {
      throw new NotFoundException(`field with id ${fieldId} not found`);
    }
  }

  async create(createFieldDto: CreateFieldDto): Promise<Field> {
    const field = this.fieldRepository.create(createFieldDto);
    return await this.fieldRepository.save(field);
  }

}
