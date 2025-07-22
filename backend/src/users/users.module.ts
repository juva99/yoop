import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AzureStorageModule } from 'src/azure-storage/azure-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AzureStorageModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
