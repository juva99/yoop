import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('manager-signup')
export class ManagerSignup{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: String;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    phoneNum: string;

    @Column()
    message: string;
}