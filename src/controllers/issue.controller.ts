import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import { UuidParam } from 'src/decorators';
import {
  CreateIssueDto,
  IssueFilterQuery,
  UpdateIssueDto,
} from 'src/dtos/Issue.dto';
import { ProjectRepo } from 'src/entities/Project.entity';
import { JwtAuthGuard } from 'src/guards';
import { IssueService } from 'src/services/issue.service';

@Controller('/project/:projectId/issues')
export class IssueController {
  constructor(private issueService: IssueService) {}
  private logger = new Logger('Issue Service');

  @UseGuards(JwtAuthGuard)
  @Post()
  async crateIssue(
    @UuidParam('projectId') id: string,
    @Body() body: CreateIssueDto,
  ) {
    return this.issueService.create(body, id);
  }

  @Get()
  @ApiExtraModels(IssueFilterQuery)
  async getProjectIssues(
    @UuidParam('projectId') id: string,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    filter: IssueFilterQuery,
  ) {
    return this.issueService.getIssues(id, filter);
  }

  @Patch(':id')
  async updateIssue(@UuidParam('id') id: string, @Body() body: UpdateIssueDto) {
    return this.issueService.updateIssue(id, body);
  }
}
