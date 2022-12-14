import { MigrationInterface, QueryRunner } from "typeorm"

export class Coffeerefactor1664099869305 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"',
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"',
        )
    }

}
