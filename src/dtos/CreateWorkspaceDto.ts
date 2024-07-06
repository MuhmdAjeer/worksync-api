import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EUserProjectRoles } from './project.dto';
import { EUserWorkspaceRoles } from './workspace.dto';
class MemberDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  role: EUserWorkspaceRoles;
}

export class CreateWorkspaceDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  use: string;

  @ApiProperty()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ isArray: true, type: MemberDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members: MemberDto[];
}

export class OnboardDto extends CreateWorkspaceDto {
  @ApiProperty()
  @IsOptional()
  profile_picture?: string;

  @ApiProperty()
  @IsNotEmpty()
  user_name: string;
}
