import { BaseDto } from './base.dto';
import { EUserWorkspaceRoles, WorkspaceDto } from './workspace.dto';
import { IsBooleanString, IsOptional, IsUUID } from 'class-validator';

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

export class InvitationQuery {
  @IsBooleanString()
  @IsOptional()
  is_accepted?: boolean;
}
