import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Base } from './base.entity';
import { User } from './User.entity';
import { Project } from './Project.entity';
import { IssuePriority } from 'src/dtos/Issue.dto';
import { IssueState } from './IssueState.entity';

@Entity({ repository: () => IssueRepo })
export class Issue extends Base {
  [EntityRepositoryType]?: IssueRepo;

  @Property()
  title: string;

  @Property()
  description: string;

  @ManyToOne(() => Project, { inversedBy: 'issues' })
  Project: Project;

  @ManyToOne(() => User)
  issued_by: User;

  @Enum({ nullable: true, default: null, type: () => IssuePriority })
  priority?: IssuePriority;

  @Property()
  start_date: Date;

  @Property()
  end_date: Date;

  @ManyToMany({ entity: () => User })
  assignees = new Collection<User>(this);

  constructor(obj: Partial<Issue>) {
    super();
    Object.assign(this, obj);
  }
}

export class IssueRepo extends EntityRepository<Issue> {}
