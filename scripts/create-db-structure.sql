-- Ensure the UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the ledgers table
CREATE TABLE "ledgers" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_ledgers" PRIMARY KEY ("id")
);

-- Create the currency_enum type
CREATE TYPE "currency_enum" AS ENUM('USD', 'EUR', 'UAH');

-- Create the transaction_type_enum type
CREATE TYPE "transaction_type_enum" AS ENUM('debit', 'credit');

-- Create the transactions table
CREATE TABLE "transactions" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "ledger_id" UUID,
  "transaction_type" "transaction_type_enum" NOT NULL,
  "amount" NUMERIC NOT NULL,
  "currency" "currency_enum" NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_transactions" PRIMARY KEY ("id"),
  CONSTRAINT "FK_ledger_transactions" FOREIGN KEY ("ledger_id") REFERENCES "ledgers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create the balances table
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
);
