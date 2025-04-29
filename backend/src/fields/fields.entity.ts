import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Game } from 'src/games/games.entity';

@Entity('fields')
export class Field {
  @PrimaryGeneratedColumn('uuid')
  fieldId: string;

  @Column({ nullable: true })
  gametype: number;

  @Column({ default: false })
  isManaged: boolean;

  @Column({nullable: true })
  fieldPhoto?: string;

  @Column({nullable: true })
  fieldlat?: string;

  @Column({nullable: true })
  fieldlng?: string;

  @Column({nullable: true })
  fieldAddress?: string;

  @Column()
  city: string;
  
  // @Column()
  // mid: string;

  //field manager
  @ManyToOne(() => User, manager => manager.fieldsManage)
  manager: User;
  
  //games played in this field
  @OneToMany(() => Game, game => game.field)
  gamesInField: Game[];
}