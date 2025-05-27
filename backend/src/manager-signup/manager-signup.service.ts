import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerSignup } from './manager-signup.entity';
import { Repository } from 'typeorm';
import { ManagerContactDto } from './dto/manager-contact.dto';

@Injectable()
export class ManagerSignupService {
      constructor(
        @InjectRepository(ManagerSignup)
        private managerSignupRepository: Repository<ManagerSignup>,
      ) {}

      async create(managerContactDto: ManagerContactDto): Promise<ManagerSignup>{
        const managerSignup = this.managerSignupRepository.create(managerContactDto);
        return await this.managerSignupRepository.save(managerSignup);
      }

      async findById(id: string): Promise<ManagerSignup>{
        const managerSignup = await this.managerSignupRepository.findOne({where: {id}});
        if(!managerSignup){
            throw new NotFoundException(`no contact with id ${id} found`);
        }
        return managerSignup;
      }

      async delete(id: string): Promise<void>{
        const results = await this.managerSignupRepository.delete(id);
        if (results.affected === 0) {
        throw new NotFoundException(`no contact with id ${id} not found`);
        }
      }

      async getAll(): Promise<ManagerSignup[]>{
        const result = await this.managerSignupRepository.find();
        return result;
      }
}
