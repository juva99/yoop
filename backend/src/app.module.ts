import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FieldsModule } from './fields/fields.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { GameParticipantsModule } from './game-participants/game-participants.module'; // Import the new module

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 54322,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    FieldsModule,
    GamesModule,
    AuthModule,
    GameParticipantsModule, // Add the new module here
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
})
export class AppModule {}
