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
  Res,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Express, Response } from 'express';
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

  @Post('/profile-picture/upload')
  @UseInterceptors(FileInterceptor('profilePic'))
  async uploadFile(
    @GetUser() user: User,
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
    // file.originalname.split('.')[0]
    const fetchedUser = await this.userService.findById(user.uid);
    const fileName = `${Date.now()}-${user.uid}`;
    const fileWithExt = `${fileName}.${file.mimetype.split('/')[1]}`;
    const uploadedFile = await this.azureStorageService.uploadFile(
      'pictures',
      fileWithExt,
      file.buffer,
    );
    if (fetchedUser.profilePic != undefined) {
      await this.deleteFile(user);
    }

    await this.userService.updateProfilePicture(user.uid, fileWithExt);
  }

  @Delete('/profile-picture/delete')
  async deleteFile(@GetUser() user: User) {
    const fetchedUser = await this.userService.findById(user.uid);
    let blobName;
    if (fetchedUser.profilePic != undefined) {
      blobName = fetchedUser.profilePic;
    } else
      throw new NotFoundException(
        `no existing profile picture for user: ${user.uid}`,
      );
    const container = 'pictures';
    await this.azureStorageService.deleteFile(container, blobName);
    await this.userService.updateProfilePicture(user.uid, undefined);
    return { message: `Deleted ${blobName}` };
  }

  @Get('/profile-picture/download')
  async getFile(@GetUser() user: User, @Res() res: Response) {
    const fetchedUser = await this.userService.findById(user.uid);
    let blobName;
    if (fetchedUser.profilePic != undefined) {
      blobName = fetchedUser.profilePic;
    } else
      throw new NotFoundException(
        `no existing profile picture for user: ${user.uid}`,
      );
    const container = 'pictures';
    const fileBuffer = await this.azureStorageService.downloadFile(
      container,
      blobName,
    );
    const extension = path.extname(blobName);
    res.set({
      'Content-Type': `image/${extension.slice(1)}`,
      'Content-Disposition': `attachment; filename="${blobName}"`,
    });

    res.send(fileBuffer);
  }
}
