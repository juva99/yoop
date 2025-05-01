import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Game } from './games.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { Field } from 'src/fields/fields.entity';
import { User } from 'src/users/users.entity';
import { GameStatus } from 'src/enums/game-status.enum';
import { QueryGameDto } from './dto/query-game.dto';
import { GameParticipant } from 'src/game-participants/game-participants.entity';
import { ParticipationStatus } from 'src/enums/participation-status.enum';

@Injectable()
export class GamesService {
          constructor(
              @InjectRepository(Game)
              private gameRepository: Repository<Game>,

              @InjectRepository(Field)
              private fieldRepository: Repository<Field>,

              @InjectRepository(GameParticipant)
              private gameParticipantRepository: Repository<GameParticipant>,
            ) {}
      
        async findAllMine(user: User): Promise<Game[]> {
          const participations = await this.gameParticipantRepository.find({
            where: { user: { uid: user.uid } },
            relations: ['game', 'game.field', 'game.creator', 'game.gameParticipants', 'game.gameParticipants.user'],
          });
          return participations.map(participation => participation.game);
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
            throw new NotFoundException(`Game with id ${gameId} not found`);
          }
        }

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
            gameParticipants: [],
          });
          
          const creatorParticipation = this.gameParticipantRepository.create({
            game: game,
            user: user,
            status: ParticipationStatus.APPROVED,
          });
          const savedGame = await this.gameRepository.save(game);
          creatorParticipation.game = savedGame;
          await this.gameParticipantRepository.save(creatorParticipation);
          
          return this.findById(savedGame.gameId);
        }

        async joinGame(gameId: string, user: User): Promise<GameParticipant> {
          const game = await this.gameRepository.findOne({ 
            where: { gameId },
            relations: ['gameParticipants']
          });
      
          if (!game) {
            throw new NotFoundException(`Game with id ${gameId} not found`);
          }
      
          if (game.gameParticipants.length >= game.maxParticipants) {
            throw new BadRequestException('Game is already full');
          }
      
          const existingParticipation = await this.gameParticipantRepository.findOne({
            where: { 
              game: { gameId: gameId },
              user: { uid: user.uid }
            }
          });
      
          if (existingParticipation) {
            throw new ConflictException('User is already participating in this game');
          }
      
          const newParticipation = this.gameParticipantRepository.create({
            game: game,
            user: user,
            status: ParticipationStatus.PENDING
          });
      
          return await this.gameParticipantRepository.save(newParticipation);
        }

        async queryGames(queryDto: QueryGameDto): Promise<Game[]> {
          const { gameType, startDate, endDate, city } = queryDto;
          const query = this.gameRepository.createQueryBuilder('game')
            .leftJoinAndSelect('game.field', 'field')
            .leftJoinAndSelect('game.creator', 'creator')
            .leftJoinAndSelect('game.gameParticipants', 'gameParticipant')
            .leftJoinAndSelect('gameParticipant.user', 'participantUser');
      
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
