import { Controller, Get, Param, Post } from '@nestjs/common';
import { FieldFetchApiService } from './field-fetch-api.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('field-fetch-api')
export class FieldFetchApiController {
  constructor(private readonly fieldFetchApiService: FieldFetchApiService) {}

  @Roles(Role.ADMIN)
  @Get('')
  async getFields() {
    return await this.fieldFetchApiService.getFields();
  }
}
