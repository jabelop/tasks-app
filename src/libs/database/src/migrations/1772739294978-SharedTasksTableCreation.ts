import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1772739294978 implements MigrationInterface {
    name = 'Migrations1772739294978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shared-tasks" ("task_id" uuid NOT NULL, "owner_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d35cfb3e20567b4fb30fe454a7d" PRIMARY KEY ("task_id", "owner_id", "user_id"))`);
        await queryRunner.query(`ALTER TABLE "shared-tasks" ADD CONSTRAINT "FK_012754a63b1d9bc511b3571676d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shared-tasks" ADD CONSTRAINT "FK_fe9dd864028fef18d651d9bcbbf" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shared-tasks" DROP CONSTRAINT "FK_fe9dd864028fef18d651d9bcbbf"`);
        await queryRunner.query(`ALTER TABLE "shared-tasks" DROP CONSTRAINT "FK_012754a63b1d9bc511b3571676d"`);
        await queryRunner.query(`DROP TABLE "shared-tasks"`);
    }

}
