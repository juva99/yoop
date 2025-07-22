import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Game } from '../games/games.entity';
import { GameType } from '../enums/game-type.enum';
import { City } from '../enums/city.enum';

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

  @Column({ type: 'float' })
  fieldLat?: number;

  @Column({ type: 'float' })
  fieldLng?: number;

  @Column({ nullable: true })
  fieldAddress?: string;

  @Column('enum', { enum: City })
  city: City;

  //field manager
  @ManyToOne(() => User, (manager) => manager.fieldsManage, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  manager: User | null;

  //games played in this field
  @OneToMany(() => Game, (game) => game.field)
  gamesInField: Game[];
}
