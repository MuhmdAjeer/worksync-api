import { IsUUID } from 'class-validator';
import { BaseDto } from './base.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum IssueState {
  BACKLOG = 'Backlog',
  TODO = 'Todo',
  IN_PROGRESS = 'In progress',
  DONE = 'Done',
  CANCELLED = 'Cancelled',
}

export enum IssuePriority {
  URGENT = 'Urgent',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export class CreateIssueDto {
  title: string;
  description?: string | undefined;
  priority?: IssuePriority;
  state?: IssueState;
  @IsUUID(undefined, { each: true })
  assignees_id?: string[];
  start_date?: Date;
  end_date?: Date;
}

export class IssueStateDto extends BaseDto {
  name: string;
  color?: string;
  @ApiProperty()
  group: TStateGroups;
  description?: string;
}

export class UpdateIssueDto extends PartialType(CreateIssueDto) {}

export enum TStateGroups {
  BACKLOG = 'backlog',
  UNSTARTED = 'unstarted',
  STARTED = 'started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
