import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Game } from 'src/games/games.entity';
import { GameType } from 'src/enums/game-type.enum';

@Entity('fields')
export class Field {
  @PrimaryGeneratedColumn('uuid')
  fieldId: string;

  @Column()
  fieldName: string;

  @Column('enum', { enum: GameType, array: true })
  gameTypes: GameType[];

  @Column({ default: false })
  isManaged: boolean;

  @Column({ nullable: true })
  fieldPhoto?: string;

  @Column({ nullable: true })
  fieldLat?: number;

  @Column({ nullable: true })
  fieldLng?: number;

  @Column({ nullable: true })
  fieldAddress?: string;

  @Column()
  city: string;

  //field manager
  @ManyToOne(() => User, (manager) => manager.fieldsManage)
  manager: User;

  //games played in this field
  @OneToMany(() => Game, (game) => game.field)
  gamesInField: Game[];
}
