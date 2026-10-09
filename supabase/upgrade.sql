-- Jalankan setelah schema.sql. Aman dijalankan ulang; tidak menghapus data.
begin;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('spmb-documents','spmb-documents',false,5242880,array['application/pdf','image/jpeg','image/png'])
on conflict(id) do update set public=false,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;
create or replace function public.spmb_can_upload(object_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null
 and object_name ~ ('^' || auth.uid()::text || '/(kk|akta|ijazah|foto)\.(pdf|jpg|png)$')
 and exists(select 1 from public.applications where user_id=auth.uid() and status='draft');
$$;
revoke all on function public.spmb_can_upload(text) from public,anon;
grant execute on function public.spmb_can_upload(text) to authenticated;
drop policy if exists spmb_document_read on storage.objects;
create policy spmb_document_read on storage.objects for select to authenticated
using(bucket_id='spmb-documents' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_committee()));
drop policy if exists spmb_document_insert on storage.objects;
create policy spmb_document_insert on storage.objects for insert to authenticated
with check(bucket_id='spmb-documents' and public.spmb_can_upload(name));
drop policy if exists spmb_document_update on storage.objects;
create policy spmb_document_update on storage.objects for update to authenticated
using(bucket_id='spmb-documents' and public.spmb_can_upload(name))
with check(bucket_id='spmb-documents' and public.spmb_can_upload(name));
drop policy if exists spmb_document_delete on storage.objects;
create policy spmb_document_delete on storage.objects for delete to authenticated
using(bucket_id='spmb-documents' and public.spmb_can_upload(name));
commit;
