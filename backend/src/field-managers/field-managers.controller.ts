import { Controller, Get } from '@nestjs/common';
import { FieldManagersService } from './field-managers.service';

@Controller('field-managers')
export class FieldManagersController {
    constructor(private fieldManagersService: FieldManagersService){}

    @Get()
    getAllFieldManagers() {
        return this.fieldManagersService.getAllFieldManagers();
    }
}
