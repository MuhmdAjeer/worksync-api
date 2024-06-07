import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';
import { Workspace } from 'src/entities/Workspace.entity';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class Project extends BaseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  custom_id: string;

  @ApiProperty()
  workspace: Workspace;
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
