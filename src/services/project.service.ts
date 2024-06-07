import { Injectable, Logger } from '@nestjs/common';
import { createProjectDto } from 'src/dtos/project.dto';
import { Project, ProjectRepo } from 'src/entities/Project.entity';
import { UserRepo } from 'src/entities/User.entity';
import { WorkspaceRepo } from 'src/entities/Workspace.entity';

@Injectable()
export class ProjectService {
  constructor(
    private workspaceRepo: WorkspaceRepo,
    private userRepo: UserRepo,
    private projectRepo: ProjectRepo,
  ) {}
  private readonly logger = new Logger(ProjectService.name);

  async create(projectDto: createProjectDto) {
    const workspace = await this.workspaceRepo.findOneOrFail({
      id: projectDto.workspace_id,
    });
    const lead = await this.userRepo.findOneOrFail({ id: projectDto.lead_id });
    this.logger.log(projectDto);
    const project = new Project(projectDto);
    project.workspace = workspace;
    project.lead = lead;
    project.members.add(lead);
    await this.projectRepo.getEntityManager().persistAndFlush(project);
    return project;
  }

  async findProjectsByWorkspace(workspaceId: string): Promise<Project[]> {
    const workspace = await this.workspaceRepo.findOneOrFail({
      id: workspaceId,
    });

    const projects = await this.projectRepo.find(
      { workspace },
      { populate: ['workspace', 'members'] },
    );
    return projects;
  }
}
