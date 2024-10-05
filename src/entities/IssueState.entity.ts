import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToMany,
  ManyToOne,
  Property,
  Ref,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Base } from './base.entity';
import { User } from './User.entity';
import { Project } from './Project.entity';
import {
  IssuePriority,
  IssueState as State,
  TStateGroups,
} from 'src/dtos/Issue.dto';

@Entity({ repository: () => IssueStateRepo })
export class IssueState extends Base {
  [EntityRepositoryType]?: IssueStateRepo;

  @Property()
  name: string;

  @Property({ nullable: true })
  color?: string;

  @Enum(() => TStateGroups)
  group: TStateGroups;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne({ deleteRule: 'cascade' })
  project: Ref<Project>;

  constructor(obj: Partial<IssueState>) {
    super();
    Object.assign(this, obj);
  }
}

export class IssueStateRepo extends EntityRepository<IssueState> {}
