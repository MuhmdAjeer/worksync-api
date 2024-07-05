import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { User, UserRepo } from 'src/entities/User.entity';
import { CreateWorkspaceDto } from 'src/dtos/CreateWorkspaceDto';
import { Workspace, WorkspaceRepo } from 'src/entities/Workspace.entity';
import { ClsService } from 'nestjs-cls';
import { Invitation, InvitationRepo } from 'src/entities/Invitation.entity';
import { MailService } from './mail.service';
import {
  InviteMembersDto,
  WorkspaceDto,
  WorkspaceMemberDto,
} from 'src/dtos/workspace.dto';
import { InviteService } from './invite.service';
import { WorkspaceMember } from 'src/entities/WorkspaceMember.entity';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
@Injectable()
export class WorkspaceService {
  constructor(
    private workspaceRepo: WorkspaceRepo,
    private invitationRepo: InvitationRepo,
    private clsService: ClsService,
    private userRepo: UserRepo,
    private mailSvc: MailService,
    private inviteSvc: InviteService,
    private em: EntityManager,
  ) {}
  private readonly logger = new Logger('workspace svc');

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    const user = this.clsService.get<User>('reqUser');

    const workspace = new Workspace({
      name: createWorkspaceDto.name,
      owner_id: user.id,
      use: createWorkspaceDto.use,
    });

    const owner = new WorkspaceMember({
      role: 'admin',
      user,
      workspace: workspace,
    });
    workspace.members.add(owner);

    for (const member of createWorkspaceDto.members) {
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
      this.em.persistAndFlush(invitation);
    }

    this.em.persistAndFlush([workspace, owner, workspace]);
    return;
  }

  async getUserWorkspaces() {
    const { id } = this.clsService.get<User>('reqUser');
    const user = await this.userRepo.findOneOrFail(
      { id },
      { populate: ['workspaces.workspace'] },
    );
    const workspaces = user.workspaces.getItems().map((wm) => wm.workspace);
    return workspaces;
  }

  async getWorkspaceBySlug(slug: string): Promise<WorkspaceDto> {
    const workspace = await this.workspaceRepo.findOneOrFail({ name: slug });
    return workspace;
  }

  async inviteMembers(slug: string, inviteDto: InviteMembersDto) {
    const workspace = await this.workspaceRepo.findOneOrFail(
      { name: slug },
      { populate: ['members'] },
    );
    await this.inviteSvc.inviteMembers(workspace, inviteDto);
    this.logger.debug('HYYYYY TIS ONE');
    return;
  }

  async getMembers(slug: string): Promise<WorkspaceMemberDto[]> {
    const workspace = await this.workspaceRepo.findOneOrFail(
      { name: slug },
      { populate: ['members.user'] },
    );
    return workspace.members.map((m) => wrap(m).toObject());
  }

  async listUsers() {
    const users = await this.userRepo.findAll();
    return users;
  }
}
