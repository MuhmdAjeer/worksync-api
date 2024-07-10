import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UuidParam } from 'src/decorators';
import { CreateIssueDto, UpdateIssueDto } from 'src/dtos/Issue.dto';
import { ProjectRepo } from 'src/entities/Project.entity';
import { JwtAuthGuard } from 'src/guards';
import { IssueService } from 'src/services/issue.service';

@Controller('/project/:projectId/issues')
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

  @Get()
  async getProjectIssues(@UuidParam('projectId') id: string) {
    return this.issueService.getIssues(id);
  }

  @Patch(':id')
  async updateIssue(@UuidParam('id') id: string, @Body() body: UpdateIssueDto) {
    return this.issueService.updateIssue(id, body);
  }
}
