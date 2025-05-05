import { Controller, Get } from '@nestjs/common';
import { FieldFetchApiService } from './field-fetch-api.service';

@Controller('field-fetch-api')
export class FieldFetchApiController {
        constructor(private readonly fieldFetchApiService: FieldFetchApiService) {}
    
        @Get()
        async getWeather() {
            return await this.fieldFetchApiService.getFields();
          }
}
