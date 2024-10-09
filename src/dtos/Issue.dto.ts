import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  isString,
  IsString,
  IsUUID,
} from 'class-validator';
import { BaseDto } from './base.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { IssueDto } from './project.dto';

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
  NONE = 'None',
}

export class CreateIssueDto {
  title: string;
  description?: string | undefined;
  priority?: IssuePriority;
  state?: string;

  @IsUUID(undefined, { each: true })
  assignees_id?: string[];

  @IsUUID(undefined, { each: true })
  @IsOptional()
  label_ids?: string[];

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

export class IssueLabelDto extends BaseDto {
  name: string;
  color: string;
}

export class UpdateIssueDto extends PartialType(CreateIssueDto) {}

export enum TStateGroups {
  BACKLOG = 'backlog',
  UNSTARTED = 'unstarted',
  STARTED = 'started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class IssueFilterQuery {
  @IsOptional()
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  state?: string[];

  @IsOptional()
  @IsString()
  priority?: IssuePriority;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignees?: string[];

  @IsOptional()
  @Type(() => Number)
  page?: number;
  @IsOptional()
  @Type(() => Number)
  pageSize?: number;
}

export class CommentDto extends BaseDto {
  content: string;
  user: UserDto;
  issue: IssueDto;
}

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateCommentDto extends AddCommentDto {}
