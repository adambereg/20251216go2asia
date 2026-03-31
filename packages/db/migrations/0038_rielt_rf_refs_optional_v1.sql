ALTER TABLE "rielt_listing"
  ADD COLUMN "rf_partner_id" varchar(80),
  ADD COLUMN "rf_offer_id" varchar(80);

ALTER TABLE "rielt_listing"
  ADD CONSTRAINT "rielt_listing_rf_partner_id_format_check"
  CHECK ("rf_partner_id" IS NULL OR (length(trim("rf_partner_id")) > 0 AND position(' ' in "rf_partner_id") = 0));

ALTER TABLE "rielt_listing"
  ADD CONSTRAINT "rielt_listing_rf_offer_id_format_check"
  CHECK ("rf_offer_id" IS NULL OR (length(trim("rf_offer_id")) > 0 AND position(' ' in "rf_offer_id") = 0));

ALTER TABLE "rielt_listing"
  ADD CONSTRAINT "rielt_listing_rf_offer_requires_partner_check"
  CHECK ("rf_offer_id" IS NULL OR "rf_partner_id" IS NOT NULL);
