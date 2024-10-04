import { wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { InvitationDto } from 'src/dtos/invitation.dto';
import { UserDto } from 'src/dtos/user.dto';
import { InvitationRepo } from 'src/entities/Invitation.entity';
import { ProjectRepo } from 'src/entities/Project.entity';
import { ProjectMemberRepo } from 'src/entities/ProjectMember.entity';
import { UserRepo } from 'src/entities/User.entity';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepo,
    private invitationRepo: InvitationRepo,
    private clsService: ClsService,
    private projectMemberRepo: ProjectMemberRepo,
    private projectRepo: ProjectRepo,
  ) {}

  async getInvitations(): Promise<InvitationDto[]> {
    const user = this.clsService.get<UserDto>('reqUser');
    const invitations = await this.invitationRepo.findAll({
      where: { email: user.email, is_accepted: false },
      populate: ['workspace'],
    });
    return invitations.map((x) => wrap(x).toObject());
  }

  async updateProfile(profile: Partial<UserDto>): Promise<UserDto> {
    const userDto = this.clsService.get<UserDto>('reqUser');
    const user = await this.userRepo.findOneOrFail({ id: userDto.id });
    wrap(user).assign(profile);
    await this.userRepo.getEntityManager().persistAndFlush(user);
    return user;
  }

  async getCurrentUser(): Promise<UserDto> {
    const { id } = this.clsService.get<UserDto>('reqUser');
    const user = await this.userRepo.findOneOrFail({ id });
    return user;
  }

  async isUserPartOfProject(userId: string, projectId: string) {
    const member = await this.projectMemberRepo.findOne({
      user: userId,
      project: projectId,
    });
    return !!member;
  }

  async getProjects() {
    const user = this.clsService.get<UserDto>('reqUser');
    const projects = await this.projectRepo.find({
      members: { user: { id: user.id } },
    });
    return projects;
  }
}
