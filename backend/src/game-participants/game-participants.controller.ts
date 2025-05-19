import { Body, Controller, Get, Patch } from '@nestjs/common';
import { GameParticipantsService } from './game-participants.service';
import { SetStatusDto } from './dto/set-status.dto';
import { GameParticipant } from './game-participants.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/users.entity';
import { Game } from 'src/games/games.entity';

@Controller('game-participants')
export class GameParticipantsController {
  constructor(
    private readonly gameParticipantsService: GameParticipantsService,
  ) {}

  @Patch('/set-status')
  async setStatus(
    @Body() setStatusDto: SetStatusDto,
  ): Promise<GameParticipant> {
    return await this.gameParticipantsService.setStatus(setStatusDto);
  }

}
