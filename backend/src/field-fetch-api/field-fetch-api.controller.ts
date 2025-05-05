import { Controller, Get } from '@nestjs/common';
import { FieldFetchApiService } from './field-fetch-api.service';

@Controller('field-fetch-api')
export class FieldFetchApiController {
        constructor(private readonly fieldFetchApiService: FieldFetchApiService) {}
    
        @Get('')
        async getFields() {
            return await this.fieldFetchApiService.getFields();
          }
          @Get('/cities')
          async getCities(){
            return await this.fieldFetchApiService.getCities();
          }
}
