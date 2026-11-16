ALTER TABLE "orders" ADD COLUMN "pickup_location" varchar(20) DEFAULT 'ALAGBADO' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "alagbado_price" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "ogba_price" numeric(12, 2);--> statement-breakpoint
UPDATE "products" SET "alagbado_price" = "price", "ogba_price" = "price";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "alagbado_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "ogba_price" SET NOT NULL;
