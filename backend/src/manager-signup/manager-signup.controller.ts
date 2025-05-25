import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ManagerSignupService } from './manager-signup.service';
import { ManagerSignup } from './manager-signup.entity';
import { ManagerContactDto } from './dto/manager-contact.dto';

@Controller('manager-signup')
export class ManagerSignupController {
    constructor(
    private readonly managerSignupService: ManagerSignupService
    ){}

    @Get()
    async getAll(): Promise<ManagerSignup[]>{
        return this.managerSignupService.getAll();
    }
    
    @Get('/:id')
    async getById(@Param('id') id: string): Promise<ManagerSignup>{
        return this.managerSignupService.findById(id);
    }

    @Post('/create')
    async create(@Body() managerContactDto: ManagerContactDto): Promise<ManagerSignup>{
        return this.managerSignupService.create(managerContactDto);
    }

    @Delete('/delete/:id')
    async deleteContact(@Param('id') id: string): Promise<void>{
        return this.managerSignupService.delete(id);
    }
}
