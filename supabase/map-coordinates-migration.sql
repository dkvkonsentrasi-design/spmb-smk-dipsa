-- Setelah address-location-migration.sql. Tidak menghapus lokasi/data lama.
begin;
alter table public.application_locations add column if not exists latitude double precision;
alter table public.application_locations add column if not exists longitude double precision;
do $$ begin
 if not exists(select 1 from pg_constraint where conname='spmb_location_coordinates' and conrelid='public.application_locations'::regclass) then
  alter table public.application_locations add constraint spmb_location_coordinates check(
   (latitude is null and longitude is null) or
   (latitude is not null and longitude is not null and latitude between -90 and 90 and longitude between -180 and 180)
  );
 end if;
end $$;
-- URL selalu dibentuk server dari koordinat, tidak mengandalkan input browser.
create or replace function public.spmb_location_timestamp() returns trigger language plpgsql set search_path='' as $$
begin
 new.updated_at:=now();new.updated_by:=auth.uid();
 if new.latitude is not null and new.longitude is not null then
  new.maps_url:='https://www.google.com/maps?q='||new.latitude::text||','||new.longitude::text;
 end if;
 return new;
end;$$;
revoke all on function public.spmb_location_timestamp() from public,anon,authenticated;
commit;
