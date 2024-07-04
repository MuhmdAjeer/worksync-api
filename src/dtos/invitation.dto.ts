import { Workspace } from 'src/entities/Workspace.entity';
import { BaseDto } from './base.dto';
import { WorkspaceDto } from './workspace.dto';

export class InvitationDto extends BaseDto {
  email: string;
  workspace: WorkspaceDto;
  is_accepted: boolean;
  role: string;
}
