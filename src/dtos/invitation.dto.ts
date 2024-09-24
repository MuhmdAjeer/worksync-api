import { Transform } from 'class-transformer';
import { BaseDto } from './base.dto';
import {
  EUserWorkspaceRoles,
  InviteMemberDto,
  WorkspaceDto,
} from './workspace.dto';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
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
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null;
  })
  is_accepted?: boolean | null;
}

export class UpdateInvitationDto extends PartialType(InviteMemberDto) {}
