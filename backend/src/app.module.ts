import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { FieldsModule } from './fields/fields.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { GameParticipantsModule } from './game-participants/game-participants.module';
import { WeatherApiModule } from './weather-api/weather-api.module';
import { FriendsModule } from './friends/friends.module';
import { FieldFetchApiModule } from './field-fetch-api/field-fetch-api.module';
import { MailModule } from './mail/mail.module';
import { ManagerSignupModule } from './manager-signup/manager-signup.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, ScheduleModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const sslOptions = configService.get<boolean>('SSL', false);

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          ssl: sslOptions,
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
        };
      },
    }),
    UsersModule,
    FieldsModule,
    GamesModule,
    AuthModule,
    GameParticipantsModule,
    WeatherApiModule,
    FieldFetchApiModule,
    FriendsModule,
    MailModule,
    ManagerSignupModule,
  ],
  controllers: [],
})
export class AppModule {}
