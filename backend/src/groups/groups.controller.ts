import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { GroupsService } from './groups.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/users.entity';
import { Group } from './groups.entity';
import { GroupMember } from 'src/group-members/group-members.entity';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { AzureStorageService } from 'src/azure-storage/azure-storage.service';
import { Response } from 'express';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly groupMembersService: GroupMembersService,
    private readonly azureStorageService: AzureStorageService,
  ) {}

  @Get('/mygroups')
  async getMyGroups(@GetUser() user: User): Promise<Group[]> {
    return await this.groupMembersService.findMyGroups(user);
  }

  @Roles(Role.ADMIN)
  @Get('/allgroups')
  async getAllGroups(): Promise<Group[]> {
    return await this.groupsService.findAllGroups();
  }

  @Post('/create')
  async createGroup(
    @GetUser() user: User,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return await this.groupsService.createGroup(user.uid, createGroupDto);
  }

  @Delete('/delete/:id')
  async deleteGroup(
    @Param('id') groupId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.groupsService.deleteGroup(groupId, user);
  }

  @Put('/update')
  async updateGroup(@Body() updateGroupDto: UpdateGroupDto): Promise<Group> {
    return await this.groupsService.updateGroup(updateGroupDto);
  }

  @Get('/:id')
  async getGroupById(@Param('id') groupId: string) {
    return await this.groupsService.findGroupById(groupId);
  }

  @Get('/:id/members')
  async getGroupMembers(@Param('id') groupId: string): Promise<GroupMember[]> {
    return await this.groupMembersService.findAllGroupMembers(groupId);
  }

  @Get('/:id/users')
  async getGroupUsers(@Param('id') groupId: string): Promise<User[]> {
    return await this.groupMembersService.findAllGroupUsers(groupId);
  }

  @Get('/:id/managers')
  async getGroupManagers(@Param('id') groupId: string): Promise<GroupMember[]> {
    return await this.groupMembersService.findAllGroupManagers(groupId);
  }

  @Post('/:id/add')
  async addUserToGroup(
    @Param('id') groupId: string,
    @Body() userIds: string[],
  ): Promise<GroupMember[]> {
    return await this.groupMembersService.addUsersToGroup(groupId, userIds);
  }

  @Delete('/:id/leave/:userId')
  async leaveGroup(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return await this.groupMembersService.leaveGroup(groupId, userId);
  }

  @Delete('/:id/remove/:userId')
  async removeMemeberFromGroup(
    @GetUser() manager: User,
    @Param('id') groupId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return await this.groupMembersService.removeMemeberFromGroup(
      groupId,
      userId,
      manager.uid,
    );
  }

  @Post('/profile-picture/upload/:id')
  @UseInterceptors(FileInterceptor('profilePic'))
  async uploadFile(
    @Param('id') groupId: string,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: /jpeg|png|jpg/ }), //images
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fetchedGroup = await this.groupsService.findGroupById(groupId);
    const fetchedUser = await this.groupMembersService.findGroupMember(
      groupId,
      user.uid,
    );
    if (!fetchedUser.isManager)
      throw new UnauthorizedException(
        'only group manager can update group profile',
      );
    const fileName = `${Date.now()}-${groupId}`;
    const fileWithExt = `${fileName}.${file.mimetype.split('/')[1]}`;
    const uploadedFile = await this.azureStorageService.uploadFile(
      'pictures',
      fileWithExt,
      file.buffer,
    );
    if (fetchedGroup.groupPicture != undefined) {
      await this.deleteFile(groupId, user);
    }

    await this.groupsService.updateGroupPicture(groupId, fileWithExt);
  }

  @Delete('/profile-picture/delete/:id')
  async deleteFile(@Param('id') groupId: string, @GetUser() user: User) {
    const fetchedGroup = await this.groupsService.findGroupById(groupId);
    const fetchedUser = await this.groupMembersService.findGroupMember(
      groupId,
      user.uid,
    );
    if (!fetchedUser.isManager)
      throw new UnauthorizedException(
        'only group manager can update group profile',
      );
    let blobName;
    if (fetchedGroup.groupPicture != undefined) {
      blobName = fetchedGroup.groupPicture;
    } else
      throw new NotFoundException(
        `no existing profile picture for group: ${groupId}`,
      );
    const container = 'pictures';
    await this.azureStorageService.deleteFile(container, blobName);
    await this.groupsService.updateGroupPicture(groupId, undefined);
    return { message: `Deleted ${blobName}` };
  }

  @Get('/profile-picture/download/:id')
  async downloadProfilePicture(
    groupId: string,
    @Res() res: Response,
  ): Promise<void> {
    const fetchedGroup = await this.groupsService.findGroupById(groupId);
    let blobName;
    if (fetchedGroup.groupPicture != undefined) {
      blobName = fetchedGroup.groupPicture;
    } else
      throw new NotFoundException(
        `no existing profile picture for group: ${groupId}`,
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
