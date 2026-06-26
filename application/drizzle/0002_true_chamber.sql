DROP INDEX "file_user_parent_name_idx";--> statement-breakpoint
DROP INDEX "file_user_root_name_idx";--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;--> statement-breakpoint
CREATE UNIQUE INDEX "file_user_parent_name_idx" ON "file" USING btree ("user_id","parent_id","name") WHERE "file"."parent_id" IS NOT NULL AND "file"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "file_user_root_name_idx" ON "file" USING btree ("user_id","name") WHERE "file"."parent_id" IS NULL AND "file"."deleted_at" IS NULL;