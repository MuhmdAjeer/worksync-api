import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { UuidParam } from 'src/decorators';
import {
  AddLabelDto,
  AddMemberDto,
  UpdateLabelDto,
  UpdateProjectDto,
} from 'src/dtos/project.dto';
import { MembersFilterQuery } from 'src/dtos/workspace.dto';
import { IssueLabel } from 'src/entities/IssueLabels.entity';
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

  @Post('/:id/label')
  async addLabel(@UuidParam('id') id: string, @Body() labeldto: AddLabelDto) {
    return await this.projectSvc.addLabel(id, labeldto);
  }

  @Get('/:id/label')
  @ApiExtraModels(IssueLabel)
  async getLabels(@UuidParam('id') id: string) {
    return this.projectSvc.getLabels(id);
  }

  @Patch('/:projectId/label/:labelId')
  async updateLabel(
    @UuidParam('labelId') id: string,
    @Body() body: UpdateLabelDto,
  ) {
    return this.projectSvc.updateLabel(id, body);
  }

  @Delete('/:projectId/label/:labelId')
  async deleteLabel(@UuidParam('labelId') id: string) {
    return await this.projectSvc.removeLabel(id);
  }
}
