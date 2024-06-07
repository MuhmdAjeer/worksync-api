import { Migration } from '@mikro-orm/migrations';

export class Migration20240527063337 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "invitation" ("id" serial primary key, "email" varchar(255) not null, "workspace_id" varchar(255) not null, "is_accepted" boolean not null default false, "role" varchar(255) not null);',
    );

    this.addSql(
      'create table "otp" ("id" serial primary key, "email" varchar(255) not null, "secret" varchar(255) not null);',
    );

    this.addSql(
      'create table "users" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "version" int not null default 1, "username" varchar(255) null, "email" varchar(255) not null, "google_id" varchar(255) null, "password" varchar(255) not null, "verified_at" timestamptz null, "profile_picture" varchar(255) null, constraint "users_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "users" add constraint "users_email_unique" unique ("email");',
    );
    this.addSql(
      'alter table "users" add constraint "users_google_id_unique" unique ("google_id");',
    );

    this.addSql(
      'create table "file_upload" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "version" int not null default 1, "file_key" varchar(255) not null, "public_url" varchar(255) not null, "file_name" varchar(255) not null, "type" text check ("type" in (\'user_image\')) not null, "user_id" varchar(255) not null, constraint "file_upload_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "workspace" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "version" int not null default 1, "name" varchar(255) not null, "use" varchar(255) not null, "owner_id" varchar(255) not null, constraint "workspace_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "project" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "version" int not null default 1, "name" varchar(255) not null, "custom_id" varchar(255) not null, "description" varchar(255) not null, "workspace_id" varchar(255) not null, constraint "project_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "workspace_member" ("id" serial primary key, "workspace_id" int not null, "user_id" int not null, "role" varchar(255) not null);',
    );

    this.addSql(
      'alter table "file_upload" add constraint "file_upload_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "project" add constraint "project_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "file_upload" drop constraint "file_upload_user_id_foreign";',
    );

    this.addSql(
      'alter table "project" drop constraint "project_workspace_id_foreign";',
    );

    this.addSql('drop table if exists "invitation" cascade;');

    this.addSql('drop table if exists "otp" cascade;');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "file_upload" cascade;');

    this.addSql('drop table if exists "workspace" cascade;');

    this.addSql('drop table if exists "project" cascade;');

    this.addSql('drop table if exists "workspace_member" cascade;');
  }
}
