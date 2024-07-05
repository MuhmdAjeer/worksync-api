import { BaseDto } from './base.dto';
import { UserDto } from './user.dto';

export class WorkspaceDto extends BaseDto {
  name: string;
  use: string;
  owner_id: string;
}

export class WorkspaceMemberDto {
  id: number;
  user: UserDto;
  workspace: WorkspaceDto;
  role: string;
}

export class InviteMembersDto {
  emails: InviteMemberDto[];
}

class InviteMemberDto {
  email: string;
  role: string;
}
