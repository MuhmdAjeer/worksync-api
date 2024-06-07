import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Base } from './base.entity';
import { Workspace } from './Workspace.entity';
import { User } from './User.entity';

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

  @ManyToOne(() => User)
  lead: User;

  @Property({ nullable: true, default: null })
  cover_image?: string;

  @Property({ nullable: true, default: null })
  logo?: string;

  // @ManyToMany(() => User, (user) => user.projects, {
  //   pivotEntity: () => ProjectMember,
  // })
  @ManyToMany({ entity: () => User })
  members = new Collection<User>(this);
  constructor(obj: Partial<Project>) {
    super();
    Object.assign(this, obj);
  }
}

export class ProjectRepo extends EntityRepository<Project> {}
