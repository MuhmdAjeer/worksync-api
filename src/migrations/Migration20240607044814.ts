import { Migration } from '@mikro-orm/migrations';

export class Migration20240607044814 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "issue" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "version" int not null default 1, "title" varchar(255) not null, "description" varchar(255) not null, "project_id" varchar(255) not null, "issued_by_id" varchar(255) not null, "state" text check ("state" in (\'Backlog\', \'Todo\', \'In progress\', \'Done\', \'Cancelled\')) not null, "priority" smallint null, "start_date" timestamptz not null, "end_date" timestamptz not null, constraint "issue_pkey" primary key ("id"));');

    this.addSql('create table "issue_assignees" ("issue_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "issue_assignees_pkey" primary key ("issue_id", "user_id"));');

    this.addSql('alter table "issue" add constraint "issue_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
    this.addSql('alter table "issue" add constraint "issue_issued_by_id_foreign" foreign key ("issued_by_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "issue_assignees" add constraint "issue_assignees_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "issue_assignees" add constraint "issue_assignees_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "project_member" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "issue_assignees" drop constraint "issue_assignees_issue_id_foreign";');

    this.addSql('create table "project_member" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "version" int not null default 1, "user_id" varchar(255) not null, "project_id" varchar(255) not null, "role" varchar(255) not null, constraint "project_member_pkey" primary key ("id"));');

    this.addSql('alter table "project_member" add constraint "project_member_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "project_member" add constraint "project_member_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('drop table if exists "issue" cascade;');

    this.addSql('drop table if exists "issue_assignees" cascade;');
  }

}
