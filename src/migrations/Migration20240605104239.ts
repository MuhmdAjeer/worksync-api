import { Migration } from '@mikro-orm/migrations';

export class Migration20240605104239 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "project_member" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "version" int not null default 1, "user_id" varchar(255) not null, "project_id" varchar(255) not null, "role" varchar(255) not null, constraint "project_member_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "project_members" ("project_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "project_members_pkey" primary key ("project_id", "user_id"));',
    );

    this.addSql(
      'alter table "project_member" add constraint "project_member_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "project_member" add constraint "project_member_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "project_members" add constraint "project_members_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "project_members" add constraint "project_members_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "project_member" cascade;');

    this.addSql('drop table if exists "project_members" cascade;');
  }
}
