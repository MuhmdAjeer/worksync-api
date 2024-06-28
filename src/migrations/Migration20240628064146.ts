import { Migration } from '@mikro-orm/migrations';

export class Migration20240628064146 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "invitation" alter column "email" type text using ("email"::text);');
    this.addSql('alter table "invitation" alter column "workspace_id" type text using ("workspace_id"::text);');
    this.addSql('alter table "invitation" alter column "role" type text using ("role"::text);');

    this.addSql('alter table "otp" alter column "email" type text using ("email"::text);');
    this.addSql('alter table "otp" alter column "secret" type text using ("secret"::text);');

    this.addSql('alter table "users" alter column "id" type text using ("id"::text);');
    this.addSql('alter table "users" alter column "username" type text using ("username"::text);');
    this.addSql('alter table "users" alter column "email" type text using ("email"::text);');
    this.addSql('alter table "users" alter column "google_id" type text using ("google_id"::text);');
    this.addSql('alter table "users" alter column "password" type text using ("password"::text);');
    this.addSql('alter table "users" alter column "profile_picture" type text using ("profile_picture"::text);');

    this.addSql('alter table "file_upload" alter column "id" type text using ("id"::text);');
    this.addSql('alter table "file_upload" alter column "file_key" type text using ("file_key"::text);');
    this.addSql('alter table "file_upload" alter column "public_url" type text using ("public_url"::text);');
    this.addSql('alter table "file_upload" alter column "file_name" type text using ("file_name"::text);');
    this.addSql('alter table "file_upload" alter column "user_id" type text using ("user_id"::text);');
    this.addSql('alter table "file_upload" alter column "user_id" drop not null;');

    this.addSql('alter table "workspace" alter column "id" type text using ("id"::text);');
    this.addSql('alter table "workspace" alter column "name" type text using ("name"::text);');
    this.addSql('alter table "workspace" alter column "use" type text using ("use"::text);');
    this.addSql('alter table "workspace" alter column "owner_id" type text using ("owner_id"::text);');

    this.addSql('alter table "project" alter column "id" type text using ("id"::text);');
    this.addSql('alter table "project" alter column "name" type text using ("name"::text);');
    this.addSql('alter table "project" alter column "custom_id" type text using ("custom_id"::text);');
    this.addSql('alter table "project" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "project" alter column "workspace_id" type text using ("workspace_id"::text);');
    this.addSql('alter table "project" alter column "lead_id" type text using ("lead_id"::text);');
    this.addSql('alter table "project" alter column "cover_image" type text using ("cover_image"::text);');
    this.addSql('alter table "project" alter column "logo" type text using ("logo"::text);');

    this.addSql('alter table "project_members" alter column "project_id" type text using ("project_id"::text);');
    this.addSql('alter table "project_members" alter column "user_id" type text using ("user_id"::text);');

    this.addSql('alter table "issue_state" alter column "id" type text using ("id"::text);');
    this.addSql('alter table "issue_state" alter column "name" type text using ("name"::text);');
    this.addSql('alter table "issue_state" alter column "color" type text using ("color"::text);');
    this.addSql('alter table "issue_state" alter column "group" type text using ("group"::text);');
    this.addSql('alter table "issue_state" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "issue_state" alter column "project_id" type text using ("project_id"::text);');

    this.addSql('alter table "issue_label" alter column "id" type text using ("id"::text);');
    this.addSql('alter table "issue_label" alter column "name" type text using ("name"::text);');
    this.addSql('alter table "issue_label" alter column "color" type text using ("color"::text);');
    this.addSql('alter table "issue_label" alter column "project_id" type text using ("project_id"::text);');

    this.addSql('alter table "issue" alter column "id" type text using ("id"::text);');
    this.addSql('alter table "issue" alter column "title" type text using ("title"::text);');
    this.addSql('alter table "issue" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "issue" alter column "project_id" type text using ("project_id"::text);');
    this.addSql('alter table "issue" alter column "issued_by_id" type text using ("issued_by_id"::text);');

    this.addSql('alter table "issue_assignees" alter column "issue_id" type text using ("issue_id"::text);');
    this.addSql('alter table "issue_assignees" alter column "user_id" type text using ("user_id"::text);');

    this.addSql('alter table "workspace_member" alter column "user_id" type text using ("user_id"::text);');
    this.addSql('alter table "workspace_member" alter column "workspace_id" type text using ("workspace_id"::text);');
    this.addSql('alter table "workspace_member" alter column "role" type text using ("role"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "invitation" alter column "email" type varchar(255) using ("email"::varchar(255));');
    this.addSql('alter table "invitation" alter column "workspace_id" type varchar(255) using ("workspace_id"::varchar(255));');
    this.addSql('alter table "invitation" alter column "role" type varchar(255) using ("role"::varchar(255));');

    this.addSql('alter table "otp" alter column "email" type varchar(255) using ("email"::varchar(255));');
    this.addSql('alter table "otp" alter column "secret" type varchar(255) using ("secret"::varchar(255));');

    this.addSql('alter table "users" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "users" alter column "username" type varchar(255) using ("username"::varchar(255));');
    this.addSql('alter table "users" alter column "email" type varchar(255) using ("email"::varchar(255));');
    this.addSql('alter table "users" alter column "google_id" type varchar(255) using ("google_id"::varchar(255));');
    this.addSql('alter table "users" alter column "password" type varchar(255) using ("password"::varchar(255));');
    this.addSql('alter table "users" alter column "profile_picture" type varchar(255) using ("profile_picture"::varchar(255));');

    this.addSql('alter table "file_upload" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "file_upload" alter column "file_key" type varchar(255) using ("file_key"::varchar(255));');
    this.addSql('alter table "file_upload" alter column "public_url" type varchar(255) using ("public_url"::varchar(255));');
    this.addSql('alter table "file_upload" alter column "file_name" type varchar(255) using ("file_name"::varchar(255));');
    this.addSql('alter table "file_upload" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));');
    this.addSql('alter table "file_upload" alter column "user_id" set not null;');

    this.addSql('alter table "workspace" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "workspace" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "workspace" alter column "use" type varchar(255) using ("use"::varchar(255));');
    this.addSql('alter table "workspace" alter column "owner_id" type varchar(255) using ("owner_id"::varchar(255));');

    this.addSql('alter table "project" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "project" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "project" alter column "custom_id" type varchar(255) using ("custom_id"::varchar(255));');
    this.addSql('alter table "project" alter column "description" type varchar(255) using ("description"::varchar(255));');
    this.addSql('alter table "project" alter column "workspace_id" type varchar(255) using ("workspace_id"::varchar(255));');
    this.addSql('alter table "project" alter column "lead_id" type varchar(255) using ("lead_id"::varchar(255));');
    this.addSql('alter table "project" alter column "cover_image" type varchar(255) using ("cover_image"::varchar(255));');
    this.addSql('alter table "project" alter column "logo" type varchar(255) using ("logo"::varchar(255));');

    this.addSql('alter table "project_members" alter column "project_id" type varchar(255) using ("project_id"::varchar(255));');
    this.addSql('alter table "project_members" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));');

    this.addSql('alter table "issue_state" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "issue_state" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "issue_state" alter column "color" type varchar(255) using ("color"::varchar(255));');
    this.addSql('alter table "issue_state" alter column "group" type varchar(255) using ("group"::varchar(255));');
    this.addSql('alter table "issue_state" alter column "description" type varchar(255) using ("description"::varchar(255));');
    this.addSql('alter table "issue_state" alter column "project_id" type varchar(255) using ("project_id"::varchar(255));');

    this.addSql('alter table "issue_label" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "issue_label" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "issue_label" alter column "color" type varchar(255) using ("color"::varchar(255));');
    this.addSql('alter table "issue_label" alter column "project_id" type varchar(255) using ("project_id"::varchar(255));');

    this.addSql('alter table "issue" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "issue" alter column "title" type varchar(255) using ("title"::varchar(255));');
    this.addSql('alter table "issue" alter column "description" type varchar(255) using ("description"::varchar(255));');
    this.addSql('alter table "issue" alter column "project_id" type varchar(255) using ("project_id"::varchar(255));');
    this.addSql('alter table "issue" alter column "issued_by_id" type varchar(255) using ("issued_by_id"::varchar(255));');

    this.addSql('alter table "issue_assignees" alter column "issue_id" type varchar(255) using ("issue_id"::varchar(255));');
    this.addSql('alter table "issue_assignees" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));');

    this.addSql('alter table "workspace_member" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));');
    this.addSql('alter table "workspace_member" alter column "workspace_id" type varchar(255) using ("workspace_id"::varchar(255));');
    this.addSql('alter table "workspace_member" alter column "role" type varchar(255) using ("role"::varchar(255));');
  }

}
