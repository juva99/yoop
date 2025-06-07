import { Module } from '@nestjs/common';
import { ManagerSignupController } from './manager-signup.controller';
import { ManagerSignupService } from './manager-signup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerSignup } from './manager-signup.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerSignup]), UsersModule],
  controllers: [ManagerSignupController],
  providers: [ManagerSignupService],
  exports: [ManagerSignupService],
})
export class ManagerSignupModule {}
