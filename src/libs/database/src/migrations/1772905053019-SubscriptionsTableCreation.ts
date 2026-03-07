import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1772905053019 implements MigrationInterface {
  name = 'Migrations1772905053019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" uuid NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(500) NOT NULL, "price" integer NOT NULL, "max_tasks" integer NOT NULL, "rate_limited" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "subscription_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_b6bb02f6cd87c7ae80f1bbb9339" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b6bb02f6cd87c7ae80f1bbb9339"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "subscription_id"`,
    );
    await queryRunner.query(`DROP TABLE "subscriptions"`);
  }
}
