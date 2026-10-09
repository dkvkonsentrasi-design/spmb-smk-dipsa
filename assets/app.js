const cfg=window.SPMB_CONFIG, app=document.querySelector('#app'), modal=document.querySelector('#auth');
const db=cfg.supabaseUrl&&cfg.supabaseAnonKey&&window.supabase?supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
const majors=['Teknik Sepeda Motor','Desain Komunikasi Visual','Manajemen Perkantoran'];
const states={draft:'Draf',submitted:'Menunggu verifikasi',verified:'Terverifikasi',accepted:'Diterima',rejected:'Tidak diterima'};
let locationMap=null,locationDraft=null,locationRequest=0;
let user=null,committee=false,records=[],profile=null,recovery=false;
const documentTypes=[['kk','Kartu keluarga'],['akta','Akta kelahiran'],['ijazah','Ijazah / surat keterangan lulus'],['foto','Pasfoto']];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notice(s){const n=document.querySelector('#notice');n.textContent=s;n.style.display='block';const inline=document.querySelector('#form-feedback');if(inline)inline.textContent=s;clearTimeout(window.nt);window.nt=setTimeout(()=>n.style.display='none',7000)}
function check(r){if(r.error)throw r.error;return r.data}
function configured(){if(!db){notice('Portal belum terhubung. Isi URL dan publishable/anon key Supabase di assets/config.js.');return false}return true}
function home(){document.body.classList.remove("portal-view");app.innerHTML=`
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="eyebrow">PORTAL SPMB • TAHUN AJARAN ${esc(cfg.schoolYear)}</p>
        <h1>Membentuk Generasi<br><em>Siap Berkarya.</em></h1>
        <p class="hero-text">
          Pendidikan kejuruan yang menggabungkan karakter, kompetensi,
          teknologi, dan pengalaman nyata untuk menyiapkan siswa menghadapi masa depan.
        </p>
        <div class="hero-actions">
          <button class="button button-light" data-action="register">Buat Akun ↗</button>
          <button class="text-link hero-login" data-action="login">Sudah punya akun? Masuk <span>→</span></button>
        </div>
      </div>
      <div class="hero-scroll">SCROLL <span>↓</span></div>
    </section>

    <section class="intro section" id="tentang">
      <div class="section-label">01 — TENTANG SEKOLAH</div>
      <div class="intro-grid">
        <div>
          <h2>Pendidikan yang dekat dengan <em>dunia nyata.</em></h2>
        </div>
        <div class="intro-copy">
          <p>
            SMK DIPSA Purwokerto hadir untuk membantu peserta didik berkembang
            menjadi pribadi yang berkarakter, terampil, kreatif, dan siap melanjutkan
            pendidikan maupun memasuki dunia kerja.
          </p>
          <a class="arrow-link" href="#program">Kenali program kami <span>↗</span></a>
        </div>
      </div>
    </section>

    <section class="programs section" id="program">
      <div class="section-heading">
        <div>
          <div class="section-label">02 — PROGRAM KEAHLIAN</div>
          <h2>Belajar. Praktik.<br><em>Berkarya.</em></h2>
        </div>
        <p>
  Pilihan program keahlian yang dirancang untuk membekali siswa dengan
  keterampilan praktis dan kompetensi sesuai kebutuhan dunia kerja.
</p>
      </div>

<div class="program-grid">
  <article class="program-card">
    <span class="card-number">01</span>
    <h3>Teknik Sepeda Motor</h3>
    <p>
      Mempelajari perawatan, perbaikan, pemeriksaan, dan teknologi sepeda motor
      untuk membekali siswa dengan keterampilan otomotif yang siap diterapkan di dunia kerja.
    </p>
    <button class="program-apply" data-action="register">Pilih program ini →</button>
  </article>

  <article class="program-card">
    <span class="card-number">02</span>
    <h3>Desain Komunikasi Visual</h3>
    <p>
      Mengembangkan kreativitas dalam desain grafis, ilustrasi, fotografi,
      branding, dan media visual untuk menghasilkan karya yang komunikatif dan menarik.
    </p>

    <button class="program-apply" data-action="register">Pilih program ini →</button>
  </article>

  <article class="program-card">
    <span class="card-number">03</span>
    <h3>Manajemen Perkantoran</h3>
    <p>
      Membekali siswa dengan keterampilan administrasi, pengelolaan dokumen,
      pelayanan, komunikasi, teknologi perkantoran, dan pengelolaan kegiatan kantor.
    </p>

    <button class="program-apply" data-action="register">Pilih program ini →</button>
  </article>
</div>

    </section>

    <section class="feature">
      <div class="feature-image"></div>
      <div class="feature-content">
        <div class="section-label">03 — KEHIDUPAN SEKOLAH</div>
        <h2>Ruang untuk belajar, bertumbuh, dan <em>berprestasi.</em></h2>
        <p>Karya Terbaik Program UPSKILLING dan RESKILLING BBPPMPV 2026.
        </p>
        <a class="button button-dark" href="#berita">Lihat kegiatan</a>
      </div>
    </section>

    <section class="news section" id="berita">
      <div class="section-heading">
        <div>
          <div class="section-label">04 — BERITA & KEGIATAN</div>
          <h2>Kabar terbaru<br><em>dari sekolah.</em></h2>
        </div>
        <a class="arrow-link" href="#berita">Semua berita <span>↗</span></a>
      </div>

      <div class="news-grid">
        <article class="news-card">
          <div class="news-image news-image-1"></div>
          <div class="news-body">
            <span>SEKOLAH • 2026</span>
            <h3>Selamat Datang di Website SMK DIPSA</h3>
            <p>Ruang informasi sekolah yang lebih modern, sederhana, dan mudah diakses.</p>
          </div>
        </article>
        <article class="news-card">
          <div class="news-image news-image-2"></div>
          <div class="news-body">
            <span>KEGIATAN • 2026</span>
            <h3>Kegiatan Siswa & Pengembangan Kompetensi</h3>
            <p>Dokumentasi kegiatan pembelajaran, proyek, organisasi, dan prestasi siswa.</p>
          </div>
        </article>
        <article class="news-card">
          <div class="news-image news-image-3"></div>
          <div class="news-body">
            <span>INFORMASI • 2026</span>
            <h3>Informasi Sistem Penerimaan Murid Baru</h3>
            <p>Saatnya memilih sekolah yang membawamu lebih dekat dengan cita-cita.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="section steps" id="alur"><div class="section-label">05 — ALUR PENDAFTARAN</div><div class="section-heading"><h2>Langkah kecil.<br><em>Masa depan besar.</em></h2><p>Daftar dari mana saja. Kelola data dan pantau hasil seleksi dalam satu portal.</p></div><div class="steps-grid"><article><span>01</span><h3>Buat akun siswa</h3><p>Isi identitas, data sekolah, dan informasi orang tua, lalu langsung masuk ke dashboard.</p></article><article><span>02</span><h3>Pilih & ajukan</h3><p>Pilih jurusan, periksa seluruh data, dan kirim pendaftaran untuk diverifikasi panitia.</p></article><article><span>03</span><h3>Pantau hasil seleksi</h3><p>Lihat status dan catatan panitia melalui dashboard siswa setelah masuk ke portal.</p></article></div></section><section class="admission" id="spmb">
      <div class="admission-inner">
        <div>
          <div class="section-label">06 — SPMB</div>
          <h2>Siap memulai<br><em>masa depanmu?</em></h2>
        </div>
        <div>
          <p>Temukan potensi, asah keterampilan, dan bersiaplah menjadi generasi yang siap menghadapi dunia.</p>
          <div class="actions"><button class="button button-light" data-action="register">Buat Akun ↗</button><button class="button admission-login" data-action="login">Masuk portal</button></div>
        </div>
      </div>
    </section>
  `;closeMenu()}
