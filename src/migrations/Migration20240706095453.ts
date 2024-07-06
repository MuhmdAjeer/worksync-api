import { Migration } from '@mikro-orm/migrations';

export class Migration20240706095453 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "otp" ("id" serial primary key, "email" text not null, "secret" text not null);');

    this.addSql('create table "users" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "username" text null, "email" text not null, "google_id" text null, "password" text not null, "verified_at" timestamptz null, "profile_picture" text null, "onboarding" jsonb null, constraint "users_pkey" primary key ("id"));');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
    this.addSql('alter table "users" add constraint "users_google_id_unique" unique ("google_id");');

    this.addSql('create table "file_upload" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "file_key" text not null, "public_url" text not null, "file_name" text not null, "type" text check ("type" in (\'user_image\')) not null, "user_id" text null, constraint "file_upload_pkey" primary key ("id"));');

    this.addSql('create table "workspace" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "name" text not null, "use" text not null, "owner_id" text not null, constraint "workspace_pkey" primary key ("id"));');
    this.addSql('alter table "workspace" add constraint "workspace_name_unique" unique ("name");');

    this.addSql('create table "project" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "name" text not null, "custom_id" text not null, "description" text not null, "workspace_id" text not null, "lead_id" text not null, "cover_image" text null, "logo" text null, constraint "project_pkey" primary key ("id"));');

    this.addSql('create table "project_member" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "user_id" text not null, "project_id" text not null, "role" text check ("role" in (\'ADMIN\', \'MEMBER\', \'GUEST\')) not null, constraint "project_member_pkey" primary key ("id"));');

    this.addSql('create table "issue_state" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "name" text not null, "color" text null, "group" text not null, "description" text null, "project_id" text not null, constraint "issue_state_pkey" primary key ("id"));');

    this.addSql('create table "issue_label" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "name" text not null, "color" text not null, "project_id" text not null, constraint "issue_label_pkey" primary key ("id"));');

    this.addSql('create table "issue" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "title" text not null, "description" text not null, "project_id" text not null, "issued_by_id" text not null, "priority" smallint null, "start_date" timestamptz not null, "end_date" timestamptz not null, constraint "issue_pkey" primary key ("id"));');

    this.addSql('create table "issue_assignees" ("issue_id" text not null, "user_id" text not null, constraint "issue_assignees_pkey" primary key ("issue_id", "user_id"));');

    this.addSql('create table "invitation" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "email" text not null, "workspace_id" text not null, "is_accepted" boolean not null default false, "role" text check ("role" in (\'ADMIN\', \'MEMBER\', \'GUEST\')) not null, constraint "invitation_pkey" primary key ("id"));');

    this.addSql('create table "workspace_member" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "version" int not null default 1, "user_id" text not null, "workspace_id" text not null, "role" text check ("role" in (\'ADMIN\', \'MEMBER\', \'GUEST\')) not null, constraint "workspace_member_pkey" primary key ("id"));');

    this.addSql('alter table "file_upload" add constraint "file_upload_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;');

    this.addSql('alter table "project" add constraint "project_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;');
    this.addSql('alter table "project" add constraint "project_lead_id_foreign" foreign key ("lead_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "project_member" add constraint "project_member_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "project_member" add constraint "project_member_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "issue_state" add constraint "issue_state_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "issue_label" add constraint "issue_label_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "issue" add constraint "issue_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
    this.addSql('alter table "issue" add constraint "issue_issued_by_id_foreign" foreign key ("issued_by_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "issue_assignees" add constraint "issue_assignees_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "issue_assignees" add constraint "issue_assignees_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "invitation" add constraint "invitation_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;');

    this.addSql('alter table "workspace_member" add constraint "workspace_member_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "workspace_member" add constraint "workspace_member_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "file_upload" drop constraint "file_upload_user_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_lead_id_foreign";');

    this.addSql('alter table "project_member" drop constraint "project_member_user_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_issued_by_id_foreign";');

    this.addSql('alter table "issue_assignees" drop constraint "issue_assignees_user_id_foreign";');

    this.addSql('alter table "workspace_member" drop constraint "workspace_member_user_id_foreign";');

    this.addSql('alter table "project" drop constraint "project_workspace_id_foreign";');

    this.addSql('alter table "invitation" drop constraint "invitation_workspace_id_foreign";');

    this.addSql('alter table "workspace_member" drop constraint "workspace_member_workspace_id_foreign";');

    this.addSql('alter table "project_member" drop constraint "project_member_project_id_foreign";');

    this.addSql('alter table "issue_state" drop constraint "issue_state_project_id_foreign";');

    this.addSql('alter table "issue_label" drop constraint "issue_label_project_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_project_id_foreign";');

    this.addSql('alter table "issue_assignees" drop constraint "issue_assignees_issue_id_foreign";');

    this.addSql('drop table if exists "otp" cascade;');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "file_upload" cascade;');

    this.addSql('drop table if exists "workspace" cascade;');

    this.addSql('drop table if exists "project" cascade;');

    this.addSql('drop table if exists "project_member" cascade;');

    this.addSql('drop table if exists "issue_state" cascade;');

    this.addSql('drop table if exists "issue_label" cascade;');

    this.addSql('drop table if exists "issue" cascade;');

    this.addSql('drop table if exists "issue_assignees" cascade;');

    this.addSql('drop table if exists "invitation" cascade;');

    this.addSql('drop table if exists "workspace_member" cascade;');
  }

}
