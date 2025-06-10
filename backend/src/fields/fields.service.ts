import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from './fields.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { City } from 'src/enums/city.enum';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
    private readonly usersService: UsersService,
  ) {}

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

  async findByCity(citystr: string): Promise<Field[]> {
    const fields = await this.fieldRepository.find({
      where: { city: City[citystr] },
    });
    if (!fields || fields.length === 0) {
      throw new NotFoundException(`No fields found in city ${citystr}`);
    }
    return fields;
  }

  async deleteOne(fieldId: string): Promise<void> {
    const results = await this.fieldRepository.delete(fieldId);
    if (results.affected === 0) {
      throw new NotFoundException(`field with id ${fieldId} not found`);
    }
  }

  async create(
    createFieldDto: CreateFieldDto,
    fieldManager: User,
  ): Promise<Field> {
    const field = this.fieldRepository.create(createFieldDto);

    field.manager = fieldManager;
    field.isManaged = true;

    return await this.fieldRepository.save(field);
  }

  async createMany(createFieldDtos: CreateFieldDto[]): Promise<Field[]> {
    const fields = this.fieldRepository.create(createFieldDtos);
    return await this.fieldRepository.save(fields);
  }

  async upsertMany(createFieldDtos: CreateFieldDto[]): Promise<Field[]> {
    const savedFields: Field[] = [];

    for (const dto of createFieldDtos) {
      let field = await this.fieldRepository.findOneBy({
        fieldName: dto.fieldName,
        fieldLat: dto.fieldLat,
        fieldLng: dto.fieldLng,
      });

      if (field) {
        // Update the existing field
        field = this.fieldRepository.merge(field, dto);
      } else {
        // Create a new field
        field = this.fieldRepository.create(dto);
      }

      savedFields.push(await this.fieldRepository.save(field));
    }

    return savedFields;
  }

  async setManagerToField(fieldId: string, userId: string): Promise<Field> {
    const field = await this.findById(fieldId);
    const newManager = await this.usersService.findById(userId);

    field.isManaged = true;
    field.manager = newManager;

    return await this.fieldRepository.save(field);
  }

  async setFieldPublic(fieldId: string): Promise<Field> {
    const field = await this.findById(fieldId);

    field.isManaged = false;
    field.manager = null;

    return this.fieldRepository.save(field);
  }

  async getFieldsByUser(userId: string): Promise<Field[]> {
    return await this.fieldRepository.find({
      where: { manager: { uid: userId } },
    });
  }
}
