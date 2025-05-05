import { Module } from '@nestjs/common';
import { FieldFetchApiController } from './field-fetch-api.controller';
import { FieldFetchApiService } from './field-fetch-api.service';
import { convertXYService } from './convertXY.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [FieldFetchApiController],
  providers: [FieldFetchApiService, convertXYService]
})
export class FieldFetchApiModule {}
