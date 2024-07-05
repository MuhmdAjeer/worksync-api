import { Migration } from '@mikro-orm/migrations';

export class Migration20240705105709 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "workspace_member" add column "created_at" timestamptz not null default now(), add column "updated_at" timestamptz not null default now(), add column "deleted_at" timestamptz null, add column "version" int not null default 1;');
    this.addSql('alter table "workspace_member" alter column "id" type text using ("id"::text);');
    this.addSql('alter table "workspace_member" alter column "id" drop default;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "workspace_member" drop column "created_at", drop column "updated_at", drop column "deleted_at", drop column "version";');

    this.addSql('alter table "workspace_member" alter column "id" type int using ("id"::int);');
    this.addSql('create sequence if not exists "workspace_member_id_seq";');
    this.addSql('select setval(\'workspace_member_id_seq\', (select max("id") from "workspace_member"));');
    this.addSql('alter table "workspace_member" alter column "id" set default nextval(\'workspace_member_id_seq\');');
  }

}
