import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('manager-signup')
export class ManagerSignup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNum: string;

  @Column()
  message: string;
}
