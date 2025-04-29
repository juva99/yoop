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
            private fieldRepository: Repository<Field>,
          ) {}

      async findAll(): Promise<Field[]> {
        return await this.fieldRepository.find();
      }

      async findById(fieldId: string): Promise<Field> {
                const user =  await this.fieldRepository.findOne({where: {fieldId}});
                if (!user) {
                  throw new NotFoundException(`field with id ${fieldId} not found`);
                }
                return user;
      }

      async deleteOne(fieldId: string): Promise<void> {
        const results = await this.fieldRepository.delete(fieldId);
        if(results.affected === 0){
          throw new NotFoundException(`field with id ${fieldId} not found`);
        }
      }

        async create(createFieldDto: CreateFieldDto): Promise<Field> {
            const field = this.fieldRepository.create(createFieldDto);
            return await this.fieldRepository.save(field);
        }
          
}
