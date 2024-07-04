import { BaseDto } from './base.dto';

export class WorkspaceDto extends BaseDto {
  name: string;
  use: string;
  owner_id: string;
}

export class InviteMembersDto {
  emails: InviteMemberDto[];
}

class InviteMemberDto {
  email: string;
  role: string;
}
