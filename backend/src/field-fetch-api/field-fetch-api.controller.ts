import { Controller, Get, Param, Post } from '@nestjs/common';
import { FieldFetchApiService } from './field-fetch-api.service';

@Controller('field-fetch-api')
export class FieldFetchApiController {
        constructor(private readonly fieldFetchApiService: FieldFetchApiService) {}
    
        @Get('')
        async getFields() {
            return await this.fieldFetchApiService.getFields();
          }
}
