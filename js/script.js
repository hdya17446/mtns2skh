/* ===== Konfigurasi & data (ganti sesuai data resmi madrasah) ===== */
const AI_ENDPOINT = "";              // isi URL proxy server bila Tanya AI tersambung layanan AI sungguhan (jangan taruh kunci API di sini)
const ALUMNI_ENDPOINT = "";          // isi URL layanan formulir (mis. Google Apps Script) agar data alumni tersimpan

const DATA_PRESTASI = [ // DATA CONTOH
  {lomba:"Olimpiade Sains Madrasah (IPA)", tingkat:"Kabupaten", tahun:2025, peraih:"Nama siswa (contoh)"},
  {lomba:"Musabaqah Tilawatil Qur'an", tingkat:"Provinsi", tahun:2025, peraih:"Nama siswa (contoh)"},
  {lomba:"Kompetisi Sains Madrasah (Matematika)", tingkat:"Nasional", tahun:2024, peraih:"Nama siswa (contoh)"},
  {lomba:"Lomba Pidato Bahasa Arab", tingkat:"Kabupaten", tahun:2024, peraih:"Nama siswa (contoh)"},
  {lomba:"Pekan Olahraga Madrasah (Futsal)", tingkat:"Provinsi", tahun:2024, peraih:"Tim futsal (contoh)"}
];
const DATA_GALERI = [
  {src:"images/galeri-1.svg", cap:"Upacara bendera"}, {src:"images/galeri-2.svg", cap:"Kegiatan Pramuka"},
  {src:"images/galeri-3.svg", cap:"Pekan olahraga"}, {src:"images/galeri-4.svg", cap:"Tilawah dan tahfidz"},
  {src:"images/galeri-5.svg", cap:"Pentas seni"}, {src:"images/galeri-6.svg", cap:"Praktikum sains"}
];
const KB = [ // basis pengetahuan Tanya AI (jawaban hanya dari info resmi madrasah)
  {k:["profil","sejarah","visi","misi","tentang"], j:"MTsN 2 Sukoharjo adalah madrasah tsanawiyah negeri di Sukoharjo, Jawa Tengah. Visinya: Madrasah Digital, Cerdas Berteknologi, Berakhlak Mulia."},
  {k:["fasilitas","aula","mushala","lab","laboratorium","perpustakaan","kelas"], j:"Fasilitas kami: aula, mushala, lab komputer, perpustakaan, lab IPA, dan ruang kelas."},
  {k:["prestasi","juara","lomba","olimpiade"], j:"Prestasi siswa tercantum di bagian Prestasi, bisa disaring menurut tingkat."},
  {k:["kontak","alamat","telepon","whatsapp","wa","lokasi","peta"], j:"Alamat, peta, dan WhatsApp ada di bagian Kontak di bawah halaman."},
  {k:["alumni"], j:"Alumni dapat mengisi formulir di bagian Data Alumni."}
];
const FALLBACK = "Maaf, informasi itu belum ada pada data saya. Silakan hubungi madrasah lewat bagian Kontak.";
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const kurangiGerak = matchMedia("(prefers-reduced-motion: reduce)").matches;

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
const filter = $("#filter"), daftar = $("#daftarPrestasi");
function tampilPrestasi(t){
  daftar.innerHTML = "";
  DATA_PRESTASI.filter(p => t === "Semua" || p.tingkat === t).forEach((p, i) => {
    const li = document.createElement("li"); li.style.animationDelay = i * 120 + "ms";
    li.innerHTML = `<b></b><small></small><p></p>`;
    $("b", li).textContent = p.lomba; $("small", li).textContent = `${p.tingkat}, ${p.tahun}`; $("p", li).textContent = p.peraih;
    daftar.append(li);
  });
  $$("button", filter).forEach(b => b.setAttribute("aria-pressed", b.textContent === t));
}
["Semua", ...new Set(DATA_PRESTASI.map(p => p.tingkat))].forEach(t => {
  const b = document.createElement("button"); b.textContent = t; b.addEventListener("click", () => tampilPrestasi(t)); filter.append(b);
});
tampilPrestasi("Semua");

/* ===== Galeri & lightbox ===== */
const lb = $("#lb"); let idx = 0, pemicu;
DATA_GALERI.forEach((g, i) => {
  const b = document.createElement("button"); b.setAttribute("aria-label", "Perbesar foto: " + g.cap);
  b.innerHTML = `<img loading="lazy" alt="" src="${g.src}">`; $("img", b).alt = g.cap;
  b.addEventListener("click", () => { pemicu = b; buka(i); }); $("#galeri").append(b);
});
function buka(i){ idx = (i + DATA_GALERI.length) % DATA_GALERI.length; $("#lbImg").src = DATA_GALERI[idx].src; $("#lbImg").alt = $("#lbCap").textContent = DATA_GALERI[idx].cap; lb.hidden = false; $("#lbTutup").focus(); }
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
