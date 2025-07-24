# AI Coding Agent Instructions

## Project Overview

This is a sports field booking platform with separate **NestJS backend** (`/backend`) and **Next.js frontend** (`/frontend/app`). Users can join games, manage fields, and connect with friends across different sports (football, basketball, tennis).

## Architecture Patterns

### Backend (NestJS)

- **Module Structure**: Each domain has its own module (users, games, fields, auth, friends, groups)
- **Entity Relationships**: Games → Users (organizer), Fields (location), GameParticipants (many-to-many)
- **Auth Pattern**: JWT-based with refresh tokens, role-based access (`Role` enum: ADMIN, FIELD_MANAGER, USER)
- **External Integrations**:
  - Azure Blob Storage for file uploads (`azure-storage.service.ts`)
  - Field data fetching via scheduled cron jobs (`field-fetch-api.service.ts`)
  - Weather API integration for game conditions (`weather-api.service.ts`)
  - Email notifications via Mailjet (`mail.service.ts`)

### Frontend (Next.js App Router)

- **Server Actions**: All API calls in `lib/actions.ts` using `authFetch` wrapper
- **Session Management**: JWT stored in HTTP-only cookies via `lib/session.ts`
- **Middleware**: Role-based routing protection in `middleware.ts` with automatic token refresh
- **Component Structure**: UI components in `/components/ui`, domain components in `/components/{domain}`

## Key Development Patterns

### Database & Entities

- **TypeORM with PostgreSQL**: All entities use `@Entity()` decorator with table names
- **Primary Keys**: UUIDs as primary keys (`@PrimaryGeneratedColumn('uuid')`)
- **Relationships**: Extensive use of `@ManyToOne`, `@OneToMany` with cascade deletes (`onDelete: 'CASCADE'`)
- **Enums**: Stored as PostgreSQL enums (`@Column('enum', { enum: EnumName })`)
- **Status Enums**: `PENDING/APPROVED/REJECTED` pattern for participation and games
- **Entity Files**: Follow pattern `{domain}.entity.ts` with full relationship definitions

### Database Configuration

- **Environment-based**: Uses `ConfigService` for database connection
- **SSL Toggle**: Configurable SSL via `SSL` environment variable
- **Auto-sync**: `synchronize: true` in development, `false` in production
- **Auto-load**: `autoLoadEntities: true` automatically discovers entities

### API Design & Validation

- **RESTful Endpoints**: Consistent controller structure with NestJS decorators
- **DTOs**: Located in `/dto` folders with `class-validator` decorators
- **Validation Patterns**:
  - Hebrew name validation: `/^[א-ת]+$/` for Hebrew characters only
  - Phone validation: `/^(\+972|0)5\d(-?\d{7})$/` for Israeli phone numbers
  - Password validation: Complex regex requiring uppercase, lowercase, numbers, and special chars
- **Error Handling**: NestJS exceptions with Hebrew error messages (`'אין קבוצה כזאת'`)

### Frontend Validation & Schemas

- **Zod Schemas**: All forms use Zod with Hebrew error messages in `/lib/schemas/`
- **Form Validation**: Consistent patterns with `react-hook-form` and `@hookform/resolvers`
- **Password Confirmation**: `.refine()` method for password matching validation
- **Hebrew Regex**: Consistent use of Hebrew character validation across forms

### Scheduling & Background Jobs

- **Cron Jobs**: Monthly field sync using `@Cron('0 30 2 1 * *')` in `field-fetch-api.service.ts`
- **Weather Integration**: Real-time weather data fetching before games via WeatherAPI.com
- **Coordinate Conversion**: Using `proj4` library for field location conversions

## Detailed Entity Relationships & Database Schema

### Core Entity Structure

#### User Entity (`users.entity.ts`)

