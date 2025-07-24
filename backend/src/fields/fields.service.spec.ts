import { Test } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { FieldsService } from './fields.service';
import { GameType } from 'src/enums/game-type.enum';
import { CreateFieldDto } from './dto/create-field.dto';
import { City } from 'src/enums/city.enum';
import { Role } from 'src/enums/role.enum';
import { Field } from './fields.entity';
import { User } from 'src/users/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
describe('FieldsService', () => {
  let fieldsService: FieldsService;
  let fieldRepository: Repository<Field>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FieldsService,
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Field),

          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    fieldRepository = moduleRef.get(getRepositoryToken(Field));

    fieldsService = moduleRef.get(FieldsService);
    jest.clearAllMocks();
  });

  const fakeFieldDto: CreateFieldDto = {
    gameTypes: [GameType.FootBall, GameType.BasketBall],
    fieldName: 'מגרש הכוכבים',
    isManaged: true,
    fieldLat: 32.0853,
    fieldLng: 34.7818,
    city: City.TEL_AVIV_YAFO,
  };
  const fakeFieldDto2: CreateFieldDto = {
    gameTypes: [GameType.FootBall, GameType.BasketBall],
    fieldName: '2 מגרש הכוכבים',
    isManaged: true,
    fieldLat: 32.0853,
    fieldLng: 34.7818,
    city: City.TEL_AVIV_YAFO,
  };

  const fakeUser: User = {
    uid: 'test-uid',
    firstName: 'Leo',
    lastName: 'Messi',
    pass: 'hashedPassword',
    userEmail: 'bestplayer@fifa.com',
    birthDay: '2000-01-01',
    isMale: true,
    address: 'Miami',
    profilePic: null,
    phoneNum: '0522221111',
    role: Role.USER,
    fieldsManage: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    gameParticipations: [],
    createdGames: [],
    passwordResetToken: null,
    hashedRefreshToken: null,
    groupMemberIn: [],
  };

  const fakeField: Field = {
    fieldId: 'f123',
    gameTypes: [GameType.FootBall, GameType.BasketBall],
    fieldName: 'מגרש הכוכבים',
    isManaged: true,
    fieldLat: 32.0853,
    fieldLng: 34.7818,
    city: City.TEL_AVIV_YAFO,
    manager: fakeUser,
    gamesInField: [],
  };
  const fakeField2: Field = {
    fieldId: 'f1233',
    gameTypes: [GameType.FootBall, GameType.BasketBall],
    fieldName: '2 מגרש הכוכבים',
    isManaged: true,
    fieldLat: 32.0853,
    fieldLng: 34.7818,
    city: City.TEL_AVIV_YAFO,
    manager: fakeUser,
    gamesInField: [],
  };

  describe('create', () => {
    it('should create a field with a manager', async () => {
      (fieldRepository.create as jest.Mock).mockResolvedValue(fakeFieldDto);
      (fieldRepository.save as jest.Mock).mockResolvedValue(fakeField);
      const result = await fieldsService.create(fakeFieldDto, fakeUser);
      expect(result).toEqual(fakeField);
      expect(result.manager).toEqual(fakeUser);
      expect(result.isManaged).toBe(true);
    });
  });

  describe('createMany', () => {
    it('should create multiple fields', async () => {
      (fieldRepository.create as jest.Mock).mockResolvedValue([
        fakeFieldDto,
        fakeFieldDto2,
      ]);
      (fieldRepository.save as jest.Mock).mockResolvedValue([
        fakeField,
        fakeField2,
      ]);
      const result = await fieldsService.createMany([
        fakeFieldDto,
        fakeFieldDto2,
      ]);
      expect(result).toEqual([fakeField, fakeField2]);
    });
  });
});
