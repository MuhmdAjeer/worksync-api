import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { UuidParam } from 'src/decorators';
import { CreateIssueDto } from 'src/dtos/Issue.dto';
import { ProjectRepo } from 'src/entities/Project.entity';
import { JwtAuthGuard } from 'src/guards';
import { IssueService } from 'src/services/issue.service';

@Controller('/project/:projectId/issue')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async crateIssue(
    @UuidParam('projectId') id: string,
    @Body() body: CreateIssueDto,
  ) {
    return this.issueService.create(body, id);
  }
}