```typescript
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Game, (game) => game.organizer)
  organizedGames: Game[];

  @OneToMany(() => GameParticipant, (participant) => participant.user)
  gameParticipations: GameParticipant[];

  @OneToMany(() => Friend, (friend) => friend.requester)
  sentFriendRequests: Friend[];

  @OneToMany(() => Friend, (friend) => friend.recipient)
  receivedFriendRequests: Friend[];

  @OneToMany(() => GroupMember, (member) => member.user)
  groupMemberships: GroupMember[];
}
```

#### Game Entity (`games.entity.ts`)

```typescript
@Entity("games")
export class Game {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column({ type: "enum", enum: GameType })
  gameType: GameType;

  @Column({ type: "enum", enum: GameStatus, default: GameStatus.PENDING })
  status: GameStatus;

  @Column("timestamp")
  scheduledDate: Date;

  @Column("integer")
  maxParticipants: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  pricePerPerson?: number;

  @Column({ nullable: true })
  weatherConditions?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.organizedGames, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organizerId" })
  organizer: User;

  @Column("uuid")
  organizerId: string;

  @ManyToOne(() => Field, (field) => field.games, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fieldId" })
  field: Field;

  @Column("uuid")
  fieldId: string;

  @OneToMany(() => GameParticipant, (participant) => participant.game, {
    cascade: true,
  })
  participants: GameParticipant[];
}
```

#### GameParticipant Entity (`game-participants.entity.ts`)

```typescript
@Entity("game_participants")
export class GameParticipant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: ParticipationStatus,
    default: ParticipationStatus.PENDING,
  })
  status: ParticipationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Many-to-many relationship bridge
  @ManyToOne(() => User, (user) => user.gameParticipations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column("uuid")
  userId: string;

  @ManyToOne(() => Game, (game) => game.participants, { onDelete: "CASCADE" })
  @JoinColumn({ name: "gameId" })
  game: Game;

  @Column("uuid")
  gameId: string;
}
```

#### Field Entity (`fields.entity.ts`)

```typescript
@Entity("fields")
export class Field {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column({ type: "enum", enum: City })
  city: City;

  @Column()
  address: string;

  @Column("decimal", { precision: 10, scale: 7 })
  latitude: number;

  @Column("decimal", { precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: "enum", enum: GameType })
  fieldType: GameType;

  @Column("boolean", { default: true })
  isActive: boolean;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  pricePerHour?: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Game, (game) => game.field)
  games: Game[];
}
```

#### Friend Entity (`friends.entity.ts`)

```typescript
@Entity("friends")
export class Friend {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: FriendReqStatus,
    default: FriendReqStatus.PENDING,
  })
  status: FriendReqStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Self-referencing relationships
  @ManyToOne(() => User, (user) => user.sentFriendRequests, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "requesterId" })
  requester: User;

  @Column("uuid")
  requesterId: string;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "recipientId" })
  recipient: User;

  @Column("uuid")
  recipientId: string;
}
```

### Comprehensive Enum Definitions

```typescript
// role.enum.ts
export enum Role {
  ADMIN = "admin",
  FIELD_MANAGER = "field_manager",
  USER = "user",
}

// game-status.enum.ts
export enum GameStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DELETED = "deleted",
}

// game-type.enum.ts
export enum GameType {
  FOOTBALL = "football",
  BASKETBALL = "basketball",
  TENNIS = "tennis",
}

// participation-status.enum.ts
export enum ParticipationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// friend-req-status.enum.ts
export enum FriendReqStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// city.enum.ts
export enum City {
  JERUSALEM = "jerusalem",
  TEL_AVIV = "tel_aviv",
  HAIFA = "haifa",
  BEER_SHEVA = "beer_sheva",
  // ... additional cities
}
```

## Comprehensive DTO & Validation Patterns

### Create User DTO (`users/dto/create-user.dto.ts`)

