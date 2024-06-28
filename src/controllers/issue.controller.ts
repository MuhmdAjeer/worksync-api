import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CreateIssueDto } from 'src/dtos/Issue.dto';
import { ProjectRepo } from 'src/entities/Project.entity';
import { JwtAuthGuard } from 'src/guards';
import { IssueService } from 'src/services/issue.service';

@Controller('/project/:projectId/issue')
export class IssueController {
  constructor(
    private issueService: IssueService,
    private projectRepo: ProjectRepo,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Param('projectId') id: string,
    @Body() body: CreateIssueDto,
  ) {
    const project = await this.projectRepo.findOneOrFail({ id });
    return this.issueService.create(body, project);
  }
}
