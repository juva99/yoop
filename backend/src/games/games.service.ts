import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Game } from './games.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { Field } from 'src/fields/fields.entity';
import { User } from 'src/users/users.entity';
import { FieldsService } from 'src/fields/fields.service';
import { GameStatus } from 'src/enums/game-status.enum';
import { QueryGameDto } from './dto/query-game.dto';

@Injectable()
export class GamesService {
          constructor(
              @InjectRepository(Game)
              private gameRepository: Repository<Game>,

              @InjectRepository(Field)
              private fieldRepository: Repository<Field>,
            ) {}
      
        async findAllMine(user: User): Promise<Game[]> {
          return await this.gameRepository.find({where: {participants: user}});
        }

        async findAll(): Promise<Game[]> {
          return await this.gameRepository.find();
        }

        async findById(gameId: string): Promise<Game> {
                  const game =  await this.gameRepository.findOne({where: {gameId}});
                  if (!game) {
                    throw new NotFoundException(`field with id ${gameId} not found`);
                  }
                  return game;
        }

        async findByFieldId(fieldId: string): Promise<Game[]> {
          const game =  await this.gameRepository.find({relations: ['field'], where: {field: {
            fieldId
          }}});
          if (!game) {
            throw new NotFoundException(`field with id ${fieldId} not found`);
          }
          return game;
          }

        async deleteOne(gameId: string): Promise<void> {
          const results = await this.gameRepository.delete(gameId);
          if(results.affected === 0){
            throw new NotFoundException(`field with id ${gameId} not found`);
          }
        }

        //create with user and field
        async create(createGameDto: CreateGameDto, user: User): Promise<Game> {
          const {gameType, startDate, endDate, maxParticipants, field} = createGameDto;
          const fieldd =  await this.fieldRepository.findOne({where: {fieldId: field}});
          if (!fieldd) {
            throw new NotFoundException(`field with id ${field} not found`);
          }
          
          const game = this.gameRepository.create({
            gameType,
            startDate,
            endDate,
            maxParticipants,
            creator: user,
            field: fieldd,
            status: GameStatus.AVAILABLE,
          });
          return await this.gameRepository.save(game);
        }

        async queryGames(queryDto: QueryGameDto): Promise<Game[]> {
          const { gameType, startDate, endDate, city } = queryDto;
          const query = this.gameRepository.createQueryBuilder('game')
            .leftJoinAndSelect('game.field', 'field')
            .leftJoinAndSelect('game.creator', 'creator')
            .leftJoinAndSelect('game.participants', 'participants');
      
          if (gameType) {
            query.andWhere('game.gameType = :gameType', { gameType });
          }
      
          if (startDate) {
            query.andWhere('game.startDate >= :startDate', { startDate });
          }
      
          if (endDate) {
            query.andWhere('game.endDate <= :endDate', { endDate });
          }
      
          if (city) {
            query.andWhere('field.city = :city', { city });
          }
      
          return await query.getMany();
        }
        
}
