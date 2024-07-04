import { Body, Controller, Param, Post } from '@nestjs/common';
import { createProjectDto } from 'src/dtos/project.dto';
import { ProjectService } from 'src/services/project.service';

@Controller(':slug/project')
export class ProjectsController {
  constructor(private projectSvc: ProjectService) {}

  @Post()
  async create(@Body() body: createProjectDto, @Param('slug') slug: string) {
    return await this.projectSvc.create(slug, body);
  }
}
