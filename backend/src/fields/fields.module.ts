import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './fields.entity';
import { WeatherApiModule } from 'src/weather-api/weather-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), WeatherApiModule],
  providers: [FieldsService],
  controllers: [FieldsController],
})
export class FieldsModule {}
