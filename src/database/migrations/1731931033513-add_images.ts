import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImages1731931033513 implements MigrationInterface {
    name = 'AddImages1731931033513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ADD "photos" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "photos"`);
    }

}
