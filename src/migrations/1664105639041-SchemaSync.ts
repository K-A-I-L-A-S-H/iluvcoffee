import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1664105639041 implements MigrationInterface {
    name = 'SchemaSync1664105639041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "payload" json NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dfa3d03bef3f90f650fd138fb3" ON "events" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_17113b2c650eceba221f12730b" ON "events" ("name", "type") `);
        await queryRunner.query(`ALTER TABLE "coffees" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "coffees" ADD "recommendations" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffees" DROP COLUMN "recommendations"`);
        await queryRunner.query(`ALTER TABLE "coffees" DROP COLUMN "description"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17113b2c650eceba221f12730b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dfa3d03bef3f90f650fd138fb3"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
