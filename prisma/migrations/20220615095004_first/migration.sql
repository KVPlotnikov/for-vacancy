-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255),
    "password" TEXT NOT NULL,
    "notification_token" TEXT,
    "subscribtion_expires_at" TIMESTAMP(6) NOT NULL,
    "tg_chat_id" VARCHAR(255),
    "tg_user_id" VARCHAR(255),
    "tg_username" VARCHAR(255),
    "plan" VARCHAR(255),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts_securities" (
    "account_id" UUID NOT NULL,
    "sec_id" VARCHAR NOT NULL,
    "goal_1" DECIMAL,
    "goal_2" DECIMAL,
    "price_threshold_to_notify" DECIMAL DEFAULT 0.5,
    "last_notified_at" TIMESTAMP(6),
    "notify_at" TIMESTAMP(6),
    "notification_topic" TEXT
);

-- CreateTable
CREATE TABLE "alerts" (
    "secid" VARCHAR(255) NOT NULL,
    "high_20_threshold_at" TIMESTAMP(6),
    "high_20_break_at" TIMESTAMP(6),
    "high_60_threshold_at" TIMESTAMP(6),
    "high_60_break_at" TIMESTAMP(6),
    "low_20_threshold_at" TIMESTAMP(6),
    "low_20_break_at" TIMESTAMP(6),
    "low_60_threshold_at" TIMESTAMP(6),
    "low_60_break_at" TIMESTAMP(6)
);

-- CreateTable
CREATE TABLE "instruments" (
    "ticker" VARCHAR(100) NOT NULL,
    "name" TEXT,
    "sector" TEXT,
    "source" VARCHAR(100),
    "currency" VARCHAR(100),

    CONSTRAINT "instruments_pkey" PRIMARY KEY ("ticker")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "desc" VARCHAR(1000),
    "price" DECIMAL(10,2) NOT NULL,
    "days" INTEGER NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schema_migrations" (
    "id" BIGINT NOT NULL,
    "applied" TIMESTAMP(6),
    "description" VARCHAR(1024)
);

-- CreateTable
CREATE TABLE "securities" (
    "secid" VARCHAR(100) NOT NULL,
    "short_name" TEXT,
    "description" TEXT,
    "current_low" DECIMAL,
    "current_high" DECIMAL,
    "current_last" DECIMAL,
    "current_last_trade_date" TEXT,
    "current_updated_at" TIMESTAMP(6),
    "min_low_20" DECIMAL,
    "min_low_20_date" TEXT,
    "diff_low_20" DECIMAL,
    "min_low_20_updated_at" TIMESTAMP(6),
    "max_high_20" DECIMAL,
    "max_high_20_date" TEXT,
    "diff_high_20" DECIMAL,
    "max_high_20_updated_at" TIMESTAMP(6),
    "min_low_60" DECIMAL,
    "min_low_60_date" TEXT,
    "diff_low_60" DECIMAL,
    "min_low_60_updated_at" TIMESTAMP(6),
    "max_high_60" DECIMAL,
    "max_high_60_date" TEXT,
    "diff_high_60" DECIMAL,
    "max_high_60_updated_at" TIMESTAMP(6),
    "kind" VARCHAR(255),

    CONSTRAINT "securities_pkey" PRIMARY KEY ("secid")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" BIGSERIAL NOT NULL,
    "account_id" UUID,
    "plan_id" VARCHAR(255),
    "external_id" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "inserted_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "alerts_secid_key" ON "alerts"("secid");

-- CreateIndex
CREATE UNIQUE INDEX "plans_id_index" ON "plans"("id");

-- CreateIndex
CREATE UNIQUE INDEX "schema_migrations_id_key" ON "schema_migrations"("id");

-- CreateIndex
CREATE INDEX "transactions_account_id_index" ON "transactions"("account_id");

-- CreateIndex
CREATE INDEX "transactions_status_index" ON "transactions"("status");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
