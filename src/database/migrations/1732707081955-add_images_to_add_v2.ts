import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImagesToAddV21732707081955 implements MigrationInterface {
    name = 'AddImagesToAddV21732707081955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" RENAME COLUMN "photos" TO "image"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "ads" ADD "image" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "ads" ADD "image" text array`);
        await queryRunner.query(`ALTER TABLE "ads" RENAME COLUMN "image" TO "photos"`);
    }

}
