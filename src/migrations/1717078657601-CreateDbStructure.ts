import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDbStructure1717078657601 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `);

    await queryRunner.query(`
      CREATE TABLE "ledgers" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ledgers" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "currency_enum" AS ENUM('USD', 'EUR', 'UAH')
    `);

    await queryRunner.query(`
      CREATE TYPE "transaction_type_enum" AS ENUM('debit', 'credit')
    `);

    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "ledger_id" UUID,
        "transaction_type" "transaction_type_enum" NOT NULL,
        "amount" NUMERIC NOT NULL,
        "currency" "currency_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_transactions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ledger_transactions" FOREIGN KEY ("ledger_id") REFERENCES "ledgers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "balances" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "ledger_id" UUID,
        "currency" "currency_enum" NOT NULL,
        "amount" NUMERIC NOT NULL DEFAULT 0,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_balances" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ledger_balances" FOREIGN KEY ("ledger_id") REFERENCES "ledgers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "UQ_ledger_currency" UNIQUE ("ledger_id", "currency")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "balances"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "currency_enum"`);
    await queryRunner.query(`DROP TYPE "transaction_type_enum"`);
    await queryRunner.query(`DROP TABLE "ledgers"`);
    await queryRunner.query(`DROP EXTENSION "uuid-ossp"`);
  }
}
