import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  pass: string;

  @Column()
  userEmail: String;

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

  @Column()
  role: string;
}