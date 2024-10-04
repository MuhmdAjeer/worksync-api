import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UuidParam } from 'src/decorators';
import { AddMemberDto } from 'src/dtos/project.dto';
import { MembersFilterQuery } from 'src/dtos/workspace.dto';
import { ProjectService } from 'src/services/project.service';

@Controller('project')
export class ProjectsController {
  constructor(private projectSvc: ProjectService) {}

  @Get('/:id')
  async getProject(@UuidParam('id') id: string) {
    return await this.projectSvc.findProjectById(id);
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
}
