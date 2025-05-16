import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from './fields.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { City } from 'src/enums/city.enum';
import { CreateGameDto } from 'src/games/dto/create-game.dto';
import { User } from 'src/users/users.entity';
import { Game } from 'src/games/games.entity';
import { GamesService } from 'src/games/games.service';
import { GameStatus } from 'src/enums/game-status.enum';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
    private readonly gamesService: GamesService,
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

  async approveGame(gameId: string): Promise<Game> {
    const game = this.gamesService.updateGameStatus(
      gameId,
      GameStatus.APPROVED,
    );
    return game;
  }

  async declineGame(gameId: string): Promise<void> {
    return await this.gamesService.deleteOne(gameId);
  }
}