```typescript
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
  Matches,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain uppercase, lowercase, number and special character",
  })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^[א-ת\s]+$/, { message: "שם פרטי חייב להכיל אותיות עבריות בלבד" })
  firstName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[א-ת\s]+$/, { message: "שם משפחה חייב להכיל אותיות עבריות בלבד" })
  lastName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(\+972|0)5\d(-?\d{7})$/, { message: "מספר טלפון לא תקין" })
  phoneNumber?: string;
}
```

### Game Creation DTO (`games/dto/create-game.dto.ts`)

```typescript
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from "class-validator";
import { GameType } from "../../enums/game-type.enum";

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(GameType)
  gameType: GameType;

  @IsDateString()
  scheduledDate: string;

  @IsNumber()
  @Min(2)
  @Max(50)
  maxParticipants: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerPerson?: number;

  @IsUUID()
  fieldId: string;
}
```

## Frontend Zod Validation Schemas

### User Registration Schema (`frontend/app/lib/schemas/auth.ts`)

```typescript
import { z } from "zod";

const hebrewNameRegex = /^[א-ת\s]+$/;
const phoneRegex = /^(\+972|0)5\d(-?\d{7})$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "שם משתמש חייב להכיל לפחות 3 תווים")
      .max(20, "שם משתמש לא יכול להכיל יותר מ-20 תווים"),

    email: z.string().email("כתובת מייל לא תקינה"),

    password: z
      .string()
      .min(8, "סיסמה חייבת להכיל לפחות 8 תווים")
      .regex(
        passwordRegex,
        "סיסמה חייבת להכיל אות גדולה, קטנה, מספר ותו מיוחד"
      ),

    confirmPassword: z.string(),

    firstName: z
      .string()
      .regex(hebrewNameRegex, "שם פרטי חייב להכיל אותיות עבריות בלבד")
      .optional(),

    lastName: z
      .string()
      .regex(hebrewNameRegex, "שם משפחה חייב להכיל אותיות עבריות בלבד")
      .optional(),

    phoneNumber: z.string().regex(phoneRegex, "מספר טלפון לא תקין").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "סיסמאות לא תואמות",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
```

### Game Creation Schema (`frontend/app/lib/schemas/game.ts`)

```typescript
import { z } from "zod";
import { GameType } from "../enums/game-type.enum";

export const createGameSchema = z.object({
  title: z
    .string()
    .min(3, "כותרת חייבת להכיל לפחות 3 תווים")
    .max(100, "כותרת לא יכולה להכיל יותר מ-100 תווים"),

  description: z
    .string()
    .max(500, "תיאור לא יכול להכיל יותר מ-500 תווים")
    .optional(),

  gameType: z.nativeEnum(GameType, {
    errorMap: () => ({ message: "יש לבחור סוג משחק תקין" }),
  }),

  scheduledDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "תאריך המשחק חייב להיות בעתיד",
  }),

  maxParticipants: z
    .number()
    .min(2, "מספר משתתפים מינימלי הוא 2")
    .max(50, "מספר משתתפים מקסימלי הוא 50"),

  pricePerPerson: z.number().min(0, "מחיר לא יכול להיות שלילי").optional(),

  fieldId: z.string().uuid("יש לבחור מגרש תקין"),
});

export type CreateGameFormData = z.infer<typeof createGameSchema>;
```

## Advanced Service Patterns & Business Logic

### Authentication Service (`auth/auth.service.ts`)

```typescript
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService
  ) {}

  async register(
    createUserDto: CreateUserDto
  ): Promise<{ user: User; tokens: TokenPair }> {
    // Check for existing user
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException("משתמש עם פרטים אלה כבר קיים");
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds
    );

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokenPair(user);

    // Send verification email
    await this.mailService.sendVerificationEmail(user.email, user.id);

    return { user, tokens };
  }

  async generateTokenPair(user: User): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_SECRET"),
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        expiresIn: "7d",
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
```

### Games Service with Complex Business Logic (`games/games.service.ts`)

