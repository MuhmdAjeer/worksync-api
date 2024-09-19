import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/dtos/user.dto';
import { InviteMembersDto } from 'src/dtos/workspace.dto';
import { Invitation, InvitationRepo } from 'src/entities/Invitation.entity';
import { Workspace, WorkspaceRepo } from 'src/entities/Workspace.entity';
import { MailService } from './mail.service';
import { ClsService } from 'nestjs-cls';
import {
  AcceptInvitationsDto,
  InvitationDto,
  InvitationQuery,
} from 'src/dtos/invitation.dto';
import { User, UserRepo } from 'src/entities/User.entity';
import { WorkspaceMember } from 'src/entities/WorkspaceMember.entity';
import { EntityManager, wrap } from '@mikro-orm/postgresql';

@Injectable()
export class InviteService {
  constructor(
    private clsService: ClsService,
    private mailSvc: MailService,
    private invitationRepo: InvitationRepo,
    private userRepo: UserRepo,
    private workspaceRepo: UserRepo,
    private em: EntityManager,
  ) {}

  private readonly logger = new Logger(InviteService.name);

  public async inviteMembers(
    workspace: Workspace,
    inviteMembers: InviteMembersDto,
  ) {
    const user = this.clsService.get<UserDto>('reqUser');

    for (const member of inviteMembers.emails) {
      // Check if the owner is inviting themselves
      if (member.email === user.email) {
        throw new ConflictException('You cannot invite yourself');
      }

      // Check if the member already exists in the workspace
      if (workspace.members.exists((m) => m.user.email === member.email)) {
        throw new ConflictException('Member already exists in the workspace');
      }

      // Check if the member has already been invited
      const isAlreadyInvited = await this.invitationRepo.findOne({
        email: member.email,
        workspace,
      });
      if (isAlreadyInvited) {
        throw new ConflictException('Member already invited');
      }

      // Create a new invitation and send an email invite
      const invitation = new Invitation({
        email: member.email,
        workspace: workspace,
        role: member.role,
      });

      await this.mailSvc.inviteToWorkspace({
        email: member.email,
        ownerEmail: user.email,
        workspaceName: workspace.name,
      });

      await this.invitationRepo.getEntityManager().persistAndFlush(invitation);
    }
  }

  public async acceptInvites(acceptInvitationDto: AcceptInvitationsDto) {
    const { id: user_id } = this.clsService.get<User>('reqUser');
    const user = await this.userRepo.findOneOrFail({ id: user_id });

    for (const invitation_id of acceptInvitationDto.invitations) {
      const invitation = await this.invitationRepo.findOneOrFail({
        id: invitation_id,
        email: user.email,
        is_accepted: false,
      });
      const workspace = await invitation.workspace.loadOrFail();
      const member = new WorkspaceMember({
        role: invitation.role,
        user,
        workspace,
      });

      workspace.members.add(member);
      invitation.is_accepted = true;

      this.em.persistAndFlush([workspace, invitation, member]);
    }
  }

  public async getInvites(
    slug: string,
    query: InvitationQuery,
  ): Promise<InvitationDto[]> {
    const invitations = await this.invitationRepo.find(
      {
        workspace: { name: slug },
        is_accepted: query.is_accepted,
      },
      { populate: ['*'] },
    );
    return invitations.map((x) => wrap(x).toObject());
  }
}
