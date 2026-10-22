/* ===== Konfigurasi & data (ganti sesuai data resmi madrasah) ===== */
const AI_ENDPOINT = "";              // isi URL proxy server bila Tanya AI tersambung layanan AI sungguhan (jangan taruh kunci API di sini)
const ALUMNI_ENDPOINT = "";          // isi URL layanan formulir (mis. Google Apps Script) agar data alumni tersimpan

/* Prestasi: dihimpun dari situs resmi mtsn2skh.sch.id dan Kanwil Kemenag Jateng.
   Tambah data baru cukup dengan menyalin satu baris. juara = "Juara 1", "Juara 2", dst. */
const DATA_PRESTASI = [
  {lomba:"Olimpiade Sains Nasional (OSN)", tingkat:"Nasional", tahun:2025, juara:"Juara 1", peraih:"Dirga Anugrah Nur Affandi", kelas:"VII F2"},
  {lomba:"KASM 2025 - Cabang IPA", tingkat:"Kabupaten", tahun:2025, juara:"Juara 1", peraih:"Qonita Nur Hanifah", kelas:"VII G"},
  {lomba:"KASM 2025 - Cabang Matematika", tingkat:"Kabupaten", tahun:2025, juara:"Juara 1", peraih:"Naufal Farzana Wafiy", kelas:"VIII A"},
  {lomba:"KASM 2025 - Cabang IPA", tingkat:"Kabupaten", tahun:2025, juara:"Juara 2", peraih:"Sadewa Satria Syailendra", kelas:"VII E"},
  {lomba:"KASM 2025 - Cabang Matematika", tingkat:"Kabupaten", tahun:2025, juara:"Juara 2", peraih:"Rafanda Kirana Azzahra", kelas:"VII G"},
  {lomba:"Kompetisi Agama dan Sains Madrasah (KASM) 2025", tingkat:"Kabupaten", tahun:2025, juara:"Juara Umum", peraih:"Kontingen MTsN 2 Sukoharjo"},
  {lomba:"Mini Grand Champion Allievo Futsal Championship", tingkat:"Provinsi", tahun:2025, juara:"Juara 2", peraih:"Tim Futsal MTsN 2 Sukoharjo"},
  {lomba:"Prestasi terbanyak se-Kabupaten Sukoharjo", tingkat:"Kabupaten", tahun:2025, juara:"Peringkat 2", peraih:"MTsN 2 Sukoharjo"},
  {lomba:"ISTEC 2026 - Robotik (Grand Final)", tingkat:"Internasional", tahun:2026, juara:"Juara 2", peraih:"Tim Robotik MTsN 2 Sukoharjo"},
  {lomba:"ISTEC 2026 - Robotik (Grand Final)", tingkat:"Internasional", tahun:2026, juara:"Juara 3", peraih:"Tim Robotik MTsN 2 Sukoharjo"}
];
/* Galeri kegiatan. src = foto (boleh alamat internet atau file di folder images/).
   fallback = gambar cadangan bila foto gagal dimuat. Untuk foto sendiri: taruh file di images/kegiatan/
   lalu tulis src:"images/kegiatan/nama-file.jpg". */
const K = "https://jateng.kemenag.go.id/wp-content/uploads/2026/05/";
const DATA_GALERI = [
  {src:K+"Mts-01.jpg", fallback:"images/galeri-1.svg", cap:"Tim robotik di ISTEC 2026, Bali"},
  {src:K+"Mts-02.jpg", fallback:"images/galeri-2.svg", cap:"Delegasi MTsN 2 Sukoharjo di ISTEC 2026"},
  {src:K+"Mts-03.jpg", fallback:"images/galeri-3.svg", cap:"Juara 2 dan 3 robotik internasional"},
  {src:K+"5.png",      fallback:"images/galeri-4.svg", cap:"Dokumentasi prestasi ISTEC 2026"},
  {src:"images/galeri-1.svg", cap:"Upacara bendera"}, {src:"images/galeri-2.svg", cap:"Kegiatan Pramuka"},
  {src:"images/galeri-5.svg", cap:"Pentas seni"}, {src:"images/galeri-6.svg", cap:"Praktikum sains"}
];
const KB = [ // basis pengetahuan Tanya AI (jawaban hanya dari info resmi madrasah)
  {k:["profil","sejarah","visi","misi","tentang"], j:"MTsN 2 Sukoharjo adalah madrasah tsanawiyah negeri di Sukoharjo, Jawa Tengah. Visinya: Madrasah Digital, Cerdas Berteknologi, Berakhlak Mulia."},
  {k:["fasilitas","aula","mushala","lab","laboratorium","perpustakaan","kelas"], j:"Fasilitas kami: aula, mushala, lab komputer, perpustakaan, lab IPA, dan ruang kelas."},
  {k:["prestasi","juara","lomba","olimpiade"], j:"Prestasi siswa tercantum di bagian Prestasi, bisa disaring menurut tingkat. Di antaranya Juara 2 dan 3 robotik internasional ISTEC 2026, Juara 1 OSN, dan Juara Umum KASM 2025 tingkat Kabupaten Sukoharjo."},
  {k:["kontak","alamat","telepon","whatsapp","wa","lokasi","peta"], j:"Madrasah beralamat di Jl. KH. Agus Salim No. 48, Sukoharjo. Peta dan WhatsApp ada di bagian Kontak di bawah halaman."},
  {k:["alumni"], j:"Alumni dapat mengisi formulir di bagian Data Alumni."}
];
const FALLBACK = "Maaf, informasi itu belum ada pada data saya. Silakan hubungi madrasah lewat bagian Kontak.";
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const kurangiGerak = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Gambar cadangan bila foto dari internet gagal dimuat ===== */
addEventListener("error", e => {
  const im = e.target;
  if(im.tagName === "IMG" && im.dataset.fallback && !im.dataset.fb){ im.dataset.fb = "1"; im.src = im.dataset.fallback; }
}, true);