```typescript
@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    @InjectRepository(Field) private fieldRepository: Repository<Field>,
    @InjectRepository(GameParticipant)
    private participantRepository: Repository<GameParticipant>,
    private weatherService: WeatherApiService
  ) {}

  async createGame(
    createGameDto: CreateGameDto,
    organizerId: string
  ): Promise<Game> {
    // Validate field exists and is active
    const field = await this.fieldRepository.findOne({
      where: { id: createGameDto.fieldId, isActive: true },
    });

    if (!field) {
      throw new NotFoundException("מגרש לא נמצא או לא פעיל");
    }

    // Check for scheduling conflicts
    const conflictingGame = await this.gameRepository.findOne({
      where: {
        fieldId: createGameDto.fieldId,
        scheduledDate: Between(
          new Date(
            new Date(createGameDto.scheduledDate).getTime() - 2 * 60 * 60 * 1000
          ), // 2 hours before
          new Date(
            new Date(createGameDto.scheduledDate).getTime() + 2 * 60 * 60 * 1000
          ) // 2 hours after
        ),
        status: Not(GameStatus.DELETED),
      },
    });

    if (conflictingGame) {
      throw new ConflictException("מגרש תפוס בזמן הנדרש");
    }

    // Fetch weather conditions
    const weather = await this.weatherService.getWeatherForGame(
      field.latitude,
      field.longitude,
      new Date(createGameDto.scheduledDate)
    );

    const game = this.gameRepository.create({
      ...createGameDto,
      organizerId,
      weatherConditions: weather,
    });

    return await this.gameRepository.save(game);
  }

  async joinGame(gameId: string, userId: string): Promise<GameParticipant> {
    // Check if game exists and is available
    const game = await this.gameRepository.findOne({
      where: { id: gameId, status: GameStatus.APPROVED },
      relations: ["participants"],
    });

    if (!game) {
      throw new NotFoundException("משחק לא נמצא או לא זמין");
    }

    // Check if user is already participating
    const existingParticipation = await this.participantRepository.findOne({
      where: { gameId, userId },
    });

    if (existingParticipation) {
      throw new ConflictException("כבר נרשמת למשחק זה");
    }

    // Check if game is full
    const currentParticipants = game.participants.filter(
      (p) => p.status === ParticipationStatus.APPROVED
    ).length;

    if (currentParticipants >= game.maxParticipants) {
      throw new ConflictException("המשחק מלא");
    }

    // Create participation request
    const participation = this.participantRepository.create({
      gameId,
      userId,
      status: ParticipationStatus.PENDING,
    });

    return await this.participantRepository.save(participation);
  }
}
```

## External Service Integration Patterns

### Azure Storage Service (`azure-storage/azure-storage.service.ts`)

```typescript
@Injectable()
export class AzureStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName = "user-uploads";

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
  }

  async uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );

    // Generate unique filename
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${userId}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    return blockBlobClient.url;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const url = new URL(fileUrl);
    const fileName = url.pathname.substring(`/${this.containerName}/`.length);

    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.deleteIfExists();
  }
}
```

### Weather API Service (`weather-api/weather-api.service.ts`)

```typescript
@Injectable()
export class WeatherApiService {
  private readonly apiKey: string;
  private readonly baseUrl = "http://api.weatherapi.com/v1";

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>("WEATHER_KEY");
  }

  async getWeatherForGame(
    lat: number,
    lon: number,
    gameDate: Date
  ): Promise<string> {
    const dateStr = gameDate.toISOString().split("T")[0];

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast.json?key=${this.apiKey}&q=${lat},${lon}&dt=${dateStr}`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      const forecast = data.forecast.forecastday[0];

      return `${forecast.day.condition.text}, ${forecast.day.maxtemp_c}°C, רוח: ${forecast.day.maxwind_kph} קמ"ש`;
    } catch (error) {
      console.error("Weather API error:", error);
      return "מידע מזג אוויר לא זמין";
    }
  }
}
```

### Email Service (`mail/mail.service.ts`)

```typescript
@Injectable()
export class MailService {
  private mailjet: Client;

