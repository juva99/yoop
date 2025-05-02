import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './games.entity';
import { User } from 'src/users/users.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateGameDto } from './dto/create-game.dto';
import { Field } from 'src/fields/fields.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { QueryGameDto } from './dto/query-game.dto';
import { GameParticipant } from 'src/game-participants/game-participants.entity';
import { QueryAvailableSlotsDto } from './dto/query-available-slots.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  //get all games
  @Get()
  async getAll(): Promise<Game[]> {
    return await this.gameService.findAll();
  }

  //get games by query
  @Get('/query')
  async queryGames(@Query() queryDto: QueryGameDto): Promise<Game[]> {
    return await this.gameService.queryGames(queryDto);
  }

  //get all games connected user is participating in
  @UseGuards(JwtAuthGuard)
  @Get('/mygames')
  async getAllMine(@GetUser() user: User): Promise<Game[]> {
    return await this.gameService.findAllMine(user);
  }

  //get game by id
  @Get('/byid/:id')
  async getById(@Param('id') id: string): Promise<Game> {
    return await this.gameService.findById(id);
  }

  //get all games in selected field
  @Get('/fieldId/:id')
  async getByFieldId(@Param('id') id: string): Promise<Game[]> {
    return await this.gameService.findByFieldId(id);
  }

  //get available slots for a field on a specific date
  @Get('/available-slots/:fieldId')
  async getAvailableSlots(
    @Param('fieldId', ParseUUIDPipe) fieldId: string,
    @Query() queryDto: QueryAvailableSlotsDto,
  ): Promise<string[]> {
    return await this.gameService.calculateAvailableSlots(
      fieldId,
      queryDto.date,
    );
  }

  //create new game and set user as creator
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createGameDto: CreateGameDto,
    @GetUser() user: User,
  ): Promise<Game> {
    return await this.gameService.create(createGameDto, user);
  }

  //join game by id and add user to pending list
  @UseGuards(JwtAuthGuard)
  @Post('/:gameId/join')
  async joinGame(
    @Param('gameId') gameId: string,
    @GetUser() user: User,
  ): Promise<GameParticipant> {
    return await this.gameService.joinGame(gameId, user);
  }
}
