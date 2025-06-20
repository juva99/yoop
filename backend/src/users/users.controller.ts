import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Express } from 'express';
import { User } from './users.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { AzureStorageService } from 'src/azure-storage/azure-storage.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly azureStorageService: AzureStorageService,
  ) {}

  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Public()
  @Get('/byEmail/:email')
  async getByEmail(@Param('email') email: string): Promise<User | null> {
    return await this.userService.findByEmail(email);
  }

  @Get('search_friends/:name')
  async getByName(
    @Param('name') name: string,
    @GetUser() user: User,
  ): Promise<User[]> {
    return await this.userService.findByName(name, user);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    return await this.userService.deleteOne(id);
  }

  @Put('update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUser(
    @Param('id') id: string,
    @Body() updatedFields: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, updatedFields);
  }

  @Public()
  @Post(`reset-password/:token`)
  async resetPass(@Param('token') token: string, @Body() body) {
    return this.userService.changePassword(token, body.password);
  }

  @Public()
  @Post('/upload')
  @UseInterceptors(FileInterceptor('profilePic'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3 * 1024 * 1024 }), // 3MB
          new FileTypeValidator({ fileType: /jpeg|png|jpg/ }), //images
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    this.azureStorageService.uploadFile('pictures', 'filename', file.buffer);
  }

  // @Public()
  // @Post('upload-profile')
  // @UseInterceptors(FileInterceptor('profilePic', {
  //   storage: multer.memoryStorage(), // Store in memory so we can write it ourselves
  //   limits: { fileSize: 0.8 * 1024 * 1024 }, // Max 5MB
  // }))
  // async uploadProfile(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('File is required');
  //   }

  //   if (!file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
  //     throw new BadRequestException('Only image files are allowed');
  //   }

  //   // Ensure upload directory exists
  //   const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'profile-pics');
  //   if (!fs.existsSync(uploadPath)) {
  //     fs.mkdirSync(uploadPath, { recursive: true });
  //   }

  //   // Generate a unique file name
  //   const fileName = `${Date.now()}-${file.originalname}`;
  //   const filePath = path.join(uploadPath, fileName);

  //   // Save file manually
  //   fs.writeFileSync(filePath, file.buffer);

  //   // Return relative URL
  //   return {
  //     message: 'File uploaded successfully!',
  //     url: `/uploads/profile-pics/${fileName}`,
  //   };
  // }
}
