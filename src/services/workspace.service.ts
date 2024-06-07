import { Injectable, Logger } from '@nestjs/common';
import { User, UserRepo } from 'src/entities/User.entity';
import { CreateWorkspaceDto } from 'src/dtos/CreateWorkspaceDto';
import { Workspace, WorkspaceRepo } from 'src/entities/Workspace.entity';
import { ClsService } from 'nestjs-cls';
import { Invitation, InvitationRepo } from 'src/entities/Invitation.entity';
import { MailService } from './mail.service';
@Injectable()
export class WorkspaceService {
  constructor(
    private workspaceRepo: WorkspaceRepo,
    private invitationRepo: InvitationRepo,
    private clsService: ClsService,
    private userRepo: UserRepo,
    private mailSvc: MailService,
  ) {}
  private readonly logger = new Logger('workspace svc');

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    const user = this.clsService.get<User>('reqUser');
    const workspace = new Workspace({
      name: createWorkspaceDto.name,
      owner_id: user.id,
      use: createWorkspaceDto.use,
    });
    this.workspaceRepo.getEntityManager().persistAndFlush(workspace);

    for (const member of createWorkspaceDto.members) {
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
      this.invitationRepo.getEntityManager().persistAndFlush(invitation);
    }
  }

  async getUserWorkspaces() {
    const user = this.clsService.get<User>('reqUser');
    const workspaces = await this.workspaceRepo.find({ owner_id: user.id });
    this.logger.log({ workspaces });
    return workspaces;
  }

  async listUsers() {
    const users = await this.userRepo.findAll();
    this.logger.log({ usersddvdfd: users });
    return users;
  }
}
