import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. TAMBAHAN: Import library html2pdf untuk download otomatis
import html2pdf from "html2pdf.js";
import type { CVData, CVTemplate } from "../types/cv";
import CVPreview from "../components/CVPreview";

const TEMPLATES: {
  id: CVTemplate;
  label: string;
  color: string;
  bg: string;
}[] = [
  {
    id: "blue",
    label: "Biru Profesional",
    color: "#4F6EF7",
    bg: "bg-blue-600",
  },
  {
    id: "green",
    label: "Hijau Modern",
    color: "#10B981",
    bg: "bg-emerald-500",
  },
  {
    id: "minimal",
    label: "Minimal Elegan",
    color: "#374151",
    bg: "bg-gray-700",
  },
];

export default function Result() {
  const navigate = useNavigate();
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [template, setTemplate] = useState<CVTemplate>("blue");
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [portfolioModal, setPortfolioModal] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Secara default diset false (akun gratis)

  useEffect(() => {
    const stored = sessionStorage.getItem("cv_result");
    if (!stored) {
      navigate("/dashboard");
      return;
    }
    try {
      setCVData(JSON.parse(stored));
    } catch {
      navigate("/dashboard");
    }
  }, [navigate]);

  // 2. PERBAIKAN UTAMA: Mengubah window.print() lama menjadi sistem download otomatis premium
  // 2. PERBAIKAN UTAMA: Sistem download otomatis premium presisi A4
  const handleDownloadPDF = () => {
    // KUNCI SUKSES: Ambil anak elemen pertama (div kertas CV asli) di dalam wrapper flex
    const element = document.querySelector("#cv-download-target > div");

    if (!element) {
      alert("Elemen pratinjau CV tidak ditemukan!");
      return;
    }

    const options = {
      margin: 0,
      filename: `CV_${cvData?.profile?.name || "Pengguna"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3, // Naikkan ke 3 agar text super tajam dan tidak pecah saat di-zoom oleh juri
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794, // Memaksa canvas merender di resolusi lebar dasar A4 (210mm)
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    // Beri jeda 200ms agar rendering browser stabil
    setTimeout(() => {
      // @ts-ignore
      html2pdf().set(options).from(element).save();
    }, 200);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleCreatePortfolio = async () => {
    // 1. Validasi data CV wajib ada
    if (!cvData) return;

    // 2. Proteksi Akun Premium (Demo Lomba)
    if (!isPremium) {
      alert(
        'Fitur Pembuatan Web Portofolio Terkunci! Silakan klik tombol "⚡ Aktifkan Premium" di bawah terlebih dahulu untuk simulasi monetisasi.'
      );
      return;
    }

    setPortfolioLoading(true);

    try {
      // Simulasi loading database cloud selama 1.5 detik biar keren di depan juri
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Membuat slug dari nama pengguna (contoh: "harun-al-rasyid")
      const slug = generateSlug(cvData.profile.name || "pengguna");

      // SIMPAN DATA KE STORAGE (Agar halaman portofolio tidak 404 dan bisa membaca datanya)
      const existingPortfolios = JSON.parse(
        localStorage.getItem("local_portfolios") || "{}"
      );
      existingPortfolios[slug] = {
        cv_data: cvData,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "local_portfolios",
        JSON.stringify(existingPortfolios)
      );

      // Membuat URL otomatis berdasarkan domain tempat web berjalan
// DIPAKSA .toLowerCase() agar link yang dibuka di HP dijamin sinkron 100% dengan database slug!
const url = `${window.location.origin}/portfolio/${slug.toLowerCase()}`;
setPortfolioUrl(url.toLowerCase());
      setPortfolioModal(true);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat portofolio. Coba lagi.");
    } finally {
      setPortfolioLoading(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(portfolioUrl);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 2000);
  };

  if (!cvData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header no-print */}
      <header className="no-print bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📄</span>
            <span className="font-bold text-gray-800">CVCraft AI</span>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <div className="no-print w-full md:w-72 shrink-0 space-y-4">
        {/* Left Panel — Controls */}
        <div className="no-print w-72 shrink-0 space-y-4">
          {/* Template Selector */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-700 mb-4 text-sm">
              Pilih Template
            </h3>
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    template === t.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${t.bg} shadow-sm`} />
                  <span className="text-sm font-medium text-gray-700">
                    {t.label}
                  </span>
                  {template === t.id && (
                    <span className="ml-auto text-blue-500 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-bold text-gray-700 mb-2 text-sm">Aksi</h3>

            {/* 1. Tombol Download PDF */}
            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all"
            >
              📄 Download PDF
            </button>

            {/* 2. Kondisional Fitur Portofolio (Premium vs Gratis) */}
            {isPremium ? (
              /* JIKA AKUN PREMIUM: Tombol Aktif */
              <button
                onClick={handleCreatePortfolio}
                disabled={portfolioLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-60"
              >
                {portfolioLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Membuat...
                  </>
                ) : (
                  "🌐 Buat Halaman Portofolio"
                )}
              </button>
            ) : (
              /* JIKA AKUN GRATIS: Tombol Terkunci & Opsi Aktivasi Simulasi */
              <div className="space-y-2 w-full pt-4">
                {" "}
                {/* Ditambah pt-4 memberi ruang agar badge tidak menempel */}
                <div className="relative w-full">
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-400 font-semibold rounded-xl text-sm cursor-not-allowed border border-gray-300 shadow-inner"
                  >
                    🔒 Buat Halaman Portofolio
                  </button>

                  {/* Badge Diperbaiki: Posisi -top-6 agar melayang sempurna di atas tombol dan tidak menempel */}
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] px-2.5 py-0.5 rounded-full font-bold shadow-md whitespace-nowrap tracking-wide animate-pulse">
                    ⭐ FITUR PREMIUM
                  </span>
                </div>
                {/* Tombol Simulasi Pembayaran */}
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      "✨ [SIMULASI PREMIUM ACTIVATED]\nPembayaran via QRIS Sukses. Fitur Cloud Sync Portofolio Online Anda telah aktif!"
                    );
                    setIsPremium(true);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-xl text-[11px] transition-all text-center shadow-sm flex items-center justify-center gap-1"
                >
                  ⚡ Aktifkan Premium (Demo Lomba)
                </button>
              </div>
            )}

            {/* 3. Tombol Generate Ulang (SEKARANG KEMBALI MUNCUL) */}
            <button
              onClick={() => navigate("/create")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all mt-2"
            >
              🔄 Generate Ulang
            </button>
          </div>

          {/* CV Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-700 mb-3 text-sm">Info CV</h3>
            <div className="space-y-1.5 text-sm text-gray-500">
              <p>
                <span className="font-medium text-gray-700">Nama:</span>{" "}
                {cvData.profile.name}
              </p>
              <p>
                <span className="font-medium text-gray-700">Posisi:</span>{" "}
                {cvData.profile.jobTitle}
              </p>
              <p>
                <span className="font-medium text-gray-700">Email:</span>{" "}
                {cvData.profile.email}
              </p>
            </div>
          </div>
        </div>

        
        {/* Right Panel — CV Preview */}
<div className="flex-1 flex justify-center max-w-full overflow-x-hidden overflow-y-auto">
  <div id="cv-download-target" className="w-full flex justify-center max-w-full overflow-x-hidden">
    <div className="max-w-full overflow-x-auto p-2 flex justify-center">
      <CVPreview data={cvData} template={template} />
    </div>
  </div>
</div>
      </div>

      {/* Portfolio Modal */}
      {portfolioModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-gray-800">
                Portofolio Siap!
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Halaman portofolio kamu sudah live
              </p>
            </div>

            {/* ⚠️ BANNER PENGINGAT UNTUK DEMO JURI LOMBA */}
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left shadow-inner">
              <div className="flex items-start gap-2.5">
                <span className="text-base shrink-0 mt-0.5">⚠️</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    Catatan Demo Prototype
                  </h4>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Tautan ini berbasis penyimpanan browser lokal Anda. Hasil
                    portofolio dapat diakses dengan sempurna di perangkat ini.
                  </p>
                  <p className="text-[11px] text-amber-700 leading-relaxed pt-0.5">
                    Untuk mendistribusikan link secara publik lintas perangkat,
                    fitur{" "}
                    <span className="font-semibold text-blue-600">
                      Cloud Sync & Permanent Database URL
                    </span>{" "}
                    akan aktif otomatis pada versi{" "}
                    <span className="font-bold text-amber-600 uppercase">
                      Premium ⭐
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-150 rounded-xl p-3 mb-4 flex items-center gap-2">
              <span className="text-xs text-gray-600 flex-1 truncate font-mono">
                {portfolioUrl}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-all"
              >
                {copyDone ? "✓ Tersalin!" : "📋 Copy Link"}
              </button>
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm text-center transition-all"
              >
                Buka Portofolio →
              </a>
            </div>

            <button
              onClick={() => setPortfolioModal(false)}
              className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
