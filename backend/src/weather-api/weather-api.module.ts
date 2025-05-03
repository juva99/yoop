import { Module } from '@nestjs/common';
import { WeatherApiService } from './weather-api.service';
import { HttpModule } from '@nestjs/axios';
import { WeatherApiController } from './weather-api.controller';

@Module({
  imports: [HttpModule],
  providers: [WeatherApiService],
  controllers: [WeatherApiController],
  exports: [WeatherApiService],
})
export class WeatherApiModule {}
