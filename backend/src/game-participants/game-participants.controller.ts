import { Body, Controller, Patch } from '@nestjs/common';
import { GameParticipantsService } from './game-participants.service';
import { SetStatusDto } from './dto/set-status.dto';
import { GameParticipant } from './game-participants.entity';

@Controller('game-participants')
export class GameParticipantsController {
    constructor(private readonly gameParticipantsService: GameParticipantsService) {}

    @Patch('/set-status')
    async setStatus(@Body() setStatusDto: SetStatusDto): Promise<GameParticipant>{
        return await this.gameParticipantsService.setStatus(setStatusDto);
    }
}