/* ===== Mode terang / gelap ===== */
function setTema(t){
  document.documentElement.dataset.theme = t;
  try{ localStorage.setItem("tema", t); }catch(e){}
  $$("[data-tema] use").forEach(u => u.setAttribute("href", t === "dark" ? "#i-sun" : "#i-moon"));
}
setTema(document.documentElement.dataset.theme);
$$("[data-tema]").forEach(b => b.addEventListener("click", () => setTema(document.documentElement.dataset.theme === "dark" ? "light" : "dark")));

/* ===== Halaman Mulai ===== */
const splash = $("#splash");
$$("#nav, #konten, .foot").forEach(e => e.inert = true);
$("#mulai").addEventListener("click", () => {
  splash.classList.add("keluar");
  document.body.classList.remove("splash-aktif");
  $$("#nav, #konten, .foot").forEach(e => e.inert = false);
  setTimeout(() => splash.remove(), 350);
  mulaiAnimasi();
});

/* ===== Navbar: hamburger & penanda menu aktif ===== */
const menu = $("#menu"), burger = $("#burger");
burger.addEventListener("click", () => {
  const b = menu.classList.toggle("buka");
  burger.setAttribute("aria-expanded", b);
  $("use", burger).setAttribute("href", b ? "#i-x" : "#i-menu");
});
$$("#menu a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("buka"); burger.setAttribute("aria-expanded", false); $("use", burger).setAttribute("href", "#i-menu"); }));
const navObs = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting) $$("#menu a").forEach(a => a.classList.toggle("aktif", a.getAttribute("href") === "#" + e.target.id));
}), {rootMargin:"-45% 0px -50% 0px"});
$$("main > section").forEach(s => navObs.observe(s));

/* ===== Animasi gulir, penghitung angka, tombol ke atas ===== */
function mulaiAnimasi(){
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if(!e.isIntersecting) return;
    e.target.classList.add("tampil"); obs.unobserve(e.target);
    $$("[data-hitung]", e.target).forEach(hitung);
  }), {threshold:.15});
  $$(".reveal").forEach(el => obs.observe(el));
}
function hitung(el){
  const akhir = +el.dataset.hitung; if(kurangiGerak){ el.textContent = akhir; return; }
  const t0 = performance.now();
  (function f(t){ const p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(akhir * p); if(p < 1) requestAnimationFrame(f); })(t0);
}
const btnTop = $("#top");
addEventListener("scroll", () => btnTop.classList.toggle("tampil", scrollY > 600), {passive:true});
btnTop.addEventListener("click", () => scrollTo({top:0}));
if(kurangiGerak) $$(".reveal").forEach(e => e.classList.add("tampil"));

/* ===== Prestasi (filter tingkat) ===== */
const URUT = ["Internasional", "Nasional", "Provinsi", "Kabupaten"]; // urutan tampil & tombol filter
const filter = $("#filter"), daftar = $("#daftarPrestasi");
function tampilPrestasi(t){
  daftar.innerHTML = "";
  [...DATA_PRESTASI].sort((a, b) => URUT.indexOf(a.tingkat) - URUT.indexOf(b.tingkat) || b.tahun - a.tahun).filter(p => t === "Semua" || p.tingkat === t).forEach((p, i) => {
    const li = document.createElement("li"); li.style.animationDelay = i * 90 + "ms";
    li.innerHTML = `<span class="medali"></span><div><small class="meta"></small><b class="lomba"></b><p class="peraih"></p></div>`;
    const m = $(".medali", li); m.textContent = p.juara;
    if(/1$/.test(p.juara) || /Umum/.test(p.juara)) m.classList.add("emas"); else if(/2$/.test(p.juara)) m.classList.add("perak"); else if(/3$/.test(p.juara)) m.classList.add("perunggu");
    $(".meta", li).textContent = `${p.tingkat} · ${p.tahun}`;
    $(".lomba", li).textContent = p.lomba;
    $(".peraih", li).textContent = p.kelas ? `${p.peraih} (${p.kelas})` : p.peraih;
    daftar.append(li);
  });
  $$("button", filter).forEach(b => b.setAttribute("aria-pressed", b.textContent === t));
}
["Semua", ...URUT.filter(t => DATA_PRESTASI.some(p => p.tingkat === t))].forEach(t => {
  const b = document.createElement("button"); b.textContent = t; b.addEventListener("click", () => tampilPrestasi(t)); filter.append(b);
});
tampilPrestasi("Semua");

