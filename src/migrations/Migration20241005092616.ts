import { Migration } from '@mikro-orm/migrations';

export class Migration20241005092616 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project_member" drop constraint "project_member_project_id_foreign";');

    this.addSql('alter table "project_member" add constraint "project_member_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project_member" drop constraint "project_member_project_id_foreign";');

    this.addSql('alter table "project_member" add constraint "project_member_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
  }

}