const addressFields=[["address_street", "Jalan / dusun / nomor rumah", "text", null], ["address_rt", "RT", "text", "[0-9]{1,3}"], ["address_rw", "RW", "text", "[0-9]{1,3}"], ["address_village", "Desa / kelurahan", "text", null], ["address_district", "Kecamatan", "text", null], ["address_city", "Kabupaten / kota", "text", null], ["address_province", "Provinsi", "text", null], ["address_country", "Negara", "text", null]];
const studentColumns=["user_id", "registration_number", "email", "full_name", "nisn", "nik", "birth_place", "birth_date", "gender", "religion", "phone", "address", "address_street", "address_rt", "address_rw", "address_village", "address_district", "address_city", "address_province", "address_postal_code", "address_country", "school_origin", "graduation_year", "father_name", "father_job", "mother_name", "mother_job", "parent_income", "parent_phone", "major", "status", "decision_note", "created_at", "updated_at", "submitted_at"].join(",");
const fields=[['full_name','Nama lengkap'],['birth_place','Tempat lahir'],['birth_date','Tanggal lahir','date'],['gender','Jenis kelamin','gender'],['religion','Agama'],['phone','Nomor WhatsApp','tel'],...addressFields,['school_origin','Asal sekolah'],['graduation_year','Tahun lulus','number'],['father_name','Nama ayah'],['father_job','Pekerjaan ayah'],['mother_name','Nama ibu'],['mother_job','Pekerjaan ibu'],['parent_income','Pendapatan orang tua per bulan (Rp)','number'],['parent_phone','Nomor WhatsApp orang tua','tel']];
function controls(values={}){values={address_country:"Indonesia",...values};if(!values.address_street&&values.address)values.address_street=values.address;return fields.map(([key,label,type='text',pattern])=>`<div class="${type==='textarea'?'full':''}"><label for="${key}">${label}</label>${type==='textarea'?`<textarea id="${key}" name="${key}" required maxlength="1000">${esc(values[key])}</textarea>`:type==='gender'?`<select id="${key}" name="${key}" required><option value="">Pilih</option>${['Laki-laki','Perempuan'].map(v=>`<option ${v===values[key]?'selected':''}>${v}</option>`).join('')}</select>`:`<input id="${key}" name="${key}" type="${type}" value="${esc(values[key])}" ${pattern?`pattern="${pattern}" title="${key==='nisn'?'NISN harus 10 digit':key==='nik'?'NIK harus 16 digit':key==='address_postal_code'?'Kode pos harus 5 digit':'Isi 1 sampai 3 digit angka'}" inputmode="numeric"`:''} ${type==='number'?(key==='graduation_year'?'min="1900" max="2100" step="1"':'min="0" max="999999999999" step="0.01"'):''} ${key==='birth_date'?`max="${new Date().toISOString().slice(0,10)}"`:''} maxlength="200" required>`}</div>`).join('')}
function auth(register=false){document.querySelector('#auth-content').innerHTML=`<div class="eyebrow">Portal SPMB DIPSA</div><h2>${register?'Buat akun siswa':'Selamat datang kembali'}</h2><p id="form-feedback" role="status"></p><form id="${register?'register-form':'login-form'}"><div class="formgrid"><div><label for="email">Email untuk login</label><input id="email" type="email" name="email" required autocomplete="email"></div><div><label for="password">${register?'Kata sandi (minimal 6 karakter)':'Kata sandi'}</label><input id="password" type="password" name="password" minlength="${register?6:1}" required autocomplete="${register?'new-password':'current-password'}"></div>${register?controls():`<div class="full"><label for="portal">Masuk sebagai</label><select name="portal" id="portal"><option value="student">Siswa</option><option value="committee">Panitia SPMB</option></select></div>`}</div>${register?'<p class="muted"><label><input type="checkbox" required style="width:auto"> Saya menyatakan data benar dan menyetujui penggunaan data untuk proses SPMB.</label>Data hanya dapat diakses oleh saya dan panitia yang berwenang.</p>':''}<div class="actions"><button>${register?'Daftar & masuk dashboard':'Masuk portal'}</button><button type="button" class="secondary" data-action="${register?'login':'register'}">${register?'Sudah punya akun':'Daftar siswa'}</button></div>${register?'':'<button type="button" class="secondary" data-action="forgot">Lupa kata sandi?</button>'}</form>`;if(!modal.open)modal.showModal()}
async function load(){if(!db)return;try{const session=check(await db.auth.getSession()).session;if(!session){user=null;committee=false;profile=null;home();return}const result=await db.auth.getUser();if(result.error?.name==='AuthSessionMissingError'){user=null;committee=false;profile=null;home();return}user=check(result).user;if(!user){home();return}committee=!!check(await db.rpc('is_committee'));if(committee)await admin();else await student()}catch(e){notice(e.message);home()}}
async function student(){document.body.classList.add("portal-view");closeMenu();profile=check(await db.from('applications').select(studentColumns).eq('user_id',user.id).maybeSingle());if(!profile){app.innerHTML='<section class="dashboard"><div class="card"><h2>Pendaftaran tidak tersedia</h2><p>Data pendaftaran belum tersedia atau telah diarsipkan panitia. Hubungi panitia untuk bantuan.</p><button data-action="logout">Keluar</button></div></section>';return}app.innerHTML=`<section class="dashboard"><div class="dashhead"><div><div class="eyebrow">Dashboard siswa</div><h2>Halo, ${esc(profile?.full_name||'calon siswa')}.</h2><p>Pendaftaran ${esc(cfg.schoolYear)} · ${esc(profile?.registration_number||'Belum diajukan')}</p></div><button class="secondary" data-action="logout">Keluar</button></div><div class="card"><span class="badge ${esc(profile?.status)}">${states[profile?.status]||'Lengkapi data'}</span><h3>${profile?.status==='accepted'?'Selamat! Anda dinyatakan diterima.':'Perjalanan pendaftaran Anda'}</h3><p>${esc(profile?.decision_note||'Lengkapi data, pilih jurusan, lalu kirim pendaftaran untuk diperiksa panitia.')}</p>${profile?.submitted_at?`<p class="muted">Diajukan: ${new Date(profile.submitted_at).toLocaleString('id-ID')}</p>`:''}<button class="secondary" data-action="refresh">Perbarui status</button> ${profile?.submitted_at?'<button class="secondary" data-action="print">Unduh / cetak bukti PDF</button>':''}</div><form id="application-form" class="card" style="margin-top:24px"><h3>Data pendaftaran</h3><fieldset ${profile&&profile.status!=='draft'?'disabled':''}><div class="formgrid">${controls(profile||{})}<div class="full"><label for="major">Program keahlian pilihan</label><select name="major" id="major"><option value="">Pilih jurusan</option>${majors.map(m=>`<option ${m===profile?.major?'selected':''}>${m}</option>`).join('')}</select></div></div><p class="muted">Setelah diajukan, perubahan data dilakukan melalui panitia.</p><div class="actions"><button name="intent" value="draft" formnovalidate>Simpan draf</button><button name="intent" value="submitted">Kirim pendaftaran ↗</button></div></fieldset></form><div id="documents" class="card" style="margin-top:24px"></div></section>`;if(profile)await renderDocuments(user.id,profile.status==='draft')}
async function admin(){document.body.classList.add("portal-view");closeMenu();records=[];for(let offset=0;;offset+=500){const page=check(await db.from('applications').select('*').is('deleted_at',null).order('created_at',{ascending:false}).order('user_id').range(offset,offset+499));records.push(...page);if(page.length<500)break}app.innerHTML=`<section class="dashboard"><div class="dashhead"><div><div class="eyebrow">Ruang kerja panitia</div><h2>Kelola penerimaan.</h2><p>Data calon siswa, verifikasi, dan hasil seleksi dalam satu tempat.</p></div><button class="secondary" data-action="logout">Keluar</button></div><div class="stats">${[['Seluruh akun siswa',records.length],['Menunggu verifikasi',records.filter(r=>r.status==='submitted').length],['Diterima',records.filter(r=>r.status==='accepted').length],['Tidak diterima',records.filter(r=>r.status==='rejected').length]].map(([s,n])=>`<div class="stat"><strong>${n}</strong><span>${s}</span></div>`).join('')}</div><div class="card"><div class="filters"><label>Cari nama / email / nomor pendaftaran<input id="search" type="search" placeholder="Cari calon siswa"></label><label>Tanggal akun: dari<input type="date" id="from"></label><label>Sampai<input type="date" id="to"></label><label>Jurusan<select id="filter-major"><option value="">Semua jurusan</option>${majors.map(m=>`<option>${m}</option>`).join('')}</select></label><label>Status<select id="filter-status"><option value="">Semua status</option>${Object.entries(states).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label>Urutan<select id="sort"><option value="desc">Terbaru</option><option value="asc">Terlama</option></select></label></div><div class="actions"><button data-action="export">Ekspor Excel ↗</button><button class="secondary" data-action="refresh">Muat ulang</button></div><p id="count" class="muted"></p><div class="tablewrap"><table><thead><tr><th>No. pendaftaran</th><th>Nama / email</th><th>Jurusan</th><th>Tanggal akun</th><th>Status</th><th>Tindakan</th></tr></thead><tbody id="rows"></tbody></table></div></div></section>`;document.querySelectorAll('.filters input,.filters select').forEach(x=>x.addEventListener('input',table));table()}
function filtered(){const val=id=>document.getElementById(id)?.value||'';const q=val('search').toLowerCase();return records.filter(r=>{const day=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Jakarta'}).format(new Date(r.created_at));return (!q||(r.full_name+' '+r.email+' '+r.registration_number).toLowerCase().includes(q))&&(!val('from')||day>=val('from'))&&(!val('to')||day<=val('to'))&&(!val('filter-major')||r.major===val('filter-major'))&&(!val('filter-status')||r.status===val('filter-status'))}).sort((a,b)=>(new Date(a.created_at)-new Date(b.created_at))*(val('sort')==='asc'?1:-1))}
function table(){const rs=filtered();document.querySelector('#count').textContent=`${rs.length} siswa ditampilkan · tanggal berdasarkan WIB`;document.querySelector('#rows').innerHTML=rs.map(r=>`<tr><td>${esc(r.registration_number)}</td><td><strong>${esc(r.full_name)}</strong><br>${esc(r.email)}</td><td>${esc(r.major||'Belum dipilih')}</td><td>${new Date(r.created_at).toLocaleDateString('id-ID',{timeZone:'Asia/Jakarta'})}</td><td><span class="badge ${esc(r.status)}">${states[r.status]}</span></td><td><button class="secondary" data-action="detail" data-id="${r.user_id}">Tinjau</button> <button class="secondary" data-action="edit-student" data-id="${r.user_id}">Edit</button> <button class="danger" data-action="delete-student" data-id="${r.user_id}">Hapus</button></td></tr>`).join('')||'<tr><td colspan="6">Tidak ada data sesuai filter.</td></tr>'}
function detail(id){disposeLocationMap();const r=records.find(x=>x.user_id===id);document.querySelector('#auth-content').innerHTML=`<div class="eyebrow">${esc(r.registration_number)}</div><h2>${esc(r.full_name)}</h2><div class="formgrid">${fields.map(([k,l])=>`<div><label>${l}</label><p>${esc(r[k])}</p></div>`).join('')}<div><label>Email</label><p>${esc(r.email)}</p></div><div><label>Jurusan</label><p>${esc(r.major)}</p></div></div><form id="decision-form" data-id="${id}"><label>Status</label><select name="status">${Object.entries(states).filter(([k])=>k!=='draft'||r.status==='draft').map(([k,v])=>`<option value="${k}" ${k===r.status?'selected':''}>${v}</option>`).join('')}</select><label style="margin-top:16px">Catatan untuk siswa</label><textarea name="decision_note" maxlength="2000">${esc(r.decision_note)}</textarea><button>Simpan hasil</button></form><section id="committee-location"></section>`;if(!modal.open)modal.showModal();renderDocuments(id,false,true);renderLocation(id)}
async function excel(){if(!window.ExcelJS)throw Error('Modul Excel belum tersedia. Periksa koneksi internet.');const rows=filtered(),wb=new ExcelJS.Workbook();wb.creator='Panitia SPMB SMK DIPSA Purwokerto';const sh=wb.addWorksheet('Rekap SPMB',{views:[{state:'frozen',ySplit:5}]});const cols=[['registration_number','No. pendaftaran'],...fields.map(([k,l])=>[k,l]),['email','Email'],['major','Jurusan'],['status','Status'],['decision_note','Catatan'],['created_at','Tanggal akun (WIB)'],['submitted_at','Tanggal pengajuan (WIB)']];sh.columns=[{width:7},...cols.map(([k])=>({width:k==='address'?45:25}))];const end=cols.length+1;sh.mergeCells(1,1,1,end);sh.getCell(1,1).value='REKAPITULASI PENDAFTARAN SPMB — SMK DIPSA PURWOKERTO';sh.mergeCells(2,1,2,end);sh.getCell(2,1).value=`Tahun ajaran ${cfg.schoolYear} | Dicetak ${new Date().toLocaleString('id-ID',{timeZone:'Asia/Jakarta'})} WIB`;sh.mergeCells(3,1,3,end);sh.getCell(3,1).value=`Filter: ${document.querySelector('#from').value||'Awal'} s.d. ${document.querySelector('#to').value||'Akhir'} | Jurusan: ${document.querySelector('#filter-major').value||'Semua'} | Status: ${document.querySelector('#filter-status').selectedOptions[0].text} | Pencarian: ${document.querySelector('#search').value||'-'} | Jumlah: ${rows.length}`;sh.getRow(5).values=['No.',...cols.map(c=>c[1])];rows.forEach((r,i)=>{const row=sh.addRow([i+1,...cols.map(([k])=>k==='status'?states[r[k]]:k.endsWith('_at')?(r[k]?new Date(r[k]).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'}):''):r[k]??'')]);row.height=32;row.eachCell(c=>{c.alignment={vertical:'middle',wrapText:true};c.border={bottom:{style:'thin',color:{argb:'FFDCE2E3'}}};if(i%2===0)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF0F4F6'}}});row.getCell(cols.findIndex(c=>c[0]==='parent_income')+2).numFmt='"Rp" #,##0';});[1,5].forEach(i=>{sh.getRow(i).height=30;sh.getRow(i).eachCell(c=>{c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF132E40'}};c.font={bold:true,color:{argb:'FFFFFFFF'},size:i===1?14:11};c.alignment={vertical:'middle',wrapText:true}})});sh.autoFilter={from:{row:5,column:1},to:{row:Math.max(5,5+rows.length),column:end}};sh.pageSetup={orientation:'landscape',paperSize:9,fitToPage:true,fitToWidth:1,fitToHeight:0,printTitlesRow:'1:5'};const url=URL.createObjectURL(new Blob([await wb.xlsx.writeBuffer()],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));const a=document.createElement('a');a.href=url;a.download=`Rekap-SPMB-DIPSA-${new Date().toISOString().slice(0,10)}.xlsx`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b)return;try{switch(b.dataset.action){case'login':auth();break;case'register':auth(true);break;case'close':modal.close();disposeLocationMap();break;case'logout':check(await db.auth.signOut());user=null;home();break;case'refresh':await load();break;case'detail':detail(b.dataset.id);break;case'edit-student':editStudent(b.dataset.id);break;case'delete-student':deleteStudent(b.dataset.id);break;case'export':await excel();break;case'forgot':passwordForm(false);break;case'open-document':await openDocument(b.dataset.path);break;case'print':printReceipt();break}}catch(err){notice(err.message)}});
document.addEventListener('submit',async e=>{e.preventDefault();const f=e.target,button=e.submitter;if(!configured())return;if(!button)return;button.disabled=true;try{const d=Object.fromEntries(new FormData(f));if(['register-form','application-form'].includes(f.id))d.address=fullAddress(d);if(f.id==='reset-form'){check(await db.auth.resetPasswordForEmail(d.email,{redirectTo:location.origin+location.pathname}));notice('Jika akun tersedia, tautan pemulihan dikirim ke email Anda.')}else if(f.id==='password-form'){if(d.password!==d.confirm)throw Error('Konfirmasi kata sandi tidak sama.');check(await db.auth.updateUser({password:d.password}));recovery=false;modal.close();await load();notice('Kata sandi berhasil diperbarui.')}else if(f.id==='register-form'){const email=d.email,password=d.password;delete d.password;d.parent_income=Number(d.parent_income);d.graduation_year=Number(d.graduation_year);const signup=check(await db.auth.signUp({email,password,options:{data:{application:d},emailRedirectTo:location.origin+location.pathname}}));modal.close();if(signup.session){await load();notice('Akun berhasil dibuat. Selamat datang di portal SPMB.')}else{user=null;committee=false;profile=null;home();auth();notice('Pendaftaran belum menghasilkan sesi login. Jika sudah punya akun, silakan masuk. Untuk pendaftaran tanpa verifikasi, pengelola perlu mematikan Confirm email di Supabase.')}}else if(f.id==='login-form'){check(await db.auth.signInWithPassword({email:d.email,password:d.password}));const is=!!check(await db.rpc('is_committee'));if((d.portal==='committee')!==is){await db.auth.signOut();throw Error('Akun tidak memiliki akses untuk portal yang dipilih.')}modal.close();await load()}else if(f.id==='application-form'){d.parent_income=Number(d.parent_income);d.graduation_year=Number(d.graduation_year);d.status=button.value;d.major=d.major||null;if(!f.reportValidity())return;if(d.status==='submitted'&&!d.major)throw Error('Pilih program keahlian sebelum mengirim pendaftaran.');if(d.status==='submitted'&&!confirm('Kirim pendaftaran? Setelah dikirim, data dikunci untuk pemeriksaan panitia.'))return;if(!profile)throw Error('Profil akun belum tersedia. Hubungi pengelola.');check(await db.from('applications').update(d).eq('user_id',user.id).select('user_id').single());notice(d.status==='submitted'?'Pendaftaran berhasil diajukan.':'Draf berhasil disimpan.');await student()}else if(f.id==='location-form'){if(!committee)throw Error('Hanya panitia dapat mengisi lokasi.');if(!locationDraft||locationDraft.user_id!==f.dataset.id)throw Error('Klik titik rumah pada peta terlebih dahulu.');const point=locationPayload(locationDraft.latitude,locationDraft.longitude);check(await db.from('application_locations').upsert({user_id:f.dataset.id,...point,updated_by:user.id}).select('user_id').single());notice('Lokasi rumah berhasil disimpan.');await renderLocation(f.dataset.id)}else if(f.id==='edit-student-form'){if(!committee)throw Error('Hanya panitia dapat mengubah biodata.');d.address=fullAddress(d);d.parent_income=Number(d.parent_income);d.graduation_year=Number(d.graduation_year);d.major=d.major||null;const r=records.find(x=>x.user_id===f.dataset.id);if(!r)throw Error('Data siswa tidak ditemukan.');if(r.status!=='draft'&&!d.major)throw Error('Jurusan wajib untuk pendaftaran yang telah diajukan.');check(await db.from('applications').update(d).eq('user_id',f.dataset.id).is('deleted_at',null).select('user_id').single());modal.close();notice('Data siswa berhasil diperbarui.');await admin()}else if(f.id==='delete-student-form'){if(!committee)throw Error('Hanya panitia dapat menghapus data.');const r=records.find(x=>x.user_id===f.dataset.id);if(!r||d.confirm_number.trim()!==r.registration_number)throw Error('Nomor pendaftaran konfirmasi tidak cocok.');check(await db.rpc('spmb_archive_application',{target_user_id:r.user_id}));modal.close();notice('Data siswa dihapus dari daftar aktif dan disimpan sebagai arsip.');await admin()}else if(f.id==='decision-form'){check(await db.from('applications').update(d).eq('user_id',f.dataset.id).select('user_id').single());modal.close();notice('Status siswa diperbarui.');await admin()}}catch(err){notice(err.message)}finally{button.disabled=false}});
home();if(db){db.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY'){recovery=true;setTimeout(()=>passwordForm(true),0)}});load();}

function closeMenu(){document.querySelector('#mobileNav').classList.remove('open');document.querySelector('#menuToggle').setAttribute('aria-expanded','false')}
document.querySelector('#menuToggle').addEventListener('click',()=>{const open=document.querySelector('#mobileNav').classList.toggle('open');document.querySelector('#menuToggle').setAttribute('aria-expanded',String(open))});
document.querySelectorAll('#mobileNav a,#mobileNav button').forEach(el=>el.addEventListener('click',closeMenu));
document.querySelector('#year').textContent=new Date().getFullYear();

function passwordForm(update){document.querySelector('#auth-content').innerHTML=`<h2>${update?'Atur kata sandi baru':'Pulihkan akun'}</h2><p id="form-feedback" role="status"></p><form id="${update?'password-form':'reset-form'}">${update?'<label>Kata sandi baru<input name="password" type="password" minlength="6" autocomplete="new-password" required></label><label>Ulangi kata sandi<input name="confirm" type="password" minlength="6" autocomplete="new-password" required></label>':'<label>Email akun<input name="email" type="email" autocomplete="email" required></label>'}<div class="actions"><button>${update?'Simpan kata sandi':'Kirim tautan pemulihan'}</button></div></form>`;if(!modal.open)modal.showModal()}
async function renderDocuments(id,editable,adminView=false){
 const host=adminView?document.querySelector('#auth-content'):document.querySelector('#documents');if(!host)return;
 const panel=adminView?document.createElement('section'):host;if(adminView)host.append(panel);
 panel.innerHTML='<h3>Berkas pendukung</h3><p>Memuat berkas…</p>';
 try{const files=check(await db.storage.from('spmb-documents').list(id,{limit:100}));panel.innerHTML='<h3>Berkas pendukung</h3><p class="muted">PDF, JPG, PNG • maksimal 5 MB per berkas. Berkas tersimpan privat. Kelengkapan akan diperiksa panitia.</p>'+documentTypes.map(([key,label])=>{const found=files.find(x=>x.name.split('.')[0]===key);return `<div class="document-row"><strong>${label}</strong>${found?`<button type="button" class="secondary" data-action="open-document" data-path="${esc(id+'/'+found.name)}">Lihat berkas</button>`:'<span class="muted">Belum diunggah</span>'}${editable?`<label class="upload-label">${found?'Ganti':'Unggah'}<input type="file" data-document="${key}" accept="application/pdf,image/jpeg,image/png"></label>`:''}</div>`}).join('');
 panel.querySelectorAll('[data-document]').forEach(input=>input.addEventListener('change',async()=>{const file=input.files[0];if(!file)return;input.disabled=true;try{const ext={'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png'}[file.type];if(!ext||file.size>5*1024*1024||file.size===0)throw Error('Gunakan PDF, JPG atau PNG dengan ukuran 1 byte sampai 5 MB.');const key=input.dataset.document,path=id+'/'+key+'.'+ext;check(await db.storage.from('spmb-documents').upload(path,file,{upsert:true,contentType:file.type}));const obsolete=files.filter(x=>x.name.split('.')[0]===key&&x.name!==key+'.'+ext).map(x=>id+'/'+x.name);if(obsolete.length)check(await db.storage.from('spmb-documents').remove(obsolete));notice('Berkas berhasil diunggah.');await renderDocuments(id,true)}catch(e){notice(e.message);input.disabled=false}}));
 }catch(e){panel.innerHTML='<h3>Berkas pendukung</h3><p>Berkas belum dapat dimuat. Pastikan migrasi Storage sudah dijalankan.</p>';notice(e.message)}
}
async function openDocument(path){const tab=window.open('about:blank','_blank');try{const data=check(await db.storage.from('spmb-documents').createSignedUrl(path,60));if(tab){tab.opener=null;tab.location=data.signedUrl}else notice('Izinkan popup untuk melihat berkas.')}catch(e){tab?.close();throw e}}
function receiptRows(p){return [['Nama lengkap',p.full_name],['Tempat, tanggal lahir',[p.birth_place,p.birth_date?new Date(p.birth_date+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}):''].filter(Boolean).join(', ')],['Jenis kelamin',p.gender],['Asal sekolah',p.school_origin],['Alamat',p.address],['Nomor WhatsApp',p.phone],['Email',p.email],['Program keahlian',p.major],['Status pendaftaran',states[p.status]||p.status],['Tanggal pengajuan',new Date(p.submitted_at).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'})+' WIB'],['Catatan panitia',p.decision_note||'-']]}
function printReceipt(){
 if(!profile?.submitted_at)return;
 if(!window.jspdf?.jsPDF)throw Error('Modul PDF belum tersedia. Periksa koneksi internet lalu muat ulang website.');
 const doc=new window.jspdf.jsPDF({orientation:'portrait',unit:'mm',format:'a4'}),left=20,right=190,width=170;let y=0;
 const text=v=>String(v??'-').replace(/[\u0000-\u001f]/g,' ').replace(/—|–/g,'-');
 function header(){doc.setTextColor(25,35,45);doc.setFont('helvetica','bold');doc.setFontSize(19);doc.text('SMK DIPSA PURWOKERTO',105,24,{align:'center'});doc.setFont('helvetica','normal');doc.setFontSize(10);doc.text('PANITIA SISTEM PENERIMAAN MURID BARU (SPMB)',105,32,{align:'center'});doc.setFontSize(9);doc.text('Jl. Karangbenda Raya, Berkoh, Purwokerto Selatan, Banyumas, Jawa Tengah',105,39,{align:'center'});doc.setLineWidth(.7);doc.line(left,44,right,44);doc.setLineWidth(.2);doc.line(left,45,right,45);y=57;}
 function room(height){if(y+height>265){doc.addPage();header()}}
 function paragraph(value,size=10,bold=false){doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);const lines=doc.splitTextToSize(text(value),width);for(const line of lines){room(6);doc.text(line,left,y);y+=5.5}y+=3}
 header();doc.setFont('helvetica','bold');doc.setFontSize(14);doc.text('BUKTI PENDAFTARAN SPMB',105,y,{align:'center'});y+=8;doc.setFont('helvetica','normal');doc.setFontSize(10);doc.text('Tahun ajaran '+text(cfg.schoolYear),105,y,{align:'center'});y+=12;
 doc.setFillColor(240,243,246);doc.rect(left,y-5,width,14,'F');doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text('Nomor pendaftaran: '+text(profile.registration_number),left+4,y+3);y+=21;
 for(const [label,value] of receiptRows(profile)){doc.setFont('helvetica','normal');doc.setFontSize(10);const lines=doc.splitTextToSize(text(value)||'-',112);const height=Math.max(8,lines.length*5+3);room(height);doc.setFont('helvetica','bold');doc.text(label,left,y);doc.setFont('helvetica','normal');doc.text(':',74,y);doc.text(lines,78,y);y+=height;doc.setDrawColor(225,228,232);doc.line(left,y-3,right,y-3)}
 y+=5;paragraph('KETERANGAN',10,true);paragraph('Bukti ini menyatakan bahwa pengajuan pendaftaran siswa telah tercatat pada portal SPMB SMK DIPSA Purwokerto. Status pada bukti ini sesuai data saat dokumen diunduh.');paragraph('Bukti pendaftaran ini bukan surat keputusan penerimaan. Hasil seleksi dan petunjuk selanjutnya mengikuti keputusan Panitia SPMB.');
 room(17);paragraph('Dokumen diterbitkan secara elektronik melalui portal SPMB. Simpan bukti ini untuk keperluan verifikasi pendaftaran.',9);
 const pages=doc.getNumberOfPages();for(let i=1;i<=pages;i++){doc.setPage(i);doc.setDrawColor(170,175,180);doc.line(left,275,right,275);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(90,95,100);doc.text('SPMB SMK DIPSA | '+text(profile.registration_number),left,281);doc.text('Halaman '+i+' / '+pages,right,281,{align:'right'})}
 doc.save('Bukti-Pendaftaran-'+String(profile.registration_number).replace(/[^a-zA-Z0-9_-]/g,'-')+'.pdf');
}

function fullAddress(d){return `${d.address_street}, RT ${d.address_rt}/RW ${d.address_rw}, ${d.address_village}, ${d.address_district}, ${d.address_city}, ${d.address_province}, ${d.address_country}`}
function validMaps(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&((u.hostname==='maps.app.goo.gl'&&u.pathname.length>1)||(u.hostname==='goo.gl'&&u.pathname.startsWith('/maps/'))||((u.hostname==='www.google.com'||u.hostname==='google.com'||u.hostname==='www.google.co.id'||u.hostname==='google.co.id')&&/^\/maps(?:\/|$)/.test(u.pathname))||u.hostname==='maps.google.com')}catch{return false}}
function locationPayload(latitude,longitude){if(typeof latitude!=='number'||typeof longitude!=='number'||!Number.isFinite(latitude)||!Number.isFinite(longitude)||latitude < -90||latitude > 90||longitude < -180||longitude > 180)throw Error('Koordinat lokasi tidak valid.');const lat=Number(latitude.toFixed(7)),lng=Number(longitude.toFixed(7));return {latitude:lat,longitude:lng,maps_url:`https://www.google.com/maps?q=${lat},${lng}`}}
function disposeLocationMap(){locationRequest++;if(locationMap){locationMap.remove();locationMap=null}locationDraft=null}
modal.addEventListener('close',disposeLocationMap);
async function renderLocation(id){
 disposeLocationMap();const ticket=locationRequest;const host=document.querySelector('#committee-location');if(!host||!committee)return;host.innerHTML='<p>Memuat lokasi…</p>';
 try{
 const row=check(await db.from('application_locations').select('maps_url,latitude,longitude').eq('user_id',id).maybeSingle());if(ticket!==locationRequest||!host.isConnected||!modal.open)return;
 if(!window.L){host.innerHTML='<h3>Lokasi rumah</h3><p>Peta belum dapat dimuat. Periksa koneksi internet lalu tutup dan buka kembali Tinjau siswa.</p>';return}
 const saved=row?.latitude!=null&&row?.longitude!=null?locationPayload(Number(row.latitude),Number(row.longitude)):null;
 host.innerHTML=`<h3>Lokasi rumah — khusus panitia</h3><p>Geser dan perbesar peta hingga rumah terlihat. Klik rumah untuk memasang pin, lalu geser pin jika perlu dan klik Simpan lokasi.</p><div id="home-map" class="home-map" role="region" aria-label="Peta penentuan lokasi rumah"></div><p id="map-feedback" role="status" class="muted">${saved?'Lokasi tersimpan dimuat.':'Belum ada titik rumah. Meminta lokasi perangkat…'}</p><div id="location-permission-help" hidden><p>Jika salah menekan Blokir: buka Chrome → ⋮ → Setelan → Setelan situs → Lokasi → pilih website ini → Izinkan. Setelah itu tekan Minta izin lagi.</p></div><form id="location-form" data-id="${esc(id)}"><div class="actions"><button type="button" id="locate-device" class="secondary">Lokasi HP saya</button><button type="button" id="pin-center" class="secondary">Tandai tengah peta</button><button id="save-location" ${saved?'':'disabled'}>Simpan lokasi</button><a id="map-google-link" class="button secondary" target="_blank" rel="noopener noreferrer" ${saved?`href="${esc(saved.maps_url)}"`:'hidden'}>Buka Google Maps</a></div></form>${!saved&&row?.maps_url&&validMaps(row.maps_url)?`<p><a href="${esc(row.maps_url)}" target="_blank" rel="noopener noreferrer">Buka tautan lokasi lama</a>. Tentukan pin untuk menyimpan koordinatnya.</p>`:''}`;
 const map=window.L.map(host.querySelector('#home-map')).setView(saved?[saved.latitude,saved.longitude]:[-7.4243,109.2396],saved?18:12);locationMap=map;
 const tile=window.L.tileLayer(cfg.mapTileUrl||'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(map);
 tile.on('tileerror',()=>{if(ticket===locationRequest)host.querySelector('#map-feedback').textContent='Gambar peta gagal dimuat. Periksa koneksi internet sebelum menentukan titik rumah.'});
 let marker=null,selectionVersion=0,locating=false,gpsRequest=0;
 function place(lat,lng,dirty=true){selectionVersion++;const point=locationPayload(lat,lng);locationDraft={user_id:id,...point};if(marker)marker.setLatLng([point.latitude,point.longitude]);else{marker=window.L.marker([point.latitude,point.longitude],{draggable:true,alt:'Titik rumah siswa'}).addTo(map);marker.on('dragend',()=>{const p=marker.getLatLng();place(p.lat,p.lng)})}host.querySelector('#save-location').disabled=false;const link=host.querySelector('#map-google-link');link.href=point.maps_url;link.hidden=false;host.querySelector('#map-feedback').textContent=`${dirty?'Titik dipilih — belum disimpan':'Lokasi tersimpan'}: ${point.latitude}, ${point.longitude}`}
 function locate(){if(locating)return;const gpsTicket=++gpsRequest,version=selectionVersion;const btn=host.querySelector('#locate-device'),feedback=host.querySelector('#map-feedback');const active=()=>ticket===locationRequest&&locationMap===map&&host.isConnected&&modal.open&&gpsTicket===gpsRequest;
 if(typeof navigator==='undefined'||!navigator.geolocation){feedback.textContent='Perangkat tidak mendukung lokasi otomatis. Geser peta dan pilih titik rumah.';return}
 locating=true;btn.disabled=true;btn.textContent='Meminta lokasi…';feedback.textContent='Mencari lokasi perangkat. Izinkan akses lokasi jika diminta.';
 navigator.geolocation.getCurrentPosition(position=>{if(!active())return;locating=false;btn.disabled=false;btn.textContent='Lokasi HP saya';host.querySelector('#location-permission-help').hidden=true;if(selectionVersion!==version)return;try{const p=locationPayload(position.coords.latitude,position.coords.longitude);map.setView([p.latitude,p.longitude],18);const accuracy=Number.isFinite(position.coords.accuracy)?` (perkiraan akurasi ${Math.round(position.coords.accuracy)} meter)`:'';feedback.textContent=`Peta berpusat pada lokasi perangkat${accuracy}. Klik titik rumah atau Tandai tengah peta, lalu Simpan lokasi.`}catch{feedback.textContent='Lokasi perangkat tidak valid. Geser peta untuk memilih rumah.'}},error=>{if(!active())return;locating=false;btn.disabled=false;btn.textContent=error.code===1?'Minta izin lagi':'Coba lokasi lagi';host.querySelector('#location-permission-help').hidden=error.code!==1;if(selectionVersion!==version)return;feedback.textContent=geolocationError(error.code)},{enableHighAccuracy:true,timeout:15000,maximumAge:0});}
 host.querySelector('#locate-device').addEventListener('click',locate);
 map.on('click',e=>place(e.latlng.lat,e.latlng.lng));host.querySelector('#pin-center').addEventListener('click',()=>{const p=map.getCenter();place(p.lat,p.lng)});if(saved)place(saved.latitude,saved.longitude,false);else locate();setTimeout(()=>{if(locationMap===map)map.invalidateSize()},0);
 }catch(e){if(ticket===locationRequest){host.innerHTML='<h3>Lokasi rumah</h3><p>Lokasi belum dapat dimuat. Pastikan migrasi peta sudah dijalankan di Supabase.</p>';notice(e.message)}}
}

function geolocationError(code){return (code===1?'Izin lokasi ditolak. Jika salah pencet, tekan Minta izin lagi. Jika popup tidak muncul, ubah izin lokasi website di setelan Chrome menjadi Izinkan, lalu coba lagi.':code===2?'Lokasi perangkat belum tersedia. Aktifkan lokasi/GPS dan coba lagi.':'Pencarian lokasi terlalu lama. Coba lagi dengan tombol Lokasi HP saya.')+' Anda tetap dapat menggeser peta dan memilih titik rumah.'}

function editStudent(id){if(!committee)throw Error('Akses panitia diperlukan.');const r=records.find(x=>x.user_id===id);if(!r)throw Error('Data siswa tidak ditemukan.');disposeLocationMap();document.querySelector('#auth-content').innerHTML=`<div class="eyebrow">Edit data siswa · ${esc(r.registration_number)}</div><h2>${esc(r.full_name)}</h2><p>Email login dan nomor pendaftaran tetap: ${esc(r.email)}.</p><p id="form-feedback" role="status"></p><form id="edit-student-form" data-id="${esc(id)}"><div class="formgrid">${controls(r)}<div class="full"><label for="major">Program keahlian</label><select name="major" id="major" ${r.status!=='draft'?'required':''}><option value="">Belum dipilih</option>${majors.map(m=>`<option ${r.major===m?'selected':''}>${esc(m)}</option>`).join('')}</select></div></div><div class="actions"><button>Simpan perubahan</button><button type="button" class="secondary" data-action="close">Batal</button></div></form>`;if(!modal.open)modal.showModal()}
function deleteStudent(id){if(!committee)throw Error('Akses panitia diperlukan.');const r=records.find(x=>x.user_id===id);if(!r)throw Error('Data siswa tidak ditemukan.');disposeLocationMap();document.querySelector('#auth-content').innerHTML=`<h2>Hapus data siswa?</h2><p><strong>${esc(r.full_name)}</strong> · ${esc(r.registration_number)}</p><p>Data akan dihapus dari daftar aktif dan rekap Excel. Biodata, berkas, serta lokasi tetap disimpan sebagai arsip agar dapat dipulihkan. Akun login tetap ada; pendaftaran tidak dapat diakses siswa selama diarsipkan.</p><p id="form-feedback" role="status"></p><form id="delete-student-form" data-id="${esc(id)}"><label for="confirm-number">Ketik ${esc(r.registration_number)} untuk mengonfirmasi</label><input id="confirm-number" name="confirm_number" autocomplete="off" required><div class="actions"><button class="danger">Hapus dari daftar aktif</button><button type="button" class="secondary" data-action="close">Batal</button></div></form>`;if(!modal.open)modal.showModal()}
