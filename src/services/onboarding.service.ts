import { Injectable } from '@nestjs/common';
import { User, UserRepo } from 'src/entities/User.entity';
import { OnboardDto } from 'src/dtos/CreateWorkspaceDto';
import { Workspace, WorkspaceRepo } from 'src/entities/Workspace.entity';
import { ClsService } from 'nestjs-cls';
import { Invitation, InvitationRepo } from 'src/entities/Invitation.entity';
import { MailService } from './mail.service';
import { WorkspaceDto } from 'src/dtos/workspace.dto';
@Injectable()
export class OnboardingService {
  constructor(
    private workspaceRepo: WorkspaceRepo,
    private invitationRepo: InvitationRepo,
    private clsService: ClsService,
    private userRepo: UserRepo,
    private mailSvc: MailService,
  ) {}

  async onboardUser(onboardDto: OnboardDto): Promise<WorkspaceDto | null> {
    const user = this.clsService.get<User>('reqUser');
    const workspace = new Workspace({
      name: onboardDto.name,
      owner_id: user.id,
      use: onboardDto.use,
    });

    await this.workspaceRepo.getEntityManager().persistAndFlush(workspace);

    for (const member of onboardDto.members) {
      if (member.email === user.email) return null;
      const invitation = new Invitation({
        email: member.email,
        workspace_id: workspace.id,
        role: member.role,
      });

      await this.mailSvc.inviteToWorkspace({
        email: member.email,
        ownerEmail: user.email,
        workspaceName: workspace.name,
      });
      await this.invitationRepo.getEntityManager().persistAndFlush(invitation);
    }

    this.userRepo.assign(user, {
      username: onboardDto.user_name,
      profile_picture: onboardDto.profile_picture,
    });
    await this.userRepo.getEntityManager().persistAndFlush(user);

    return workspace;
  }
}
