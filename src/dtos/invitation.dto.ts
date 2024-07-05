import { Workspace } from 'src/entities/Workspace.entity';
import { BaseDto } from './base.dto';
import { WorkspaceDto } from './workspace.dto';
import { IsArray, IsUUID } from 'class-validator';

export class InvitationDto extends BaseDto {
  email: string;
  workspace: WorkspaceDto;
  is_accepted: boolean;
  role: string;
}

export class AcceptInvitationsDto {
  @IsUUID(undefined, { each: true })
  invitations: string[];
}
