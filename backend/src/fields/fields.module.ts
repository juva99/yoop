import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './fields.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Field])],
  providers: [FieldsService],
  controllers: [FieldsController],
  exports: [FieldsService],
})
export class FieldsModule {}