  constructor(private configService: ConfigService) {
    this.mailjet = new Client({
      apiKey: this.configService.get<string>("MAILJET_API_KEY"),
      apiSecret: this.configService.get<string>("MAILJET_API_SECRET"),
    });
  }

  async sendVerificationEmail(email: string, userId: string): Promise<void> {
    const verificationUrl = `${this.configService.get<string>(
      "FRONTEND_URL"
    )}/verify-email?token=${userId}`;

    const request = this.mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: this.configService.get<string>("FROM_EMAIL"),
            Name: "SportConnect",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: "אימות כתובת מייל - SportConnect",
          HTMLPart: `
            <div dir="rtl" style="font-family: Arial, sans-serif;">
              <h2>ברוכים הבאים ל-SportConnect!</h2>
              <p>לחץ על הקישור הבא לאימות כתובת המייל שלך:</p>
              <a href="${verificationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                אמת כתובת מייל
              </a>
            </div>
          `,
        },
      ],
    });

    await request;
  }

  async sendGameNotification(
    email: string,
    gameTitle: string,
    gameDate: Date
  ): Promise<void> {
    const request = this.mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: this.configService.get<string>("FROM_EMAIL"),
            Name: "SportConnect",
          },
          To: [{ Email: email }],
          Subject: `עדכון משחק: ${gameTitle}`,
          HTMLPart: `
            <div dir="rtl" style="font-family: Arial, sans-serif;">
              <h2>עדכון בנוגע למשחק שלך</h2>
              <p><strong>משחק:</strong> ${gameTitle}</p>
              <p><strong>תאריך:</strong> ${gameDate.toLocaleDateString(
                "he-IL"
              )}</p>
              <p>בדוק את האפליקציה לפרטים נוספים.</p>
            </div>
          `,
        },
      ],
    });

    await request;
  }
}
```

## Frontend Architecture & Patterns

### Session Management (`frontend/app/lib/session.ts`)

```typescript
import { cookies } from "next/headers";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
}

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(
  userId: string,
  email: string,
  role: string
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey);

  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookie = cookies().get("session")?.value;

  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as SessionPayload;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function deleteSession() {
  cookies().delete("session");
}
```

### Authenticated Fetch Wrapper (`frontend/app/lib/actions.ts`)

```typescript
interface AuthFetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function authFetch(
  url: string,
  options: AuthFetchOptions = {}
): Promise<Response> {
  const { requireAuth = true, ...fetchOptions } = options;

  // Get tokens from cookies
  const accessToken = cookies().get("access_token")?.value;
  const refreshToken = cookies().get("refresh_token")?.value;

  // Add authorization header if token exists
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    ...fetchOptions,
    headers,
  });

  // Handle token refresh on 401
  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (refreshResponse.ok) {
      const { accessToken: newAccessToken } = await refreshResponse.json();

      // Update token in cookies
      cookies().set("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60, // 15 minutes
      });

      // Retry original request with new token
      headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
        ...fetchOptions,
        headers,
      });
    } else {
      // Refresh failed, redirect to login
      redirect("/login");
    }
  }

  if (requireAuth && !response.ok && response.status === 401) {
    redirect("/login");
  }

  return response;
}

