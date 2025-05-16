import { IsUUID } from 'class-validator';

export class SetManagerDto {
  @IsUUID()
  userId: string;
}
