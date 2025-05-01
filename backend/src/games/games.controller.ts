import { Controller, Get, Param, Post, Body, UseGuards, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './games.entity';
import { User } from 'src/users/users.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateGameDto } from './dto/create-game.dto';
import { Field } from 'src/fields/fields.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { QueryGameDto } from './dto/query-game.dto';
import { GameParticipant } from 'src/game-participants/game-participants.entity';

@Controller('games')
export class GamesController {

    constructor(private readonly gameService: GamesService) {}

        @Get()
        async getAll(): Promise<Game[]> {
          return await this.gameService.findAll();
        }

        @Get('/query')
        async queryGames(@Query() queryDto: QueryGameDto): Promise<Game[]> {
          return await this.gameService.queryGames(queryDto);
        }

        @UseGuards(JwtAuthGuard)
        @Get("/mygames")
        async getAllMine(@GetUser() user: User): Promise<Game[]> {
            return await this.gameService.findAllMine(user);
        }

        @Get("/byid/:id")
        async getById(@Param('id') id: string): Promise<Game> {
            return await this.gameService.findById(id);
        }

        @Get("/fieldId/:id")
        async getByFieldId(@Param('id') id: string): Promise<Game[]> {
            return await this.gameService.findByFieldId(id);
        }

        @UseGuards(JwtAuthGuard)
        @Post()
        async create(@Body() createGameDto: CreateGameDto, @GetUser() user: User): Promise<Game> {
            return await this.gameService.create(createGameDto, user);
        }

        @UseGuards(JwtAuthGuard)
        @Post('/:gameId/join')
        async joinGame(
          @Param('gameId') gameId: string,
          @GetUser() user: User,
        ): Promise<GameParticipant> {
          return await this.gameService.joinGame(gameId, user);
        }


}
