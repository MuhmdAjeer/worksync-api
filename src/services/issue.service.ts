import { wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import {
  CreateIssueDto,
  IssueFilterQuery,
  UpdateIssueDto,
} from 'src/dtos/Issue.dto';
import { IssueDto } from 'src/dtos/project.dto';
import { PaginatedResponse } from 'src/dtos/types';
import { Issue, IssueRepo } from 'src/entities/Issue.entity';
import { IssueState, IssueStateRepo } from 'src/entities/IssueState.entity';
import { ProjectRepo } from 'src/entities/Project.entity';
import { ProjectMemberRepo } from 'src/entities/ProjectMember.entity';
import { User } from 'src/entities/User.entity';

@Injectable()
export class IssueService {
  constructor(
    private issueRepo: IssueRepo,
    private issueStateRepo: IssueStateRepo,
    private clsService: ClsService,
    private projectRepo: ProjectRepo,
    private projectMemberRepo: ProjectMemberRepo,
  ) {}

  async create(
    createIssueDto: CreateIssueDto,
    projectId: string,
  ): Promise<IssueDto> {
    const project = await this.projectRepo.findOneOrFail({ id: projectId });
    let state: IssueState | undefined = undefined;
    if (createIssueDto.state) {
      state = await this.issueStateRepo.findOneOrFail({
        project,
        id: createIssueDto.state,
      });
    }

    const issue = new Issue({ ...createIssueDto, state });
    issue.Project = project;

    if (createIssueDto.assignees_id?.length) {
      for (const assigneeId of createIssueDto.assignees_id) {
        const pm = await this.projectMemberRepo.findOneOrFail({
          user: assigneeId,
          project: issue.Project.id,
        });
        issue.assignees.add(pm.user);
      }
    }

    issue.issued_by = this.clsService.get<User>('reqUser');

    await this.issueRepo.getEntityManager().persistAndFlush(issue);

    return wrap(issue).toObject();
  }

  async getIssues(
    projectId: string,
    filter: IssueFilterQuery,
  ): Promise<PaginatedResponse<Issue>> {
    const project = await this.projectRepo.findOneOrFail({ id: projectId });
    const { page, pageSize, ...restFilter } = filter;
    const [issues, total] = await this.issueRepo.findAndCount(
      {
        Project: project,
        $and: [
          {
            ...restFilter,
          },
        ],
      },
      {
        populate: ['Project', 'assignees'],
        orderBy: { created_at: 'ASC' },
        ...(page && pageSize && { offset: page * pageSize }),
        ...(pageSize && { limit: pageSize }),
      },
    );

    const nextPage =
      page && pageSize ? ((page + 1) * pageSize < total ? page + 1 : null) : 0;
    return {
      data: issues,
      nextPage,
    };
  }

  async updateIssue(
    issueId: string,
    updateDto: UpdateIssueDto,
  ): Promise<IssueDto> {
    const issue = await this.issueRepo.findOneOrFail({ id: issueId });
    const { assignees_id, state, ...restUpdateDto } = updateDto;

    wrap(issue).assign(restUpdateDto);

    if (updateDto.assignees_id?.length) {
      issue.assignees.removeAll();
      for (const assigneeId of updateDto.assignees_id) {
        const pm = await this.projectMemberRepo.findOneOrFail({
          user: assigneeId,
          project: issue.Project.id,
        });
        issue.assignees.add(pm.user);
      }
    }

    if (updateDto.state) {
      const state = await this.issueStateRepo.findOneOrFail({
        project: issue.Project,
        id: updateDto.state,
      });
      issue.state = state;
    }

    this.issueRepo.getEntityManager().flush();
    return wrap(issue).toObject();
  }
}
