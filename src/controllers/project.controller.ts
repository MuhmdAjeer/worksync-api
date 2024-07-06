import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UuidParam } from 'src/decorators';
import { createProjectDto } from 'src/dtos/project.dto';
import { ProjectService } from 'src/services/project.service';

@Controller('project')
export class ProjectsController {
  constructor(private projectSvc: ProjectService) {}

  @Get('/:id')
  async getProject(@UuidParam('id') id: string) {
    return await this.projectSvc.findProjectById(id);
  }
}
