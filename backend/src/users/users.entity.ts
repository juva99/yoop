import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  pass: string;

  @Column({ unique: true })
  userEmail: string;

  @Column({ type: 'date', nullable: true })
  birthDay: string;

  @Column({ nullable: true })
  isMale: boolean;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  profilePic?: string;

  @Column({ nullable: true })
  phoneNum?: string;

  @Column({ nullable: true })
  role?: string;

  @Column({ nullable: true })
  hashedRefreshToken?: string;
}
