import { ref, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { states } from 'src/constants/project';
import { IssueStateDto } from 'src/dtos/Issue.dto';
import {
  EUserProjectRoles,
  ProjectDto,
  ProjectMemberDto,
  createProjectDto,
} from 'src/dtos/project.dto';
import { IssueState, IssueStateRepo } from 'src/entities/IssueState.entity';
import { Project, ProjectRepo } from 'src/entities/Project.entity';
import { ProjectMember } from 'src/entities/ProjectMember.entity';
import { UserRepo } from 'src/entities/User.entity';
import { WorkspaceRepo } from 'src/entities/Workspace.entity';

@Injectable()
export class ProjectService {
  constructor(
    private workspaceRepo: WorkspaceRepo,
    private userRepo: UserRepo,
    private projectRepo: ProjectRepo,
    private issueStateRepo: IssueStateRepo,
    private em: EntityManager,
  ) {}

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

    const projectMember = new ProjectMember({
      project: ref(project),
      // project,
      role: EUserProjectRoles.ADMIN,
      user: lead,
    });
    project.members.add(projectMember);

    for (const state of states) {
      const issueState = new IssueState({ ...state, project: ref(project) });
      project.states.add(issueState);
    }

    this.em.persistAndFlush([project, projectMember]);
    return wrap(project).toObject();
  }

  async findProjectsByWorkspace(workspaceId: string): Promise<Project[]> {
    const workspace = await this.workspaceRepo.findOneOrFail({
      name: workspaceId,
    });

    const projects = await this.projectRepo.find(
      { workspace },
      { populate: ['workspace', 'states'] },
    );

    return projects;
  }

  async findProjectById(id: string): Promise<ProjectDto> {
    const project = await this.projectRepo.findOneOrFail({ id });
    return wrap(project).toObject();
  }

  async getStates(id: string): Promise<IssueStateDto[]> {
    const project = await this.projectRepo.findOneOrFail(id);
    const states = await this.issueStateRepo.findAll({ where: { project } });
    return states;
  }

  async getMembers(id: string): Promise<ProjectMemberDto[]> {
    const project = await this.projectRepo.findOneOrFail(
      { id },
      { populate: ['members.user'] },
    );
    return project.members.map((pm) => wrap(pm).toObject());
  }
}
