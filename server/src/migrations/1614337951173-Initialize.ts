import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialize1614337951173 implements MigrationInterface {
  name = "Initialize1614337951173";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "upper" ("value" integer NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_5b345b30674a695459bc6e03084" PRIMARY KEY ("userId", "postId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" SERIAL NOT NULL, "points" integer NOT NULL DEFAULT '0', "title" character varying NOT NULL, "text" character varying NOT NULL, "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "upper" ADD CONSTRAINT "FK_4a75cd135e1f2f68b4af240d8ed" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "upper" ADD CONSTRAINT "FK_7c963995a28536042552f0857f3" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b"`
    );
    await queryRunner.query(
      `ALTER TABLE "upper" DROP CONSTRAINT "FK_7c963995a28536042552f0857f3"`
    );
    await queryRunner.query(
      `ALTER TABLE "upper" DROP CONSTRAINT "FK_4a75cd135e1f2f68b4af240d8ed"`
    );
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TABLE "upper"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
