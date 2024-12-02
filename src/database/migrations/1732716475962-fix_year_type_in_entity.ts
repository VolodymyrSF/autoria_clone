import { MigrationInterface, QueryRunner } from "typeorm";

export class FixYearTypeInEntity1732716475962 implements MigrationInterface {
    name = 'FixYearTypeInEntity1732716475962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "year" TYPE numeric(10,0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "year" TYPE numeric(10,2)`);
    }

}
