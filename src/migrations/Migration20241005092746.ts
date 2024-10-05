import { Migration } from '@mikro-orm/migrations';

export class Migration20241005092746 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "issue_state" drop constraint "issue_state_project_id_foreign";');

    this.addSql('alter table "issue_label" drop constraint "issue_label_project_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_project_id_foreign";');

    this.addSql('alter table "issue_state" add constraint "issue_state_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "issue_label" add constraint "issue_label_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "issue" add constraint "issue_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete cascade ;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "issue_state" drop constraint "issue_state_project_id_foreign";');

    this.addSql('alter table "issue_label" drop constraint "issue_label_project_id_foreign";');

    this.addSql('alter table "issue" drop constraint "issue_project_id_foreign";');

    this.addSql('alter table "issue_state" add constraint "issue_state_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "issue_label" add constraint "issue_label_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "issue" add constraint "issue_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
  }

}
