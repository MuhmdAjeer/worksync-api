import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  Filter,
  FilterQuery,
  FindOptions,
  Loaded,
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
import { IssueLabel } from './IssueLabels.entity';

@Entity({
  repository: () => IssueRepo,
})
export class Issue extends Base {
  [EntityRepositoryType]?: IssueRepo;

  @Property()
  title: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => Project, { inversedBy: 'issues', deleteRule: 'cascade ' })
  Project: Project;

  @ManyToOne(() => User)
  issued_by: User;

  @Enum(() => IssuePriority)
  priority?: IssuePriority;

  @ManyToOne(() => IssueState)
  state?: IssueState;

  @ManyToMany({ entity: () => IssueLabel })
  labels = new Collection<IssueLabel>(this);

  @Property()
  start_date?: Date;

  @Property()
  end_date?: Date;

  @ManyToMany({ entity: () => User })
  assignees = new Collection<User>(this);

  constructor(obj: Partial<Issue>) {
    super();
    Object.assign(this, obj);
  }
}

export class IssueRepo extends EntityRepository<Issue> {}