/* ===== Galeri & lightbox ===== */
const lb = $("#lb"); let idx = 0, pemicu;
DATA_GALERI.forEach((g, i) => {
  const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Perbesar foto: " + g.cap);
  b.innerHTML = `<img loading="lazy" alt="" referrerpolicy="no-referrer"><span></span>`;
  const im = $("img", b); im.alt = g.cap; if(g.fallback) im.dataset.fallback = g.fallback; im.src = g.src; $("span", b).textContent = g.cap;
  b.addEventListener("click", () => { pemicu = b; buka(i); }); $("#galeri").append(b);
});
function buka(i){ idx = (i + DATA_GALERI.length) % DATA_GALERI.length; const li = $("#lbImg"); delete li.dataset.fb; li.dataset.fallback = DATA_GALERI[idx].fallback || ""; li.src = DATA_GALERI[idx].src; $("#lbImg").alt = $("#lbCap").textContent = DATA_GALERI[idx].cap; lb.hidden = false; $("#lbTutup").focus(); }
function tutup(){ lb.hidden = true; pemicu && pemicu.focus(); }
$("#lbTutup").addEventListener("click", tutup);
lb.addEventListener("click", e => { if(e.target === lb) tutup(); });
addEventListener("keydown", e => { if(lb.hidden) return; if(e.key === "Escape") tutup(); if(e.key === "ArrowRight") buka(idx + 1); if(e.key === "ArrowLeft") buka(idx - 1); });

/* ===== Tanya AI (FR-11) ===== */
const pesan = $("#pesan");
function tambah(teks, kelas){ const p = document.createElement("p"); p.className = kelas; p.textContent = teks; pesan.append(p); pesan.scrollTop = pesan.scrollHeight; return p; }
async function jawab(q){
  if(AI_ENDPOINT){
    const r = await fetch(AI_ENDPOINT, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({pertanyaan:q})});
    if(!r.ok) throw new Error("gagal"); return (await r.json()).jawaban;
  }
  const kata = q.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/);
  const h = KB.find(e => e.k.some(k => kata.includes(k)));
  return h ? h.j : FALLBACK;
}
async function tanya(q){
  q = q.trim(); if(!q) return;
  tambah(q, "user"); const s = tambah("Sedang memuat jawaban...", "bot");
  try{ const j = await jawab(q); setTimeout(() => s.textContent = j, kurangiGerak ? 0 : 500); }
  catch(e){ s.textContent = "Layanan sedang bermasalah. Coba lagi nanti atau hubungi madrasah lewat bagian Kontak."; }
}
$("#formAi").addEventListener("submit", e => { e.preventDefault(); const i = $("#tanya"); tanya(i.value); i.value = ""; });
["Apa saja fasilitasnya?", "Bagaimana visi madrasah?", "Di mana alamat madrasah?"].forEach(q => {
  const b = document.createElement("button"); b.type = "button"; b.textContent = q; b.addEventListener("click", () => tanya(q)); $("#cepat").append(b);
});

/* ===== Formulir alumni (FR-12) ===== */
const th = $("#a-tahun"); th.innerHTML = '<option value="">Pilih tahun</option>';
for(let y = new Date().getFullYear(); y >= 1995; y--) th.add(new Option(y, y));
const form = $("#formAlumni");
function galat(id, msg){ $(`[data-for="${id}"]`).textContent = msg; const el = $("#" + id); el.setAttribute("aria-invalid", !!msg); return !msg; }
form.addEventListener("submit", async e => {
  e.preventDefault();
  const kontak = $("#a-kontak").value.trim();
  const ok = [
    galat("a-nama", $("#a-nama").value.trim().length < 3 ? "Isi nama lengkap (minimal 3 huruf)." : ""),
    galat("a-tahun", th.value ? "" : "Pilih tahun lulus."),
    galat("a-kontak", /^\S+@\S+\.\S+$/.test(kontak) || /^(\+62|62|0)8\d{7,12}$/.test(kontak.replace(/[\s-]/g, "")) ? "" : "Isi email atau nomor WhatsApp yang valid."),
    galat("a-setuju", $("#a-setuju").checked ? "" : "Centang persetujuan untuk melanjutkan.")
  ].every(Boolean);
  if(!ok) return;
  const data = Object.fromEntries(new FormData(form));
  const info = $("#alumniOk");
  try{
    if(ALUMNI_ENDPOINT) await fetch(ALUMNI_ENDPOINT, {method:"POST", body:JSON.stringify(data)});
    info.textContent = "Terima kasih, data Anda sudah terkirim."; info.hidden = false; form.reset();
  }catch(err){ info.textContent = "Data belum terkirim. Periksa koneksi lalu coba lagi."; info.hidden = false; }
});
