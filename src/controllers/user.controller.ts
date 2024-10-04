import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserDto } from 'src/dtos/user.dto';
import { JwtAuthGuard } from 'src/guards';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getCurrentUser() {
    return this.userService.getCurrentUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/invitations')
  async getInvitations() {
    return await this.userService.getInvitations();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  async updateUserProfile(@Body() updateDto: Partial<UserDto>) {
    return await this.userService.updateProfile(updateDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/me/projects')
  async getMyProjects() {
    return await this.userService.getProjects();
  }
}
