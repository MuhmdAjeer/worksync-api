import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseDto } from './base.dto';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class WorkspaceDto extends BaseDto {
  name: string;
  use: string;
  owner_id: string;
}

export enum EUserWorkspaceRoles {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export class WorkspaceMemberDto extends BaseDto {
  user: UserDto;
  workspace: WorkspaceDto;
  role: EUserWorkspaceRoles;
}

export class InviteMembersDto {
  emails: InviteMemberDto[];
}

class InviteMemberDto {
  email: string;

  @IsEnum(EUserWorkspaceRoles)
  @IsNotEmpty()
  @ApiProperty({ enum: EUserWorkspaceRoles })
  role: EUserWorkspaceRoles;
}
