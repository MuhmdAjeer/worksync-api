import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';
import { Workspace } from 'src/entities/Workspace.entity';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Issue } from 'src/entities/Issue.entity';
import { IssueState } from 'src/entities/IssueState.entity';
import { IssueLabel } from 'src/entities/IssueLabels.entity';
import { User } from 'src/entities/User.entity';
import { IssuePriority, IssueStateDto } from './Issue.dto';
import { WorkspaceDto } from './workspace.dto';
import { UserDto } from './user.dto';

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
  members: UserDto[];
}

export class IssueDto extends BaseDto {
  title: string;
  description: string;
  // project: ProjectDto;
  // issued_by: User;
  // priority: IssuePriority;
  start_date: Date;
  end_date: Date;
  // assignees: User[];
}

export class createProjectDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  custom_id: string;
  @IsNotEmpty()
  workspace_id: string;
  @IsNotEmpty()
  @IsUUID()
  lead_id: string;

  cover_image?: string;
  logo?: string;
}
