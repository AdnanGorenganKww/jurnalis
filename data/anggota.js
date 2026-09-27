/**
 * Data anggota JURNALISTIK.
 * Setiap anggota wajib punya: id, nama, divisi, foto, kelas, quote, perkenalan.
 * jabatan bersifat opsional.
 *
 * divisi harus salah satu dari:
 * "kreatif" | "desain-grafis" | "editing" | "fotografi" | "videografi" | "artikel"
 */

const anggotaData = [
  {
    id: "anggota-001",
    nama: "Adnan Sya'ban M",
    divisi: "desain-grafis",
    jabatan: "",
    foto: "assets/anggota/desain-grafis/Adnan Sya'ban M.jpg",
    quote: "Gokgok kreatif, gokgok produktif.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Adnan Sya'ban M dari divisi Desain Grafis. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-002",
    nama: "Dita Ayu",
    divisi: "editing",
    jabatan: "",
    foto: "assets/anggota/editing/Dita Ayu.jpg",
    quote: "Foto yang baik bercerita tanpa kata.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Dita Ayu dari divisi Editing. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-003",
    nama: "Azahra Silvi Aulia",
    divisi: "kreatif",
    jabatan: "",
    foto: "assets/anggota/kreatif/Azahra Silvi Aulia.jpg",
    quote: "Gerak menyampaikan apa yang diam tak bisa.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Azahra Silvi Aulia dari divisi Kreatif. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-004",
    nama: "Alya Rubiah",
    divisi: "videografi",
    jabatan: "",
    foto: "assets/anggota/videografi/Alya Rubiah.jpg",
    quote: "Desain adalah cara berpikir yang terlihat.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Alya Rubiah dari divisi Videografi. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-005",
    nama: "Amira Nur Aisya",
    divisi: "fotografi",
    jabatan: "",
    foto: "assets/anggota/fotografi/Amira Nur Aisya.jpg",
    quote: "Rapi di potong, kuat di cerita.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Amira Nur Aisya dari divisi Fotografi. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-006",
    nama: "Qolbi Kahfi",
    divisi: "fotografi",
    jabatan: "",
    foto: "assets/anggota/fotografi/Qolbi Kahfi.jpg",
    quote: "Kata-kata yang tepat mengabadikan makna.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Qolbi Kahfi dari divisi Fotografi. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-007",
    nama: "Aliyyandra Haniya",
    divisi: "fotografi",
    jabatan: "",
    foto: "assets/anggota/fotografi/Aliyyandra Haniya.jpg",
    quote: "Ide adalah awal dari semua yang kita buat.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Aliyyandra Haniya dari divisi Fotografi. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-008",
    nama: "Richie Izzah N",
    divisi: "fotografi",
    jabatan: "",
    foto: "assets/anggota/fotografi/Richie Izzah N.jpg",
    quote: "Setiap momen berharga layak untuk diabadikan.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Richie Izzah N dari divisi Fotografi. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-009",
    nama: "Intan Putri Y",
    divisi: "artikel",
    jabatan: "",
    foto: "assets/anggota/artikel/Intan Putri Y.jpg",
    quote: "Tulisan kecil bisa membawa cerita yang besar.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Intan Putri Y dari divisi Artikel. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-010",
    nama: "Nabil Putra A",
    divisi: "videografi",
    jabatan: "",
    foto: "assets/anggota/videografi/Nabil Putra A.jpg",
    quote: "Di balik setiap video, ada cerita yang ingin disampaikan.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Nabil Putra A dari divisi Videografi. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-011",
    nama: "Missel Vianika A",
    divisi: "desain-grafis",
    jabatan: "",
    foto: "assets/anggota/desain-grafis/Missel Vianika A.jpg",
    quote: "Kreativitas tumbuh saat berani mencoba hal baru.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Missel Vianika A dari divisi Desain Grafis. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-012",
    nama: "Tasya Gracia",
    divisi: "artikel",
    jabatan: "",
    foto: "assets/anggota/artikel/Tasya Gracia.jpg",
    quote: "Merangkai kata adalah caraku menyimpan cerita.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Tasya Gracia dari divisi Artikel. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-013",
    nama: "Riadhatul",
    divisi: "kreatif",
    jabatan: "",
    foto: "assets/anggota/kreatif/Riadhatul.jpg",
    quote: "Ide sederhana bisa menjadi karya luar biasa.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Riadhatul dari divisi Kreatif. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-014",
    nama: "Tia Ristiani",
    divisi: "fotografi",
    jabatan: "",
    foto: "assets/anggota/fotografi/Tia Ristiani.jpg",
    quote: "Belajar melihat keindahan dari sudut yang berbeda.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Tia Ristiani dari divisi Fotografi. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-015",
    nama: "Airra Septialena",
    divisi: "fotografi",
    jabatan: "",
    foto: "assets/anggota/fotografi/Airra Septialena.jpg",
    quote: "Setiap bidikan menyimpan cerita yang tak terulang.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Airra Septialena dari divisi Fotografi. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-016",
    nama: "Sifa Fitriani",
    divisi: "artikel",
    jabatan: "",
    foto: "assets/anggota/artikel/Sifa Fitriani.jpg",
    quote: "Kata-kata membuat cerita tetap hidup.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Sifa Fitriani dari divisi Artikel. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-017",
    nama: "Syifa Fai'zah A",
    divisi: "editing",
    jabatan: "",
    foto: "assets/anggota/editing/Syifa Fai'zah A.jpg",
    quote: "Potongan kecil yang tepat menyusun cerita utuh.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Syifa Fai'zah A dari divisi Editing. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-018",
    nama: "Bunga Zalfa R",
    divisi: "videografi",
    jabatan: "",
    foto: "assets/anggota/videografi/Bunga Zalfa R.jpg",
    quote: "Merekam momen hari ini untuk dikenang esok hari.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Bunga Zalfa R dari divisi Videografi. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-019",
    nama: "Naura Candrakanti",
    divisi: "editing",
    jabatan: "",
    foto: "assets/anggota/editing/Naura Candrakanti.jpg",
    quote: "Kreativitas terasa seru saat dirangkai bersama.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Naura Candrakanti dari divisi Editing. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-020",
    nama: "Kumala Shafyatnnisa",
    divisi: "editing",
    jabatan: "",
    foto: "assets/anggota/editing/Kumala Shafyatnnisa.jpg",
    quote: "Proses yang rapi membantu cerita tersampaikan.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Kumala Shafyatnnisa dari divisi Editing. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  },
  {
    id: "anggota-021",
    nama: "Risma Amalia",
    divisi: "fotografi",
    jabatan: "",
    foto: "assets/anggota/fotografi/Risma Amalia.jpg",
    quote: "Satu foto, banyak cerita yang bisa dibagikan.",
    kelas: "Belum ada data",
    perkenalan: "Halo, aku Risma Amalia dari divisi Fotografi. Senang bisa belajar dan berkarya bersama JURNALISTIK."
  }
];

// Struktur inti (ketua & wakil) dipisah dari anggota divisi
// karena ditampilkan berbeda di anggota.html dan profil.html.
const kepengurusanInti = {
  ketua: {
    nama: "Hanip Ihsan Maulana",
    periode: "JURNALISTIK 2026/2027",
    foto: "assets/anggota/Hanip Ihsan Maulana.jpg"
  },
  wakilKetua: {
    nama: "Faisal Awara",
    foto: "assets/anggota/Faisal Awara.jpg"
  }
};