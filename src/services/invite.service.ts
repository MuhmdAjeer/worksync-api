import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/dtos/user.dto';
import { InviteMembersDto } from 'src/dtos/workspace.dto';
import { Invitation, InvitationRepo } from 'src/entities/Invitation.entity';
import { Workspace } from 'src/entities/Workspace.entity';
import { MailService } from './mail.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class InviteService {
  constructor(
    private clsService: ClsService,
    private mailSvc: MailService,
    private invitationRepo: InvitationRepo,
  ) {}

  private readonly logger = new Logger(InviteService.name);

  public async inviteMembers(
    workspace: Workspace,
    inviteMembers: InviteMembersDto,
  ) {
    const user = this.clsService.get<UserDto>('reqUser');
    this.logger.log({ user });
    for (const member of inviteMembers.emails) {
      if (member.email === user.email)
        throw new ConflictException('Member already exists');
      if (workspace.members.exists((m) => m.user.email == member.email)) {
        throw new ConflictException('Member already exists');
      }
      const invitation = new Invitation({
        email: member.email,
        workspace: workspace,
        role: member.role,
      });

      this.logger.log({ invitation });

      await this.mailSvc.inviteToWorkspace({
        email: member.email,
        ownerEmail: user.email,
        workspaceName: workspace.name,
      });
      await this.invitationRepo.getEntityManager().persistAndFlush(invitation);
    }
  }
}
