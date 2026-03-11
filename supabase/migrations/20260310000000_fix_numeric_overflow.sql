-- Migration to fix numeric field overflow for reviews table
-- Change overall_rating from NUMERIC(2,1) to NUMERIC(3,1) or just use real/float to be safer
-- NUMERIC(2,1) allows max 9.9. While rating is normally 0-5, if some value is slightly over or formatted differently, it can crash.
-- Also, some other columns like price are currently TEXT, but if they were numeric they'd need similar checks.

ALTER TABLE public.reviews ALTER COLUMN overall_rating TYPE NUMERIC(3,1);
