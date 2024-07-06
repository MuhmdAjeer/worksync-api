import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Ref,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './User.entity';
import { Workspace } from './Workspace.entity';
import { Base } from './base.entity';
import { Project } from './Project.entity';
import { EUserProjectRoles } from 'src/dtos/project.dto';

@Entity({ repository: () => ProjectMemberRepo })
export class ProjectMember extends Base {
  [EntityRepositoryType]?: ProjectMemberRepo;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne()
  project: Ref<Project>;

  @Property()
  role: EUserProjectRoles;

  constructor(member: Partial<ProjectMember>) {
    super();
    Object.assign(this, member);
  }
}

export class ProjectMemberRepo extends EntityRepository<ProjectMember> {}
