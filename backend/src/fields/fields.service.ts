import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from './fields.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { City } from 'src/enums/city.enum';
import { Game } from 'src/games/games.entity';
import { GamesService } from 'src/games/games.service';
import { GameStatus } from 'src/enums/game-status.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
    private readonly gamesService: GamesService,
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

  async create(createFieldDto: CreateFieldDto): Promise<Field> {
    const field = this.fieldRepository.create(createFieldDto);
    return await this.fieldRepository.save(field);
  }

  async createMany(createFieldDtos: CreateFieldDto[]): Promise<Field[]> {
    const fields = this.fieldRepository.create(createFieldDtos);
    return await this.fieldRepository.save(fields);
  }


  async findPendingGamesByField(fieldId: string): Promise<Game[]> {
    return await this.gamesService.findPendingGamesByField(fieldId);
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
}
