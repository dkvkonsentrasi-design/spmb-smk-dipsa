const cfg=window.SPMB_CONFIG, app=document.querySelector('#app'), modal=document.querySelector('#auth');
const db=cfg.supabaseUrl&&cfg.supabaseAnonKey&&window.supabase?supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
const majors=['Teknik Sepeda Motor','Desain Komunikasi Visual','Manajemen Perkantoran'];
const states={draft:'Draf',submitted:'Menunggu verifikasi',verified:'Terverifikasi',accepted:'Diterima',rejected:'Tidak diterima'};
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
          <button class="button button-light" data-action="register">Daftar siswa baru ↗</button>
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
          <div class="actions"><button class="button button-light" data-action="register">Mulai pendaftaran ↗</button><button class="button admission-login" data-action="login">Masuk portal</button></div>
        </div>
      </div>
    </section>
  `;closeMenu()}
const fields=[['full_name','Nama lengkap'],['nisn','NISN','text','[0-9]{10}'],['nik','NIK','text','[0-9]{16}'],['birth_place','Tempat lahir'],['birth_date','Tanggal lahir','date'],['gender','Jenis kelamin','gender'],['religion','Agama'],['phone','Nomor WhatsApp','tel'],['address','Alamat lengkap','textarea'],['school_origin','Asal sekolah'],['graduation_year','Tahun lulus','number'],['father_name','Nama ayah'],['father_job','Pekerjaan ayah'],['mother_name','Nama ibu'],['mother_job','Pekerjaan ibu'],['parent_income','Pendapatan orang tua per bulan (Rp)','number'],['parent_phone','Nomor WhatsApp orang tua','tel']];
function controls(values={}){return fields.map(([key,label,type='text',pattern])=>`<div class="${type==='textarea'?'full':''}"><label for="${key}">${label}</label>${type==='textarea'?`<textarea id="${key}" name="${key}" required maxlength="1000">${esc(values[key])}</textarea>`:type==='gender'?`<select id="${key}" name="${key}" required><option value="">Pilih</option>${['Laki-laki','Perempuan'].map(v=>`<option ${v===values[key]?'selected':''}>${v}</option>`).join('')}</select>`:`<input id="${key}" name="${key}" type="${type}" value="${esc(values[key])}" ${pattern?`pattern="${pattern}" title="${label} harus ${key==='nisn'?10:16} digit"`:''} ${type==='number'?(key==='graduation_year'?'min="1900" max="2100" step="1"':'min="0" max="999999999999" step="0.01"'):''} ${key==='birth_date'?`max="${new Date().toISOString().slice(0,10)}"`:''} maxlength="200" required>`}</div>`).join('')}
function auth(register=false){document.querySelector('#auth-content').innerHTML=`<div class="eyebrow">Portal SPMB DIPSA</div><h2>${register?'Buat akun siswa':'Selamat datang kembali'}</h2><p id="form-feedback" role="status"></p><form id="${register?'register-form':'login-form'}"><div class="formgrid"><div><label for="email">Email aktif</label><input id="email" type="email" name="email" required autocomplete="email"></div><div><label for="password">Kata sandi (minimal 10 karakter)</label><input id="password" type="password" name="password" minlength="${register?10:1}" required autocomplete="${register?'new-password':'current-password'}"></div>${register?controls():`<div class="full"><label for="portal">Masuk sebagai</label><select name="portal" id="portal"><option value="student">Siswa</option><option value="committee">Panitia SPMB</option></select></div>`}</div>${register?'<p class="muted"><label><input type="checkbox" required style="width:auto"> Saya menyatakan data benar dan menyetujui penggunaan data untuk proses SPMB.</label>Data hanya dapat diakses oleh saya dan panitia yang berwenang.</p>':''}<div class="actions"><button>${register?'Daftar & masuk dashboard':'Masuk portal'}</button><button type="button" class="secondary" data-action="${register?'login':'register'}">${register?'Sudah punya akun':'Daftar siswa'}</button></div>${register?'':'<button type="button" class="secondary" data-action="forgot">Lupa kata sandi?</button>'}</form>`;if(!modal.open)modal.showModal()}
async function load(){if(!db)return;try{const session=check(await db.auth.getSession()).session;if(!session){user=null;committee=false;profile=null;home();return}const result=await db.auth.getUser();if(result.error?.name==='AuthSessionMissingError'){user=null;committee=false;profile=null;home();return}user=check(result).user;if(!user){home();return}committee=!!check(await db.rpc('is_committee'));if(committee)await admin();else await student()}catch(e){notice(e.message);home()}}
async function student(){document.body.classList.add("portal-view");closeMenu();profile=check(await db.from('applications').select('*').eq('user_id',user.id).maybeSingle());app.innerHTML=`<section class="dashboard"><div class="dashhead"><div><div class="eyebrow">Dashboard siswa</div><h2>Halo, ${esc(profile?.full_name||'calon siswa')}.</h2><p>Pendaftaran ${esc(cfg.schoolYear)} · ${esc(profile?.registration_number||'Belum diajukan')}</p></div><button class="secondary" data-action="logout">Keluar</button></div><div class="card"><span class="badge ${esc(profile?.status)}">${states[profile?.status]||'Lengkapi data'}</span><h3>${profile?.status==='accepted'?'Selamat! Anda dinyatakan diterima.':'Perjalanan pendaftaran Anda'}</h3><p>${esc(profile?.decision_note||'Lengkapi data, pilih jurusan, lalu kirim pendaftaran untuk diperiksa panitia.')}</p>${profile?.submitted_at?`<p class="muted">Diajukan: ${new Date(profile.submitted_at).toLocaleString('id-ID')}</p>`:''}<button class="secondary" data-action="refresh">Perbarui status</button> ${profile?.submitted_at?'<button class="secondary" data-action="print">Cetak bukti</button>':''}</div><form id="application-form" class="card" style="margin-top:24px"><h3>Data pendaftaran</h3><fieldset ${profile&&profile.status!=='draft'?'disabled':''}><div class="formgrid">${controls(profile||{})}<div class="full"><label for="major">Program keahlian pilihan</label><select name="major" id="major"><option value="">Pilih jurusan</option>${majors.map(m=>`<option ${m===profile?.major?'selected':''}>${m}</option>`).join('')}</select></div></div><p class="muted">Setelah diajukan, perubahan data dilakukan melalui panitia.</p><div class="actions"><button name="intent" value="draft" formnovalidate>Simpan draf</button><button name="intent" value="submitted">Kirim pendaftaran ↗</button></div></fieldset></form><div id="documents" class="card" style="margin-top:24px"></div></section>`;if(profile)await renderDocuments(user.id,profile.status==='draft')}
async function admin(){document.body.classList.add("portal-view");closeMenu();records=[];for(let offset=0;;offset+=500){const page=check(await db.from('applications').select('*').order('created_at',{ascending:false}).order('user_id').range(offset,offset+499));records.push(...page);if(page.length<500)break}app.innerHTML=`<section class="dashboard"><div class="dashhead"><div><div class="eyebrow">Ruang kerja panitia</div><h2>Kelola penerimaan.</h2><p>Data calon siswa, verifikasi, dan hasil seleksi dalam satu tempat.</p></div><button class="secondary" data-action="logout">Keluar</button></div><div class="stats">${[['Seluruh akun siswa',records.length],['Menunggu verifikasi',records.filter(r=>r.status==='submitted').length],['Diterima',records.filter(r=>r.status==='accepted').length],['Tidak diterima',records.filter(r=>r.status==='rejected').length]].map(([s,n])=>`<div class="stat"><strong>${n}</strong><span>${s}</span></div>`).join('')}</div><div class="card"><div class="filters"><label>Cari nama / NISN<input id="search" type="search" placeholder="Cari calon siswa"></label><label>Tanggal akun: dari<input type="date" id="from"></label><label>Sampai<input type="date" id="to"></label><label>Jurusan<select id="filter-major"><option value="">Semua jurusan</option>${majors.map(m=>`<option>${m}</option>`).join('')}</select></label><label>Status<select id="filter-status"><option value="">Semua status</option>${Object.entries(states).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label>Urutan<select id="sort"><option value="desc">Terbaru</option><option value="asc">Terlama</option></select></label></div><div class="actions"><button data-action="export">Ekspor Excel ↗</button><button class="secondary" data-action="refresh">Muat ulang</button></div><p id="count" class="muted"></p><div class="tablewrap"><table><thead><tr><th>No. pendaftaran</th><th>Nama / NISN</th><th>Jurusan</th><th>Tanggal akun</th><th>Status</th><th>Tindakan</th></tr></thead><tbody id="rows"></tbody></table></div></div></section>`;document.querySelectorAll('.filters input,.filters select').forEach(x=>x.addEventListener('input',table));table()}
function filtered(){const val=id=>document.getElementById(id)?.value||'';const q=val('search').toLowerCase();return records.filter(r=>{const day=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Jakarta'}).format(new Date(r.created_at));return (!q||(r.full_name+' '+r.nisn).toLowerCase().includes(q))&&(!val('from')||day>=val('from'))&&(!val('to')||day<=val('to'))&&(!val('filter-major')||r.major===val('filter-major'))&&(!val('filter-status')||r.status===val('filter-status'))}).sort((a,b)=>(new Date(a.created_at)-new Date(b.created_at))*(val('sort')==='asc'?1:-1))}
function table(){const rs=filtered();document.querySelector('#count').textContent=`${rs.length} siswa ditampilkan · tanggal berdasarkan WIB`;document.querySelector('#rows').innerHTML=rs.map(r=>`<tr><td>${esc(r.registration_number)}</td><td><strong>${esc(r.full_name)}</strong><br>${esc(r.nisn)}</td><td>${esc(r.major||'Belum dipilih')}</td><td>${new Date(r.created_at).toLocaleDateString('id-ID',{timeZone:'Asia/Jakarta'})}</td><td><span class="badge ${esc(r.status)}">${states[r.status]}</span></td><td><button class="secondary" data-action="detail" data-id="${r.user_id}">Tinjau</button></td></tr>`).join('')||'<tr><td colspan="6">Tidak ada data sesuai filter.</td></tr>'}
function detail(id){const r=records.find(x=>x.user_id===id);document.querySelector('#auth-content').innerHTML=`<div class="eyebrow">${esc(r.registration_number)}</div><h2>${esc(r.full_name)}</h2><div class="formgrid">${fields.map(([k,l])=>`<div><label>${l}</label><p>${esc(r[k])}</p></div>`).join('')}<div><label>Email</label><p>${esc(r.email)}</p></div><div><label>Jurusan</label><p>${esc(r.major)}</p></div></div><form id="decision-form" data-id="${id}"><label>Status</label><select name="status">${Object.entries(states).filter(([k])=>k!=='draft'||r.status==='draft').map(([k,v])=>`<option value="${k}" ${k===r.status?'selected':''}>${v}</option>`).join('')}</select><label style="margin-top:16px">Catatan untuk siswa</label><textarea name="decision_note" maxlength="2000">${esc(r.decision_note)}</textarea><button>Simpan hasil</button></form>`;if(!modal.open)modal.showModal();renderDocuments(id,false,true)}
async function excel(){if(!window.ExcelJS)throw Error('Modul Excel belum tersedia. Periksa koneksi internet.');const rows=filtered(),wb=new ExcelJS.Workbook();wb.creator='Panitia SPMB SMK DIPSA Purwokerto';const sh=wb.addWorksheet('Rekap SPMB',{views:[{state:'frozen',ySplit:5}]});const cols=[['registration_number','No. pendaftaran'],...fields.map(([k,l])=>[k,l]),['email','Email'],['major','Jurusan'],['status','Status'],['decision_note','Catatan'],['created_at','Tanggal akun (WIB)'],['submitted_at','Tanggal pengajuan (WIB)']];sh.columns=[{width:7},...cols.map(([k])=>({width:k==='address'?45:25}))];const end=cols.length+1;sh.mergeCells(1,1,1,end);sh.getCell(1,1).value='REKAPITULASI PENDAFTARAN SPMB — SMK DIPSA PURWOKERTO';sh.mergeCells(2,1,2,end);sh.getCell(2,1).value=`Tahun ajaran ${cfg.schoolYear} | Dicetak ${new Date().toLocaleString('id-ID',{timeZone:'Asia/Jakarta'})} WIB`;sh.mergeCells(3,1,3,end);sh.getCell(3,1).value=`Filter: ${document.querySelector('#from').value||'Awal'} s.d. ${document.querySelector('#to').value||'Akhir'} | Jurusan: ${document.querySelector('#filter-major').value||'Semua'} | Status: ${document.querySelector('#filter-status').selectedOptions[0].text} | Pencarian: ${document.querySelector('#search').value||'-'} | Jumlah: ${rows.length}`;sh.getRow(5).values=['No.',...cols.map(c=>c[1])];rows.forEach((r,i)=>{const row=sh.addRow([i+1,...cols.map(([k])=>k==='status'?states[r[k]]:k.endsWith('_at')?(r[k]?new Date(r[k]).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'}):''):r[k]??'')]);row.height=32;row.eachCell(c=>{c.alignment={vertical:'middle',wrapText:true};c.border={bottom:{style:'thin',color:{argb:'FFDCE2E3'}}};if(i%2===0)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF0F4F6'}}});row.getCell(cols.findIndex(c=>c[0]==='parent_income')+2).numFmt='"Rp" #,##0';});[1,5].forEach(i=>{sh.getRow(i).height=30;sh.getRow(i).eachCell(c=>{c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF132E40'}};c.font={bold:true,color:{argb:'FFFFFFFF'},size:i===1?14:11};c.alignment={vertical:'middle',wrapText:true}})});sh.autoFilter={from:{row:5,column:1},to:{row:Math.max(5,5+rows.length),column:end}};sh.pageSetup={orientation:'landscape',paperSize:9,fitToPage:true,fitToWidth:1,fitToHeight:0,printTitlesRow:'1:5'};const url=URL.createObjectURL(new Blob([await wb.xlsx.writeBuffer()],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));const a=document.createElement('a');a.href=url;a.download=`Rekap-SPMB-DIPSA-${new Date().toISOString().slice(0,10)}.xlsx`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b)return;try{switch(b.dataset.action){case'login':auth();break;case'register':auth(true);break;case'close':modal.close();break;case'logout':check(await db.auth.signOut());user=null;home();break;case'refresh':await load();break;case'detail':detail(b.dataset.id);break;case'export':await excel();break;case'forgot':passwordForm(false);break;case'open-document':await openDocument(b.dataset.path);break;case'print':printReceipt();break}}catch(err){notice(err.message)}});
document.addEventListener('submit',async e=>{e.preventDefault();const f=e.target,button=e.submitter;if(!configured())return;if(!button)return;button.disabled=true;try{const d=Object.fromEntries(new FormData(f));if(f.id==='reset-form'){check(await db.auth.resetPasswordForEmail(d.email,{redirectTo:location.origin+location.pathname}));notice('Jika akun tersedia, tautan pemulihan dikirim ke email Anda.')}else if(f.id==='password-form'){if(d.password!==d.confirm)throw Error('Konfirmasi kata sandi tidak sama.');check(await db.auth.updateUser({password:d.password}));recovery=false;modal.close();await load();notice('Kata sandi berhasil diperbarui.')}else if(f.id==='register-form'){const email=d.email,password=d.password;delete d.password;d.parent_income=Number(d.parent_income);d.graduation_year=Number(d.graduation_year);const signup=check(await db.auth.signUp({email,password,options:{data:{application:d},emailRedirectTo:location.origin+location.pathname}}));modal.close();if(signup.session){await load();notice('Akun berhasil dibuat. Selamat datang di portal SPMB.')}else{user=null;committee=false;profile=null;home();auth();notice('Periksa email Anda untuk konfirmasi pendaftaran, lalu masuk dengan email dan kata sandi yang sama. Jika email sudah terdaftar, gunakan akun tersebut. Periksa folder spam juga.')}}else if(f.id==='login-form'){check(await db.auth.signInWithPassword({email:d.email,password:d.password}));const is=!!check(await db.rpc('is_committee'));if((d.portal==='committee')!==is){await db.auth.signOut();throw Error('Akun tidak memiliki akses untuk portal yang dipilih.')}modal.close();await load()}else if(f.id==='application-form'){d.parent_income=Number(d.parent_income);d.graduation_year=Number(d.graduation_year);d.status=button.value;d.major=d.major||null;if(!f.reportValidity())return;if(d.status==='submitted'&&!d.major)throw Error('Pilih program keahlian sebelum mengirim pendaftaran.');if(d.status==='submitted'&&!confirm('Kirim pendaftaran? Setelah dikirim, data dikunci untuk pemeriksaan panitia.'))return;if(!profile)throw Error('Profil akun belum tersedia. Hubungi pengelola.');check(await db.from('applications').update(d).eq('user_id',user.id).select('user_id').single());notice(d.status==='submitted'?'Pendaftaran berhasil diajukan.':'Draf berhasil disimpan.');await student()}else if(f.id==='decision-form'){check(await db.from('applications').update(d).eq('user_id',f.dataset.id).select('user_id').single());modal.close();notice('Status siswa diperbarui.');await admin()}}catch(err){notice(err.message)}finally{button.disabled=false}});
home();if(db){db.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY'){recovery=true;setTimeout(()=>passwordForm(true),0)}});load();}

function closeMenu(){document.querySelector('#mobileNav').classList.remove('open');document.querySelector('#menuToggle').setAttribute('aria-expanded','false')}
document.querySelector('#menuToggle').addEventListener('click',()=>{const open=document.querySelector('#mobileNav').classList.toggle('open');document.querySelector('#menuToggle').setAttribute('aria-expanded',String(open))});
document.querySelectorAll('#mobileNav a,#mobileNav button').forEach(el=>el.addEventListener('click',closeMenu));
document.querySelector('#year').textContent=new Date().getFullYear();

function passwordForm(update){document.querySelector('#auth-content').innerHTML=`<h2>${update?'Atur kata sandi baru':'Pulihkan akun'}</h2><p id="form-feedback" role="status"></p><form id="${update?'password-form':'reset-form'}">${update?'<label>Kata sandi baru<input name="password" type="password" minlength="10" autocomplete="new-password" required></label><label>Ulangi kata sandi<input name="confirm" type="password" minlength="10" autocomplete="new-password" required></label>':'<label>Email akun<input name="email" type="email" autocomplete="email" required></label>'}<div class="actions"><button>${update?'Simpan kata sandi':'Kirim tautan pemulihan'}</button></div></form>`;if(!modal.open)modal.showModal()}
async function renderDocuments(id,editable,adminView=false){
 const host=adminView?document.querySelector('#auth-content'):document.querySelector('#documents');if(!host)return;
 const panel=adminView?document.createElement('section'):host;if(adminView)host.append(panel);
 panel.innerHTML='<h3>Berkas pendukung</h3><p>Memuat berkas…</p>';
 try{const files=check(await db.storage.from('spmb-documents').list(id,{limit:100}));panel.innerHTML='<h3>Berkas pendukung</h3><p class="muted">PDF, JPG, PNG • maksimal 5 MB per berkas. Berkas tersimpan privat. Kelengkapan akan diperiksa panitia.</p>'+documentTypes.map(([key,label])=>{const found=files.find(x=>x.name.split('.')[0]===key);return `<div class="document-row"><strong>${label}</strong>${found?`<button type="button" class="secondary" data-action="open-document" data-path="${esc(id+'/'+found.name)}">Lihat berkas</button>`:'<span class="muted">Belum diunggah</span>'}${editable?`<label class="upload-label">${found?'Ganti':'Unggah'}<input type="file" data-document="${key}" accept="application/pdf,image/jpeg,image/png"></label>`:''}</div>`}).join('');
 panel.querySelectorAll('[data-document]').forEach(input=>input.addEventListener('change',async()=>{const file=input.files[0];if(!file)return;input.disabled=true;try{const ext={'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png'}[file.type];if(!ext||file.size>5*1024*1024||file.size===0)throw Error('Gunakan PDF, JPG atau PNG dengan ukuran 1 byte sampai 5 MB.');const key=input.dataset.document,path=id+'/'+key+'.'+ext;check(await db.storage.from('spmb-documents').upload(path,file,{upsert:true,contentType:file.type}));const obsolete=files.filter(x=>x.name.split('.')[0]===key&&x.name!==key+'.'+ext).map(x=>id+'/'+x.name);if(obsolete.length)check(await db.storage.from('spmb-documents').remove(obsolete));notice('Berkas berhasil diunggah.');await renderDocuments(id,true)}catch(e){notice(e.message);input.disabled=false}}));
 }catch(e){panel.innerHTML='<h3>Berkas pendukung</h3><p>Berkas belum dapat dimuat. Pastikan migrasi Storage sudah dijalankan.</p>';notice(e.message)}
}
async function openDocument(path){const tab=window.open('about:blank','_blank');try{const data=check(await db.storage.from('spmb-documents').createSignedUrl(path,60));if(tab){tab.opener=null;tab.location=data.signedUrl}else notice('Izinkan popup untuk melihat berkas.')}catch(e){tab?.close();throw e}}
function printReceipt(){if(!profile?.submitted_at)return;document.querySelector('#print-receipt')?.remove();const page=document.createElement('section');page.id='print-receipt';page.innerHTML=`<h1>BUKTI PENDAFTARAN SPMB</h1><h2>SMK DIPSA Purwokerto</h2><p>Tahun ajaran ${esc(cfg.schoolYear)}</p><hr><h3>${esc(profile.registration_number)}</h3><dl>${[['Nama',profile.full_name],['NISN',profile.nisn],['Asal sekolah',profile.school_origin],['Program keahlian',profile.major],['Status',states[profile.status]],['Diajukan',new Date(profile.submitted_at).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'})+' WIB'],['Catatan panitia',profile.decision_note||'—']].map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl><p>Bukti ini merupakan bukti pengajuan. Hasil seleksi mengikuti status dan pengumuman panitia.</p>`;document.body.append(page);window.print()}
