import { ref, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { ConflictException, Injectable } from '@nestjs/common';
import { states } from 'src/constants/project';
import { IssueStateDto } from 'src/dtos/Issue.dto';
import {
  AddMemberDto,
  EUserProjectRoles,
  ProjectDto,
  createProjectDto,
} from 'src/dtos/project.dto';
import { MembersFilterQuery } from 'src/dtos/workspace.dto';
import { IssueState, IssueStateRepo } from 'src/entities/IssueState.entity';
import { Project, ProjectRepo } from 'src/entities/Project.entity';
import {
  ProjectMember,
  ProjectMemberRepo,
} from 'src/entities/ProjectMember.entity';
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
    private memberRepo: ProjectMemberRepo,
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

  async getMembers(
    id: string,
    filter: MembersFilterQuery,
  ): Promise<ProjectMember[]> {
    return await this.memberRepo.find(
      {
        project: { id },
        ...(filter.username && {
          user: { username: { $ilike: `%${filter.username}%` } },
        }),
      },
      { populate: ['user'] },
    );
  }

  async addMembers(projectId: string, addMemberDto: AddMemberDto) {
    const project = await this.projectRepo.findOneOrFail({ id: projectId });
    for (const member of addMemberDto.members) {
      const user = await this.userRepo.findOneOrFail({ id: member.userId });
      const pmExist = await this.memberRepo.findOne({ user, project });
      if (pmExist) {
        continue;
      }
      const pm = new ProjectMember({
        user,
        role: member.role,
        project: ref(project),
      });
      this.em.persistAndFlush(pm);
    }
  }
}
