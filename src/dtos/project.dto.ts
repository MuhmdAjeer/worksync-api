import { BaseDto } from './base.dto';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { IssuePriority, IssueStateDto } from './Issue.dto';
import { WorkspaceDto } from './workspace.dto';
import { UserDto } from './user.dto';
import { PartialType } from '@nestjs/swagger';

export class ProjectDto extends BaseDto {
  name: string;
  description: string;
  custom_id: string;
  workspace: WorkspaceDto;
  states: IssueStateDto[];
  // labels: IssueLabel[];
  lead: UserDto;
  cover_image?: string;
  logo?: string;
  // members: UserDto[];
}

export class IssueDto extends BaseDto {
  title: string;
  description?: string;
  Project: ProjectDto;
  issued_by: UserDto;
  priority?: IssuePriority;
  state?: IssueStateDto;
  start_date?: Date;
  end_date?: Date;
  assignees: UserDto[];
}

export class createProjectDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  custom_id: string;
  @IsNotEmpty()
  @IsUUID()
  lead_id: string;

  cover_image?: string;
  logo?: string;
}

export class UpdateProjectDto extends PartialType(createProjectDto) {}

export class ProjectMemberDto extends BaseDto {
  user: UserDto;
  project: string;
  role: EUserProjectRoles;
}

export enum EUserProjectRoles {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}
class PMemberDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
  @IsEnum(EUserProjectRoles)
  role: EUserProjectRoles;
}
export class AddMemberDto {
  members: PMemberDto[];
}
