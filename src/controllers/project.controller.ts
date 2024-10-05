import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UuidParam } from 'src/decorators';
import { AddMemberDto, UpdateProjectDto } from 'src/dtos/project.dto';
import { MembersFilterQuery } from 'src/dtos/workspace.dto';
import { ProjectService } from 'src/services/project.service';

@Controller('project')
export class ProjectsController {
  constructor(private projectSvc: ProjectService) {}

  @Get('/:id')
  async getProject(@UuidParam('id') id: string) {
    return await this.projectSvc.findProjectById(id);
  }

  @Patch('/:id/')
  async updateProject(
    @UuidParam('id') id: string,
    @Body() updateDto: UpdateProjectDto,
  ) {
    return await this.projectSvc.updateProject(id, updateDto);
  }

  @Get('/:id/states')
  async getProjectStates(@UuidParam('id') id: string) {
    return await this.projectSvc.getStates(id);
  }

  @Get('/:id/members')
  async getProjectMembers(
    @UuidParam('id') id: string,
    @Query() filter: MembersFilterQuery,
  ) {
    return await this.projectSvc.getMembers(id, filter);
  }

  @Post('/:id/members')
  async addMembers(
    @UuidParam('id') id: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return await this.projectSvc.addMembers(id, addMemberDto);
  }

  @Delete('/:id')
  async deleteProject(@UuidParam('id') id: string) {
    return await this.projectSvc.deleteProject(id);
  }
}
