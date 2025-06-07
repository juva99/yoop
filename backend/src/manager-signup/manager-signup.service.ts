import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerSignup } from './manager-signup.entity';
import { Repository } from 'typeorm';
import { ManagerContactDto } from './dto/manager-contact.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ManagerSignupService {
  constructor(
    @InjectRepository(ManagerSignup)
    private managerSignupRepository: Repository<ManagerSignup>,
    private readonly usersService: UsersService,
  ) {}

  async create(managerContactDto: ManagerContactDto): Promise<ManagerSignup> {
    managerContactDto.email = managerContactDto.email.toLowerCase();

    const user = await this.usersService.findByEmail(managerContactDto.email);
    if (user) {
      throw new ConflictException(
        'המייל כבר קיים במערכת. נסה להתחבר או השתמש במייל אחר.',
      );
    }

    const managerSignup =
      this.managerSignupRepository.create(managerContactDto);
    return await this.managerSignupRepository.save(managerSignup);
  }

  async findById(id: string): Promise<ManagerSignup> {
    const managerSignup = await this.managerSignupRepository.findOne({
      where: { id },
    });
    if (!managerSignup) {
      throw new NotFoundException(`no contact with id ${id} found`);
    }
    return managerSignup;
  }

  async delete(id: string): Promise<void> {
    const results = await this.managerSignupRepository.delete(id);
    if (results.affected === 0) {
      throw new NotFoundException(`no contact with id ${id} not found`);
    }
  }

  async getAll(): Promise<ManagerSignup[]> {
    const result = await this.managerSignupRepository.find();
    return result;
  }
}
