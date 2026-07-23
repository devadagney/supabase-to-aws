# Synthetic regression fixtures

This fixture suite exists to prevent recurrence of bugs discovered while reconstructing Trackgle. Core tests must cover: scoped trigger identity; DROP TABLE destroying table-owned triggers; DROP TRIGGER scoping; DROP POLICY target-table parsing; policy names containing `on`; chronological CREATE/DROP policy resolution; table recreation; overloaded function identity; enum values; multi-column ALTER ADD COLUMN; FK ON DELETE actions; nested CHECK expressions; sequences/extensions; PK/NOT NULL/UNIQUE; Supabase-managed object dispositions.

Trackgle-specific names/counts are not generic expectations. Add minimal synthetic SQL fixtures for each parser/compiler behavior before porting its detector logic.
