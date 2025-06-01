import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  ParseUUIDPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './games.entity';
import { User } from 'src/users/users.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateGameDto } from './dto/create-game.dto';
import { QueryGameDto } from './dto/query-game.dto';
import { GameParticipant } from 'src/game-participants/game-participants.entity';
import { QueryAvailableSlotsDto } from './dto/query-available-slots.dto';
import { ParticipationStatus } from 'src/enums/participation-status.enum';
import { GameParticipantsService } from 'src/game-participants/game-participants.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { GameStatus } from 'src/enums/game-status.enum';

@Controller('games')
export class GamesController {
  constructor(
    private readonly gameService: GamesService,
    private readonly gameParticipantService: GameParticipantsService,
  ) {}

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
  @Get('/mygames')
  async getAllMine(@GetUser() user: User): Promise<Game[]> {
    return await this.gameParticipantService.findAllMine(user);
  }

  //get game by id
  @Get('/byid/:id')
  async getById(@Param('id') id: string): Promise<Game> {
    return await this.gameService.findById(id);
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
      queryDto.timezone,
    );
  }

  //create new game and set user as creator
  @Post()
  async create(
    @Body() createGameDto: CreateGameDto,
    @GetUser() user: User,
  ): Promise<Game> {
    return await this.gameService.create(createGameDto, user);
  }

  //join game by id and add user to pending list
  @Post('/:gameId/join')
  async joinGame(
    @Param('gameId') gameId: string,
    @GetUser() user: User,
  ): Promise<GameParticipant> {
    return await this.gameParticipantService.joinGame(
      gameId,
      user,
      ParticipationStatus.PENDING,
    );
  }

  @Post('/:gameId/invite/:userId')
  async inviteFriendToGame(
    @Param('gameId') gameId: string,
    @Body('invited') invited: User,
    @GetUser() inviter: User,
  ): Promise<GameParticipant> {
    return await this.gameParticipantService.inviteFriendToGame(
      gameId,
      inviter,
      invited,
    );
  }

  //join game by id and add user to pending list
  @Delete('/:gameId/leave')
  async leaveGame(
    @Param('gameId') gameId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.gameParticipantService.leaveGame(gameId, user);
  }

  @Roles(Role.ADMIN, Role.FIELD_MANAGER)
  @Patch('/:gameId/approve')
  async approveGame(@Param('gameId') gameId: string): Promise<Game> {
    return await this.gameService.approveGame(gameId, GameStatus.APPROVED);
  }

  @Roles(Role.ADMIN, Role.FIELD_MANAGER)
  @Delete('/:gameId/decline')
  async declineGame(@Param('gameId') gameId: string): Promise<void> {
    await this.gameService.declineGame(gameId);
  }

  @Roles(Role.ADMIN, Role.FIELD_MANAGER)
  @Get('/:fieldId/pendingGames')
  async getPendingGamesByField(
    @Param('fieldId') fieldId: string,
  ): Promise<Game[]> {
    return await this.gameService.findPendingGamesByField(fieldId);
  }

  //get all games in selected field
  @Get('/:fieldId/approvedGames')
  async getApprovedGamesByField(
    @Param('fieldId') fieldId: string,
  ): Promise<Game[]> {
    return await this.gameService.findApprovedGamesByField(fieldId);
  }

  @Roles(Role.ADMIN, Role.FIELD_MANAGER)
  @Get('/:fieldId/allGames')
  async getAllGamesByField(@Param('fieldId') fieldId: string): Promise<Game[]> {
    return await this.gameService.findAllGamesByField(fieldId);
  }

  @Roles(Role.ADMIN)
  @Delete('/:gameId/delete')
  async deleteGame(@Param('gameId') gameId: string): Promise<void> {
    await this.gameService.deleteOne(gameId);
  }

  @Patch('/:gameId/setGameCreator/:userId')
  async setGameCreator(
    @Param('gameId') gameId: string,
    @Param('userId') userId: string,
    @GetUser() requestingUser: User,
  ): Promise<Game> {
    return await this.gameService.setGameCreator(
      gameId,
      userId,
      requestingUser,
    );
  }
}
