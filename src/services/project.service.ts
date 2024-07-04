import {
  EntityDTO,
  EntityTransformer,
  ref,
  serialize,
  wrap,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { states } from 'src/constants/project';
import { ProjectDto, createProjectDto } from 'src/dtos/project.dto';
import { IssueState, IssueStateRepo } from 'src/entities/IssueState.entity';
import { Project, ProjectRepo } from 'src/entities/Project.entity';
import { UserRepo } from 'src/entities/User.entity';
import { WorkspaceRepo } from 'src/entities/Workspace.entity';

@Injectable()
export class ProjectService {
  constructor(
    private workspaceRepo: WorkspaceRepo,
    private userRepo: UserRepo,
    private projectRepo: ProjectRepo,
    private em: EntityManager,
  ) {}
  private readonly logger = new Logger(ProjectService.name);

  async create(
    slug: string,
    projectDto: createProjectDto,
  ): Promise<ProjectDto> {
    const workspace = await this.workspaceRepo.findOneOrFail({
      name: slug,
    });

    const project = new Project(projectDto);
    const lead = await this.userRepo.findOneOrFail({ id: projectDto.lead_id });

    project.workspace = workspace;
    project.lead = lead;
    project.members.add(lead);

    for (const state of states) {
      const issueState = new IssueState({ ...state, project: ref(project) });
      project.states.add(issueState);
    }

    await this.projectRepo.getEntityManager().persistAndFlush(project);
    return wrap(project).toObject();
  }

  async findProjectsByWorkspace(workspaceId: string): Promise<ProjectDto[]> {
    const workspace = await this.workspaceRepo.findOneOrFail({
      name: workspaceId,
    });

    const projects = await this.projectRepo.find(
      { workspace },
      { populate: ['workspace', 'members', 'issues', 'labels', 'states'] },
    );

    return projects.map((x) => wrap(x).toObject());
  }
}
