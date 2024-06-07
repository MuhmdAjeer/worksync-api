import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkspaceDto } from 'src/dtos/CreateWorkspaceDto';
import { JwtAuthGuard } from 'src/guards';
import { ProjectService } from 'src/services/project.service';
import { WorkspaceService } from 'src/services/workspace.service';
@Controller('workspace')
export class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService,
    private projectSvc: ProjectService,
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
  @Get('/:workspaceId/projects')
  async getWorkspaceProjects(@Param('workspaceId') id: string) {
    return this.projectSvc.findProjectsByWorkspace(id);
  }
  @Get('/users')
  async listUsers() {
    return await this.workspaceService.listUsers();
  }
}
