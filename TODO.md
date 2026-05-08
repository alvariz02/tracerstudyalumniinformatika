## Status: Fix dashboard vs database mismatch

- [x] Identify mismatch source: `jenis_kelamin` analytics used in dashboard but `tracer_study` migration lacked this column.
- [x] Update `supabase-migration.sql` to add `tracer_study.jenis_kelamin` with constraint.
- [x] Harden `app/api/dashboard/route.ts` analytics to safely compute gender distributions even when older rows/fields may be missing.
- [ ] (Next) Apply migration to Supabase and re-open dashboard to verify counts/charts match exports.
- [ ] (Next) Spot-check `/api/tracer/export` and `/api/angket/export` totals vs dashboard cards.

