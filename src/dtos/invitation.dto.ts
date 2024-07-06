import { Workspace } from 'src/entities/Workspace.entity';
import { BaseDto } from './base.dto';
import { EUserWorkspaceRoles, WorkspaceDto } from './workspace.dto';
import { IsArray, IsUUID } from 'class-validator';
import { EUserProjectRoles } from './project.dto';

export class InvitationDto extends BaseDto {
  email: string;
  workspace: WorkspaceDto;
  is_accepted: boolean;
  role: EUserWorkspaceRoles;
}

export class AcceptInvitationsDto {
  @IsUUID(undefined, { each: true })
  invitations: string[];
}
