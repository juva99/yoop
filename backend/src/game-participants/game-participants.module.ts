import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameParticipant } from './game-participants.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameParticipant])],
  exports: [TypeOrmModule] // Export if needed by other modules directly
})
export class GameParticipantsModule {}