// Server Actions
export async function getUserProfile(): Promise<User | null> {
  try {
    const response = await authFetch("/users/profile");
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
  return null;
}

export async function createGame(
  formData: CreateGameFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await authFetch("/games", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      revalidatePath("/games");
      return { success: true };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    return { success: false, error: "שגיאה ביצירת משחק" };
  }
}
```

### Middleware with Role-based Protection (`frontend/app/middleware.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "/games/create", "/profile"];
const adminRoutes = ["/admin"];
const managerRoutes = ["/manager"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));
  const isManager = managerRoutes.some((route) => pathname.startsWith(route));

  if (isProtected || isAdmin || isManager) {
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );

      // Role-based access control
      if (isAdmin && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (
        isManager &&
        !["admin", "field_manager"].includes(payload.role as string)
      ) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      // Token invalid, try to refresh
      const refreshToken = request.cookies.get("refresh_token")?.value;

      if (refreshToken) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            }
          );

          if (response.ok) {
            const { accessToken } = await response.json();

            const nextResponse = NextResponse.next();
            nextResponse.cookies.set("access_token", accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 15 * 60,
            });

            return nextResponse;
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }

      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Testing Patterns & Best Practices

### Comprehensive Unit Testing (`users/users.service.spec.ts`)

```typescript
describe("UsersService", () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUser: User = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    username: "testuser",
    email: "test@example.com",
    password: "hashedPassword",
    role: Role.USER,
    firstName: "ישראל",
    lastName: "ישראלי",
    phoneNumber: "+972501234567",
    profileImageUrl: null,
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    organizedGames: [],
    gameParticipations: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    groupMemberships: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe("findOne", () => {
    it("should return a user when found", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);

      const result = await service.findOne(
        "123e4567-e89b-12d3-a456-426614174000"
      );

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: "123e4567-e89b-12d3-a456-426614174000" },
      });
    });

    it("should throw NotFoundException when user not found", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      await expect(service.findOne("nonexistent-id")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("create", () => {
    it("should create a user with hashed password", async () => {
      const createUserDto: CreateUserDto = {
        username: "newuser",
        email: "new@example.com",
        password: "StrongPass123!",
      };

      const hashedPassword = "hashedStrongPass123!";
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createdUser = {
        ...mockUser,
        ...createUserDto,
        password: hashedPassword,
      };
      jest.spyOn(userRepository, "create").mockReturnValue(createdUser as User);
      jest.spyOn(userRepository, "save").mockResolvedValue(createdUser as User);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 12);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe("generateManagerPassword", () => {
    it("should generate a random password", async () => {
      const mockRandomBytes = Buffer.from("randomdata");
      (crypto.randomBytes as jest.Mock).mockReturnValue(mockRandomBytes);

      const result = await service.generateManagerPassword();

      expect(crypto.randomBytes).toHaveBeenCalledWith(8);
      expect(result).toBe(mockRandomBytes.toString("hex"));
    });
  });
});
```

### E2E Testing Patterns (`test/app.e2e-spec.ts`)

```typescript
describe("AppController (e2e)", () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useClass(Repository)
      .compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User)
    );

    await app.init();
  });

  describe("/auth/register (POST)", () => {
    it("should register a new user", () => {
      return request(app.getHttpServer())
        .post("/auth/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "StrongPass123!",
          firstName: "ישראל",
          lastName: "ישראלי",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.tokens).toBeDefined();
          expect(res.body.user.email).toBe("test@example.com");
        });
    });

    it("should return 409 for duplicate email", () => {
      // First registration
      return request(app.getHttpServer())
        .post("/auth/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "StrongPass123!",
        })
        .then(() => {
          // Second registration with same email
          return request(app.getHttpServer())
            .post("/auth/register")
            .send({
              username: "testuser2",
              email: "test@example.com",
              password: "StrongPass123!",
            })
            .expect(409);
        });
    });
  });
});
```

### Mock Patterns for External Services

