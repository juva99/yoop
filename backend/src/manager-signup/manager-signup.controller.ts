import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ManagerSignupService } from './manager-signup.service';
import { ManagerSignup } from './manager-signup.entity';
import { ManagerContactDto } from './dto/manager-contact.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('manager-signup')
export class ManagerSignupController {
    constructor(
    private readonly managerSignupService: ManagerSignupService
    ){}

    @Roles(Role.ADMIN)
    @Get()
    async getAll(): Promise<ManagerSignup[]>{
        return this.managerSignupService.getAll();
    }
    
    @Roles(Role.ADMIN)
    @Get('/:id')
    async getById(@Param('id') id: string): Promise<ManagerSignup>{
        return this.managerSignupService.findById(id);
    }

    @Public()
    @Post('/create')
    async create(@Body() managerContactDto: ManagerContactDto): Promise<ManagerSignup>{
        return this.managerSignupService.create(managerContactDto);
    }

    @Roles(Role.ADMIN)
    @Delete('/delete/:id')
    async deleteContact(@Param('id') id: string): Promise<void>{
        return this.managerSignupService.delete(id);
    }
}
