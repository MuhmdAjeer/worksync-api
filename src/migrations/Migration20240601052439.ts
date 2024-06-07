import { Migration } from '@mikro-orm/migrations';

export class Migration20240601052439 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" add column "lead_id" varchar(255) not null;');
    this.addSql('alter table "project" add constraint "project_lead_id_foreign" foreign key ("lead_id") references "users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "project" drop constraint "project_lead_id_foreign";');

    this.addSql('alter table "project" drop column "lead_id";');
  }

}