```typescript
// Mock Azure Storage
jest.mock("@azure/storage-blob", () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn(() => ({
      getContainerClient: jest.fn(() => ({
        getBlockBlobClient: jest.fn(() => ({
          uploadData: jest.fn(),
          deleteIfExists: jest.fn(),
          url: "https://mock-storage.blob.core.windows.net/container/file.jpg",
        })),
      })),
    })),
  },
}));

// Mock Weather API
jest.mock("node-fetch", () =>
  jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          forecast: {
            forecastday: [
              {
                day: {
                  condition: { text: "Sunny" },
                  maxtemp_c: 25,
                  maxwind_kph: 10,
                },
              },
            ],
          },
        }),
    })
  )
);

// Mock Mailjet
jest.mock("node-mailjet", () => ({
  Client: jest.fn(() => ({
    post: jest.fn(() => ({
      request: jest.fn(() =>
        Promise.resolve({ body: { Messages: [{ Status: "success" }] } })
      ),
    })),
  })),
}));
```

## Development Workflow

### Setup Commands

```bash
# Install git hooks (run after clone)
.\scripts\install-hooks.ps1  # PowerShell
./scripts/install-hooks.sh   # Bash

# Backend development
cd backend
npm run start:dev  # Watch mode with hot reload
npm run test       # Unit tests
npm run test:cov   # Unit tests with coverage
npm run test:e2e   # End-to-end tests

# Frontend development
cd frontend/app
npm run dev        # Development server on port 3000
```

### Testing Patterns

- **Unit Tests**: Located alongside source files as `*.spec.ts`
- **Mock External Dependencies**: `jest.mock()` for `bcrypt`, `crypto`, HTTP services
- **Repository Mocking**: Use `getRepositoryToken()` from `@nestjs/typeorm` for TypeORM mocks
- **Test Structure**: `beforeEach` setup, descriptive test names, comprehensive error case coverage
- **Coverage Goal**: 100% coverage for service layers (see `users.service.spec.ts` example)

### Code Quality

- **Pre-commit hooks**: Auto-format with Prettier on both frontend/backend via `scripts/pre-commit`
- **Linting**: ESLint configured with TypeScript rules, Prettier integration
- **Format commands**: `npm run format:check` and `npm run format:fix`
- **Hebrew Content**: Error messages and UI text in Hebrew, English for technical terms

### Docker Deployment

- Multi-stage builds in `backend/Dockerfile` and `frontend/app/Dockerfile`
- Production image optimization with `npm ci --only=production`

## Project-Specific Conventions

### Environment Variables

- Database config via `ConfigService` with SSL toggle
- Azure Storage connection string required (`AZURE_STORAGE_CONNECTION_STRING`)
- JWT secret keys for session management
- Weather API key (`WEATHER_KEY`)
- Frontend URLs via `NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_FRONTEND_URL`

### Error Handling

- NestJS exception filters with specific HTTP status codes
- Frontend error boundaries and loading states using Suspense
- Consistent error response format across API endpoints
- **Hebrew Error Messages**: User-facing errors in Hebrew (e.g., `'אין קבוצה כזאת'`)

### File Structure Patterns

- `/src/{domain}/{domain}.{controller|service|entity|module}.ts`
- DTOs in domain-specific `/dto` folders
- Shared enums in `/src/enums/` (mirrored in frontend `app/enums/`)
- Types mirrored between frontend (`app/types/`) and backend entities

### Authentication Flow

1. Login via `auth/login` endpoint returns JWT + refresh token
2. Tokens stored in HTTP-only cookies via `createSession()`
3. `authFetch()` automatically includes tokens and handles refresh
4. Middleware protects routes, redirects based on role, and auto-refreshes expired tokens

### Game Management

- Games have organizers (Users), locations (Fields), and participants (GameParticipants)
- Status tracking via enums (PENDING, APPROVED, DELETED for games; PENDING, APPROVED, REJECTED for participation)
- Weather integration fetches conditions before game start using coordinates
- Participation tracking with status management

### Type Safety

- Shared enums between frontend/backend ensure consistency
- TypeORM entities define database schema and TypeScript types
- Frontend types mirror backend entities for API responses

When working on this codebase, always check existing patterns in similar domains before creating new features. The project emphasizes consistency in module structure, authentication patterns, database relationships, and comprehensive testing with mocking.
