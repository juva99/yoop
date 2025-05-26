import { Module } from '@nestjs/common';
import { ManagerSignupController } from './manager-signup.controller';
import { ManagerSignupService } from './manager-signup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerSignup } from './manager-signup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerSignup])],
  controllers: [ManagerSignupController],
  providers: [ManagerSignupService],
  exports: [ManagerSignupService]
})
export class ManagerSignupModule {}
