import {
  Cascade,
  Collection,
  Entity,
  EntityRepository,
  EntityRepositoryType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Base } from './base.entity';
import { Workspace } from './Workspace.entity';
import { User } from './User.entity';
import { Issue } from './Issue.entity';
import { IssueLabel } from './IssueLabels.entity';
import { IssueState } from './IssueState.entity';
import { ApiProperty } from '@nestjs/swagger';
import { createProjectDto } from 'src/dtos/project.dto';
import { ProjectMember } from './ProjectMember.entity';

@Entity({ repository: () => ProjectRepo })
export class Project extends Base {
  [EntityRepositoryType]?: ProjectRepo;

  @Property()
  name: string;

  @Property()
  custom_id: string;

  @Property()
  description: string;

  @ManyToOne(() => Workspace, { inversedBy: 'projects' })
  workspace: Workspace;

  @OneToMany(() => Issue, (i) => i.Project)
  issues = new Collection<Issue>(this);

  @OneToMany(() => IssueState, (i) => i.project)
  states = new Collection<IssueState>(this);

  @OneToMany(() => IssueLabel, (i) => i.Project)
  labels = new Collection<IssueLabel>(this);

  @ManyToOne(() => User)
  lead: User;

  @OneToMany(() => ProjectMember, (pm) => pm.project, {})
  members = new Collection<ProjectMember>(this);

  @Property({ nullable: true, default: null })
  cover_image?: string;

  @Property({ nullable: true, default: null })
  logo?: string;

  constructor(obj: Partial<Project>) {
    super();
    Object.assign(this, obj);
  }
}

export class ProjectRepo extends EntityRepository<Project> {}
