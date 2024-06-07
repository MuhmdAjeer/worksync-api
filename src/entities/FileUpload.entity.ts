import {
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Base } from './base.entity';
import { User } from './User.entity';
import { FileUploadType } from 'src/dtos/upload.dto';

@Entity({ repository: () => FileUploadRepository })
export class FileUpload extends Base {
  [EntityRepositoryType]?: FileUploadRepository;

  @Property()
  file_key: string;

  @Property()
  public_url: string;

  @Property()
  file_name: string;

  @Enum(() => FileUploadType)
  type: FileUploadType;

  @ManyToOne({ deleteRule: 'set null' })
  user?: User;

  constructor(obj: Partial<FileUpload>) {
    super();
    Object.assign(this, obj);
  }
}

export class FileUploadRepository extends EntityRepository<FileUpload> {}
