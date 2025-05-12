import { MigrationInterface, QueryRunner } from 'typeorm';

export class GptTable1744718807916 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "gpt" (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        name varchar(100) NOT NULL,
        image integer NOT NULL,
        description text NOT NULL,
        goal varchar(255) NOT NULL,
        temperature float NOT NULL,
        is_public boolean NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        CONSTRAINT gpt_pk_id PRIMARY KEY (id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "gpt";
    `);
  }
}
