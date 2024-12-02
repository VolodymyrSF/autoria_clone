import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTables1731774440942 implements MigrationInterface {
    name = 'AddTables1731774440942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."account_types_name_enum" NOT NULL, CONSTRAINT "PK_1944ce0e8e4a9f29fa1d4fbe4ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ad_views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "adId" uuid, CONSTRAINT "PK_41386d1f9367c983e4e0e0ca4b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_models" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "brandId" uuid NOT NULL, CONSTRAINT "PK_ee4355345e0e1c18cb6efa2bd5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_c91539d6c88493d73645682d6cd" UNIQUE ("name"), CONSTRAINT "PK_6a4e2f9b03d554f40b91f4f289a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(10,2) NOT NULL, "year" numeric(10,2) NOT NULL, "region" character varying NOT NULL, "currency" character varying NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "revisionCount" integer NOT NULL DEFAULT '0', "isApproved" boolean NOT NULL DEFAULT false, "isCensored" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, "user_id" uuid NOT NULL, "brand_id" uuid NOT NULL, "model_id" uuid NOT NULL, CONSTRAINT "PK_a7af7d1998037a97076f758fc23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."roles_name_enum" AS ENUM('admin', 'manager', 'seller', 'buyer')`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."roles_name_enum" NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" text NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "deviceId" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role_id" uuid, "account_type_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prices" ("id" SERIAL NOT NULL, "price" numeric(10,2) NOT NULL, "currency" character varying NOT NULL, "rate" numeric(10,2) NOT NULL, "priceInUAH" numeric(10,2) NOT NULL, "priceInUSD" numeric(10,2), "priceInEUR" numeric(10,2), "adsId" uuid, CONSTRAINT "PK_2e40b9e4e631a53cd514d82ccd2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currency_rates" ("id" SERIAL NOT NULL, "currency" character varying NOT NULL, "rate" numeric(10,2) NOT NULL, CONSTRAINT "PK_43636e55d92705f102d2a6e75a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles_permissions_permissions" ("rolesId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842" PRIMARY KEY ("rolesId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dc2b9d46195bb3ed28abbf7c9e" ON "roles_permissions_permissions" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd4d5d4c7f7ff16c57549b72c6" ON "roles_permissions_permissions" ("permissionsId") `);
        await queryRunner.query(`ALTER TABLE "ad_views" ADD CONSTRAINT "FK_c231f541e60560155b2ae955930" FOREIGN KEY ("adId") REFERENCES "ads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_models" ADD CONSTRAINT "FK_4fe74a5aa20adb9fbfe741f0acf" FOREIGN KEY ("brandId") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_843ca9647afecd4565861b0c9cb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_6fe96ba1c0f832fef82f8693399" FOREIGN KEY ("brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_e78c2a2fa81125e0e46b11637ed" FOREIGN KEY ("model_id") REFERENCES "car_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_78c8dfa4a9c1c48dbee1827691b" FOREIGN KEY ("account_type_id") REFERENCES "account_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prices" ADD CONSTRAINT "FK_89463a7d9f16bb80225ed44c394" FOREIGN KEY ("adsId") REFERENCES "ads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3"`);
        await queryRunner.query(`ALTER TABLE "prices" DROP CONSTRAINT "FK_89463a7d9f16bb80225ed44c394"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_78c8dfa4a9c1c48dbee1827691b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_e78c2a2fa81125e0e46b11637ed"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_6fe96ba1c0f832fef82f8693399"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_843ca9647afecd4565861b0c9cb"`);
        await queryRunner.query(`ALTER TABLE "car_models" DROP CONSTRAINT "FK_4fe74a5aa20adb9fbfe741f0acf"`);
        await queryRunner.query(`ALTER TABLE "ad_views" DROP CONSTRAINT "FK_c231f541e60560155b2ae955930"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd4d5d4c7f7ff16c57549b72c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc2b9d46195bb3ed28abbf7c9e"`);
        await queryRunner.query(`DROP TABLE "roles_permissions_permissions"`);
        await queryRunner.query(`DROP TABLE "currency_rates"`);
        await queryRunner.query(`DROP TABLE "prices"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TYPE "public"."roles_name_enum"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "ads"`);
        await queryRunner.query(`DROP TABLE "car_brands"`);
        await queryRunner.query(`DROP TABLE "car_models"`);
        await queryRunner.query(`DROP TABLE "ad_views"`);
        await queryRunner.query(`DROP TABLE "account_types"`);
    }

}
