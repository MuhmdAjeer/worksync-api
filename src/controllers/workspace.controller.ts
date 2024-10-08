import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { query } from 'express';
import { UuidParam } from 'src/decorators';
import { CreateWorkspaceDto } from 'src/dtos/CreateWorkspaceDto';
import {
  InvitationDto,
  InvitationQuery,
  UpdateInvitationDto,
} from 'src/dtos/invitation.dto';
import { ProjectDto, createProjectDto } from 'src/dtos/project.dto';
import {
  InviteMembersDto,
  MembersFilterQuery,
  WorkspaceMemberDto,
} from 'src/dtos/workspace.dto';
import { Invitation } from 'src/entities/Invitation.entity';
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
  @ApiExtraModels(MembersFilterQuery)
  async getMembers(
    @Param('slug') slug: string,
    @Query() filter: MembersFilterQuery,
  ) {
    return await this.workspaceService.getMembers(slug, filter);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':slug/project')
  async create(@Body() body: createProjectDto, @Param('slug') slug: string) {
    return await this.projectSvc.create(slug, body);
  }

  @Get('/users')
  async listUsers() {
    return await this.workspaceService.listUsers();
  }

  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(InvitationQuery)
  @Get(':slug/invitations')
  async getInvitations(
    @Param('slug') slug: string,
    @Query() query: InvitationQuery,
  ): Promise<Invitation[]> {
    this.logger.log({ slug, query });
    return await this.inviteService.getInvites(slug, query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':slug/invitation/:invitationId')
  async updateInvitation(
    @UuidParam('invitationId') invitationId: string,
    @Body() updateDto: UpdateInvitationDto,
  ) {
    return await this.inviteService.updateInvite(invitationId, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug/invitation/:invitationId')
  async removeInvitation(@UuidParam('invitationId') inviteId: string) {
    return await this.inviteService.removeInvite(inviteId);
  }
}
