import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class FieldManager {
    @PrimaryGeneratedColumn('uuid') 
    mid: number;
  
    @Column({ length: 12, nullable: true })
    phoneNum?: string;
  
}