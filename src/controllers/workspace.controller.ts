import { Mapper } from '@automapper/core';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateWorkspaceDto } from 'src/dtos/CreateWorkspaceDto';
import { ProjectDto } from 'src/dtos/project.dto';
import { InviteMembersDto } from 'src/dtos/workspace.dto';
import { Project } from 'src/entities/Project.entity';
import { JwtAuthGuard } from 'src/guards';
import { InviteService } from 'src/services/invite.service';
import { ProjectService } from 'src/services/project.service';
import { WorkspaceService } from 'src/services/workspace.service';
@Controller('workspace')
export class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService,
    private projectSvc: ProjectService,
    private inviteService: InviteService,
  ) {}

  private readonly logger = new Logger('auth controller');

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createWorkspace(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return await this.workspaceService.create(createWorkspaceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getWorkspaces() {
    return await this.workspaceService.getUserWorkspaces();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  async getWorkspaceBySlug(@Param('slug') slug: string) {
    return await this.workspaceService.getWorkspaceBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:slug/projects')
  async getWorkspaceProjects(@Param('slug') slug: string) {
    return await this.projectSvc.findProjectsByWorkspace(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':slug/invitations')
  async inviteMembers(
    @Param('slug') slug: string,
    @Body() body: InviteMembersDto,
  ) {
    return await this.workspaceService.inviteMembers(slug, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug/members')
  async getMembers(@Param('slug') slug: string) {
    await this.workspaceService.getMembers(slug);
  }

  @Get('/users')
  async listUsers() {
    return await this.workspaceService.listUsers();
  }
}
