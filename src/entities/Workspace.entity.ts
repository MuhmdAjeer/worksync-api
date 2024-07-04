import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Project } from './Project.entity';
import { Base } from './base.entity';
import { WorkspaceMember } from './WorkspaceMember.entity';

@Entity({ repository: () => WorkspaceRepo })
export class Workspace extends Base {
  [EntityRepositoryType]?: WorkspaceRepo;

  @Property({ unique: true })
  name: string;

  @Property()
  use: string;

  @OneToMany(() => Project, (p) => p.workspace)
  projects = new Collection<Project>(this);

  @OneToMany(
    () => WorkspaceMember,
    (workspaceMember) => workspaceMember.workspace,
  )
  members = new Collection<WorkspaceMember>(this);

  @Property()
  owner_id: string;
  constructor(workspace: { name: string; use: string; owner_id: string }) {
    super();
    this.name = workspace.name;
    this.use = workspace.use;
    this.owner_id = workspace.owner_id;
  }
}

export class WorkspaceRepo extends EntityRepository<Workspace> {}
