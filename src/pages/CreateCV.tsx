import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { CVFormData } from "../types/cv";
import { defaultFormData } from "../types/cv";

const DRAFT_KEY = "cv_form_draft";
const STEPS = [
  "Data Pribadi",
  "Pendidikan",
  "Pengalaman",
  "Keahlian",
  "Generate AI",
];

export default function CreateCV() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CVFormData>(defaultFormData);
  const [draftSaved, setDraftSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasDraft, setHasDraft] = useState(false);

  // State tambahan untuk animasi tombol AI Polish
  const [polishingExp, setPolishingExp] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        setForm(JSON.parse(draft));
        setHasDraft(true);
      } catch {}
    }
  }, []);

  // Auto-save to localStorage
  const saveDraft = useCallback((data: CVFormData) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  }, []);

  const updateForm = (updates: Partial<CVFormData>) => {
    const next = { ...form, ...updates };
    setForm(next);
    saveDraft(next);
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setForm(defaultFormData);
    setHasDraft(false);
    setStep(0);
  };

  // ==========================================
  // FITUR: ATS SCORE CHECKER (Dinamis & Real-time)
  // ==========================================
  const atsScoreData = useMemo(() => {
    let score = 20;
    const tips: string[] = [];

    if (form.name && form.jobTitle && form.email) {
      score += 20;
    } else {
      tips.push("Lengkapi data profil utama (Nama, Email, Jabatan).");
    }

    if (form.institution && form.degree) {
      score += 15;
    } else {
      tips.push("Tambahkan riwayat pendidikan terakhir kamu.");
    }

    if (form.company && form.position) {
      score += 15;
      if (form.experiencePoints && form.experiencePoints.length > 30) {
        score += 15;
      } else {
        tips.push("Tulis deskripsi pencapaian pengalaman kerja lebih detail.");
      }
    } else {
      tips.push("Tambahkan riwayat pengalaman kerja minimum 1 entri.");
    }

    if (form.technicalSkills && form.technicalSkills.split(",").length >= 3) {
      score += 10;
    } else {
      tips.push("Masukkan minimal 3 Technical Skills yang relevan.");
    }

    if (form.softSkills) {
      score += 5;
    }

    return {
      score,
      currentTip: tips[0] || "CV kamu sudah sangat optimal & ATS-Friendly! ✨",
    };
  }, [form]);

  // ==========================================
  // FITUR: EXPORT DATA KE JSON
  // ==========================================
  const exportToJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(form, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `CVCraft_Backup_${form.name || "User"}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // ==========================================
  // FITUR: IMPORT DATA DARI JSON
  // ==========================================
  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json && typeof json === "object") {
          setForm(json);
          localStorage.setItem(DRAFT_KEY, JSON.stringify(json));
          setHasDraft(true);
          alert("✨ Data CV berhasil dipulihkan dari backup!");
        }
      } catch (err) {
        alert("❌ Gagal membaca file. Pastikan format file .json kamu benar.");
      }
    };
    reader.readAsText(file);
  };

  // ==========================================
  // FITUR: AI POLISH / AI ENHANCE FUNCTION
  // ==========================================
  const handleAIPolishExperience = async () => {
    if (!form.experiencePoints) return;
    setPolishingExp(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const lines = form.experiencePoints
      .split("\n")
      .map((l) => l.replace(/^[-•*]\s*/, "").trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setPolishingExp(false);
      return;
    }

    const polishedLines = lines.map((line) => {
      const lower = line.toLowerCase();
      if (
        lower.includes("buat") ||
        lower.includes("bikin") ||
        lower.includes("membangun") ||
        lower.includes("web") ||
        lower.includes("dev") ||
        lower.includes("sistem")
      ) {
        return "• Merancang dan mengonstruksi arsitektur sistem utama guna mengoptimalkan performa operasional.";
      }
      if (
        lower.includes("jual") ||
        lower.includes("sales") ||
        lower.includes("narget") ||
        lower.includes("toko") ||
        lower.includes("marketing")
      ) {
        return "• Mengakselerasi pertumbuhan volume penjualan secara signifikan melalui strategi penetrasi pasar yang agresif.";
      }
      if (
        lower.includes("ngajar") ||
        lower.includes("guru") ||
        lower.includes("didik") ||
        lower.includes("latih")
      ) {
        return "• Mengorkestrasikan program pembelajaran interaktif yang terbukti meningkatkan retensi pemahaman peserta.";
      }
      if (
        lower.includes("desain") ||
        lower.includes("gambar") ||
        lower.includes("edit") ||
        lower.includes("konten") ||
        lower.includes("video")
      ) {
        return "• Memvisualisasikan konsep kreatif ke dalam aset digital multi-platform guna memperkuat identitas brand.";
      }
      if (
        lower.includes("urus") ||
        lower.includes("kelola") ||
        lower.includes("bantu") ||
        lower.includes("data") ||
        lower.includes("admin")
      ) {
        return `• Menyelaraskan efisiensi tata kelola administrasi operasional serta akurasi manajemen data pada aspek: ${line}.`;
      }
      return `• Mengintegrasikan pendekatan terukur untuk memaksimalkan hasil eksekusi pada bagian: ${line}.`;
    });

    updateForm({ experiencePoints: polishedLines.join("\n") });
    setPolishingExp(false);
  };

  // ==========================================================
  // LOGIKA DINAMIS PLACEHOLDER MULTI-JOB (Bukan Cuma Developer)
  // ==========================================================
  const getDynamicPlaceholders = (jobTitle: string) => {
    const title = (jobTitle || "").toLowerCase();

    if (
      title.includes("guru") ||
      title.includes("teach") ||
      title.includes("dosen") ||
      title.includes("pendidik") ||
      title.includes("tutor")
    ) {
      return {
        technical:
          "Kurikulum Merdeka, Manajemen Kelas, Penyusunan Modul, Canva for Education, Google Classroom",
        soft: "Empati, Komunikasi Publik, Kesabaran, Manajemen Waktu, Kepemimpinan",
        achievements:
          "Juara 1 Guru Berprestasi Tingkat Provinsi 2024\nSertifikasi Pendidik Kemendikbud",
        expPlaceholder:
          "Jelaskan pengalaman mengajar Anda.\n\nContoh:\n- Menyusun modul ajar interaktif untuk 40+ siswa\n- Meningkatkan rata-rata nilai ujian kelas sebesar 15%\n- Mengoordinasikan kegiatan ekstrakurikuler",
      };
    }

    if (
      title.includes("sales") ||
      title.includes("market") ||
      title.includes("jual") ||
      title.includes("admin") ||
      title.includes("sosmed") ||
      title.includes("media") ||
      title.includes("cs") ||
      title.includes("customer")
    ) {
      return {
        technical:
          "Negosiasi, Copywriting, Microsoft Excel, CRM Tools, Google Ads, Manajemen Inventaris",
        soft: "Persuasi, Berorientasi Target, Komunikasi Interpersonal, Negosiasi, Manajemen Komplain",
        achievements:
          "Mencapai Target Penjualan Bulanan Sebesar 120%\nMenangani 50+ komplain pelanggan per hari dengan kepuasan 95%",
        expPlaceholder:
          "Jelaskan pengalaman kerja Anda di bidang operasional/pemasaran.\n\nContoh:\n- Meningkatkan konversi penjualan retail toko sebesar 20%\n- Mengelola administrasi pembukuan harian secara presisi\n- Merancang konten mingguan untuk menaikkan engagement instagram",
      };
    }

    if (
      title.includes("desain") ||
      title.includes("design") ||
      title.includes("art") ||
      title.includes("editor") ||
      title.includes("video") ||
      title.includes("writer") ||
      title.includes("penulis")
    ) {
      return {
        technical:
          "Adobe Photoshop, Figma, Premiere Pro, Copywriting, SEO, Wireframing, Brand Identity",
        soft: "Berpikir Kreatif, Perhatian Terhadap Detail, Menerima Kritik, Kolaborasi Tim",
        achievements:
          "Merancang Rebranding Identitas Visual Perusahaan yang Lolos ke Tingkat Nasional",
        expPlaceholder:
          "Jelaskan proyek desain atau kreatif yang pernah Anda buat.\n\nContoh:\n- Membuat 20+ aset visual marketing bulanan\n- Merancang ulang (redesign) interface aplikasi mobile untuk mempermudah user\n- Menulis artikel SEO-friendly dengan total 10k+ pembaca",
      };
    }

    if (
      title.includes("akuntan") ||
      title.includes("accounting") ||
      title.includes("keuangan") ||
      title.includes("finance") ||
      title.includes("pajak") ||
      title.includes("data") ||
      title.includes("analyst")
    ) {
      return {
        technical:
          "Laporan Keuangan, Accurate Software, SAP, Analisis Data, Microsoft Excel (VLOOKUP/Pivot), Pajak PPh",
        soft: "Analitis, Sangat Teliti, Logika Berpikir, Problem Solving, Pemecahan Masalah",
        achievements:
          "Memotong Waktu Rekonsiliasi Kas Bulanan dari 5 Hari Menjadi 2 Hari Kerja",
        expPlaceholder:
          "Jelaskan pengalaman mengelola angka atau data Anda.\n\nContoh:\n- Menyusun laporan arus kas bulanan secara akurat tanpa diskrepansi\n- Mengaudit anggaran operasional divisi untuk efisiensi biaya\n- Mengolah data mentah menjadi dashboard visual untuk keputusan bisnis",
      };
    }

    return {
      technical:
        "Microsoft Office, Manajemen Proyek, Komunikasi Digital, Administrasi Data, Alat Kerja Spesifik Bidang Anda",
      soft: "Kerja Sama Tim, Problem Solving, Komunikasi Profesional, Beradaptasi Cepat, Etos Kerja Tinggi",
      achievements:
        "Karyawan Terbaik Bulan Ini / Juara Kompetisi Bidang Terkait / Lulusan Terbaik",
      expPlaceholder:
        "Jelaskan tanggung jawab dan pencapaian Anda selama bekerja atau berorganisasi.\n\nContoh:\n- Mengatur alur kerja harian untuk memastikan target tim tercapai tepat waktu\n- Menyelesaikan kendala operasional harian melalui pendekatan solutif\n- Menghemat waktu pengerjaan tugas rutin sebanyak 20% dengan otomatisasi sederhana",
    };
  };

  const placeholders = getDynamicPlaceholders(form.jobTitle);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockAIResult = {
        profile: {
          name: form.name || "Harun",
          email: form.email || "akubisa@email.com",
          phone: form.phone || "+62 812 3456 7890",
          location: form.location || "Jakarta, Indonesia",
          jobTitle: form.jobTitle || "Profesional Berbakat",
          summary: `Seorang ${
            form.jobTitle || "Profesional"
          } berbakat yang berfokus pada efisiensi kerja tinggi. Memiliki latar belakang pendidikan yang kuat dari ${
            form.institution || "institusi terkemuka"
          } dan rekam jejak yang solid di ${
            form.company || "industri terkait"
          }. Sangat termotivasi untuk memberikan kontribusi nyata bagi perkembangan tim.`,
        },
        education: [
          {
            institution: form.institution || "Universitas Terkemuka",
            degree: form.degree || "Sarjana / Diploma",
            year: form.graduationYear || "2024",
            description:
              form.educationDesc ||
              "Lulus dengan predikat sangat memuaskan dan aktif berorganisasi.",
          },
        ],
        experience: [
          {
            company: form.company || "Perusahaan Inovatif",
            position: form.position || form.jobTitle || "Professional Staff",
            period: form.period || "2022 - Sekarang",
            points: form.experiencePoints
              ? form.experiencePoints.split("\n").filter((p) => p.trim() !== "")
              : [
                  "Memimpin pelaksanaan tugas utama dengan peningkatan efisiensi hingga 40%",
                  "Berkolaborasi dengan tim lintas divisi untuk menyelaraskan target operasional",
                  "Mengoptimalkan alur kerja harian dan memastikan produktivitas kerja yang maksimal",
                ],
          },
        ],
        skills: {
          technical: form.technicalSkills
            ? form.technicalSkills.split(",").map((s) => s.trim())
            : ["Keahlian Inti 1", "Keahlian Inti 2"],
          soft: form.softSkills
            ? form.softSkills.split(",").map((s) => s.trim())
            : ["Problem Solving", "Komunikasi"],
        },
        languages: form.languages
          ? form.languages.split(",").map((l) => l.trim())
          : ["Bahasa Indonesia (Native)"],
        achievements: form.achievements
          ? form.achievements.split("\n").filter((a) => a.trim() !== "")
          : ["Pencapaian Profesional Terpilih"],
      };

      const newCV = {
        id: "cv_" + Date.now(),
        formData: form,
        aiResult: mockAIResult,
        createdAt: new Date().toISOString(),
        templateColor: "blue",
      };

      const existing = JSON.parse(localStorage.getItem("cv_list") || "[]");
      existing.unshift(newCV);
      localStorage.setItem("cv_list", JSON.stringify(existing));

      localStorage.removeItem(DRAFT_KEY);
      sessionStorage.setItem("cv_result", JSON.stringify(mockAIResult));
      navigate("/result");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white placeholder:text-gray-500 bg-gray-800 text-sm";
  const labelClass =
    "block text-xs font-semibold text-gray-400 mb-1 tracking-wide uppercase";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span>📄</span>
          <span className="font-bold text-white tracking-wide">
            CVCraft AI Studio
          </span>
        </div>
        {draftSaved && (
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            💾 Draft tersimpan otomatis
          </span>
        )}
      </header>

      {/* SPLIT SCREEN CONTAINER */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden h-[calc(100vh-61px)]">
        {/* PANEL KIRI: FORM INPUT & ATS SCORE COMPONENT (Scrollable) */}
        <div className="p-6 overflow-y-auto border-r border-white/10 flex flex-col justify-between space-y-6 bg-gray-950">
          <div className="space-y-6">
            {/* Steps indicator */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-white/5">
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    i === step
                      ? "bg-blue-600 text-white shadow-sm"
                      : i < step
                      ? "text-blue-400 hover:bg-gray-900 cursor-pointer"
                      : "text-gray-600 cursor-default"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === step ? "bg-white text-blue-600" : "bg-gray-800"
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </span>
                  {s}
                </button>
              ))}
            </div>

            {/* Form Content Steps */}
            <div className="bg-gray-900 rounded-2xl border border-white/10 p-5 shadow-inner">
              {/* Step 0: Data Pribadi */}
              {step === 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-base font-bold">Data Pribadi</h2>

                    <div className="flex items-center gap-3">
                      {/* TOMBOL IMPORT BACKUP JSON */}
                      <label className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1 bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-700">
                        📁 Import Backup
                        <input
                          type="file"
                          accept=".json"
                          onChange={importFromJSON}
                          className="hidden"
                        />
                      </label>

                      {/* BAGIAN INI YANG DIGANTI: Menggunakan deteksi ketikan langsung, bukan dari local storage */}
                      {(!!form.name || !!form.jobTitle) && (
                        <button
                          type="button"
                          onClick={clearDraft}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Reset Draft
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Nama Lengkap *</label>
                      <input
                        className={inputClass}
                        placeholder="Nama Lengkap Anda"
                        value={form.name}
                        onChange={(e) => updateForm({ name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Posisi / Jabatan *</label>
                      <input
                        className={inputClass}
                        placeholder="Posisi yang ingin dilamar Contoh: Admin Medsos, Desainer, Sales, Guru..."
                        value={form.jobTitle}
                        onChange={(e) =>
                          updateForm({ jobTitle: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input
                        type="email"
                        className={inputClass}
                        placeholder="emailanda@mail.com"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Nomor HP</label>
                      <input
                        className={inputClass}
                        placeholder="+62 812..."
                        value={form.phone}
                        onChange={(e) => updateForm({ phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Kota / Lokasi</label>
                    <input
                      className={inputClass}
                      placeholder="Jakarta, Indonesia"
                      value={form.location}
                      onChange={(e) => updateForm({ location: e.target.value })}
                    />
                  </div>

                  <div className="mt-3">
  <label className={labelClass}>Profil LinkedIn (opsional)</label>
  <input
    className={inputClass}
    placeholder="linkedin.com/in/username-anda"
    value={form.linkedin || ''}
    onChange={e => updateForm({ linkedin: e.target.value })}
  />
</div>
                </div>
              )}

              {/* Step 1: Pendidikan */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold">Pendidikan</h2>
                  <div>
                    <label className={labelClass}>Nama Institusi *</label>
                    <input
                      className={inputClass}
                      placeholder="Nama Universitas, SMA, atau Sekolah Tinggi Anda"
                      value={form.institution}
                      onChange={(e) =>
                        updateForm({ institution: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>
                        Jurusan / Program Studi *
                      </label>
                      <input
                        className={inputClass}
                        placeholder="Manajemen / Akuntansi / IPS / RPL"
                        value={form.degree}
                        onChange={(e) => updateForm({ degree: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Tahun Lulus</label>
                      <input
                        className={inputClass}
                        placeholder="2024"
                        value={form.graduationYear}
                        onChange={(e) =>
                          updateForm({ graduationYear: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Keterangan Tambahan (opsional)
                    </label>
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder="IPK, Aktif organisasi, prestasi akademik, judul skripsi..."
                      value={form.educationDesc}
                      onChange={(e) =>
                        updateForm({ educationDesc: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Pengalaman */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold">
                    Pengalaman Kerja / Organisasi
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>
                        Nama Perusahaan / Instansi *
                      </label>
                      <input
                        className={inputClass}
                        placeholder="PT Sukses Mandiri / OSIS SMA"
                        value={form.company}
                        onChange={(e) =>
                          updateForm({ company: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Posisi *</label>
                      <input
                        className={inputClass}
                        placeholder="Staff Administrasi / Desainer Konten / Anggota"
                        value={form.position}
                        onChange={(e) =>
                          updateForm({ position: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Periode Kerja</label>
                    <input
                      className={inputClass}
                      placeholder="Jan 2023 – Des 2024 / Sekarang"
                      value={form.period}
                      onChange={(e) => updateForm({ period: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={labelClass}>
                        Pencapaian & Tanggung Jawab
                      </label>

                      <button
                        type="button"
                        onClick={handleAIPolishExperience}
                        disabled={polishingExp || !form.experiencePoints}
                        className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md disabled:opacity-40 transition-all shadow-sm"
                      >
                        {polishingExp ? (
                          <>
                            <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Polishing...
                          </>
                        ) : (
                          <>✨ AI Polish (Action Verbs)</>
                        )}
                      </button>
                    </div>
                    <textarea
                      className={inputClass}
                      rows={4}
                      placeholder={placeholders.expPlaceholder}
                      value={form.experiencePoints || ""}
                      onChange={(e) =>
                        updateForm({ experiencePoints: e.target.value })
                      }
                    />

                    {/* TAMPILAN LIVE CHARACTER COUNTER */}
                    <div className="flex justify-between items-center mt-1 px-1">
                      <span className="text-[10px] text-gray-500">
                        {/* Memberikan tips rekomendasi panjang teks ATS */}
                        {(form.experiencePoints || "").length < 50
                          ? "💡 Tulis lebih detail pencapaianmu agar dilirik ATS."
                          : "✨ Panjang deskripsi sudah cukup ideal."}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-semibold ${
                          (form.experiencePoints || "").length > 500
                            ? "text-amber-400"
                            : "text-gray-400"
                        }`}
                      >
                        {(form.experiencePoints || "").length} / 500 karakter
                      </span>
                    </div>
                  </div>

                  {/* Pengalaman Kerja Tambahan */}
                  {form.experiences &&
                    form.experiences.map((exp, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-800 rounded-xl border border-white/10 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-gray-400">
                            Pengalaman {idx + 2}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const exps = form.experiences.filter(
                                (_, i) => i !== idx
                              );
                              updateForm({ experiences: exps });
                            }}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Hapus
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            className={inputClass}
                            placeholder="Perusahaan / Instansi"
                            value={exp.company}
                            onChange={(e) => {
                              const exps = [...form.experiences];
                              exps[idx] = {
                                ...exps[idx],
                                company: e.target.value,
                              };
                              updateForm({ experiences: exps });
                            }}
                          />
                          <input
                            className={inputClass}
                            placeholder="Posisi"
                            value={exp.position}
                            onChange={(e) => {
                              const exps = [...form.experiences];
                              exps[idx] = {
                                ...exps[idx],
                                position: e.target.value,
                              };
                              updateForm({ experiences: exps });
                            }}
                          />
                        </div>
                        <input
                          className={inputClass}
                          placeholder="Periode"
                          value={exp.period}
                          onChange={(e) => {
                            const exps = [...form.experiences];
                            exps[idx] = {
                              ...exps[idx],
                              period: e.target.value,
                            };
                            updateForm({ experiences: exps });
                          }}
                        />
                        <textarea
                          className={inputClass}
                          rows={2}
                          placeholder="Pencapaian singkat..."
                          value={exp.points}
                          onChange={(e) => {
                            const exps = [...form.experiences];
                            exps[idx] = {
                              ...exps[idx],
                              points: e.target.value,
                            };
                            updateForm({ experiences: exps });
                          }}
                        />
                      </div>
                    ))}

                  <button
                    type="button"
                    onClick={() =>
                      updateForm({
                        experiences: [
                          ...(form.experiences || []),
                          { company: "", position: "", period: "", points: "" },
                        ],
                      })
                    }
                    className="w-full py-2 border-2 border-dashed border-gray-700 text-gray-500 hover:border-blue-500/50 hover:text-blue-400 rounded-xl text-xs font-medium transition-all"
                  >
                    + Tambah Pengalaman Lain
                  </button>
                </div>
              )}

              {/* Step 3: Keahlian */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold">Keahlian & Lainnya</h2>
                  <div>
                    <label className={labelClass}>
                      Technical Skills / Hard Skills
                    </label>
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder={placeholders.technical}
                      value={form.technicalSkills}
                      onChange={(e) =>
                        updateForm({ technicalSkills: e.target.value })
                      }
                    />
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Pisahkan setiap keahlian menggunakan tanda koma (,)
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Soft Skills</label>
                    <input
                      className={inputClass}
                      placeholder={placeholders.soft}
                      value={form.softSkills}
                      onChange={(e) =>
                        updateForm({ softSkills: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bahasa yang Dikuasai</label>
                    <input
                      className={inputClass}
                      placeholder="Bahasa Indonesia (Native), Bahasa Inggris (Profesional)"
                      value={form.languages}
                      onChange={(e) =>
                        updateForm({ languages: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Pencapaian / Sertifikasi / Penghargaan
                    </label>
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder={placeholders.achievements}
                      value={form.achievements}
                      onChange={(e) =>
                        updateForm({ achievements: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Generate */}
              {step === 4 && (
                <div className="text-center py-4">
                  <span className="text-3xl block mb-2">🚀</span>
                  <h3 className="text-base font-bold mb-1">
                    Semua data siap diproses!
                  </h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
                    AI akan menyempurnakan struktur tata bahasa dokumen agar
                    100% lolos sistem skrining perusahaan.
                  </p>

                  {error && (
                    <p className="text-xs text-red-400 mb-2">{error}</p>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={loading || !form.name || !form.jobTitle}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
                  >
                    {loading
                      ? "AI sedang menyusun CV terbaikmu..."
                      : "✨ Generate CV Akhir"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PANEL INDIKATOR ATS SCORE DI BAGIAN BAWAH FORM KIRI */}
          <div className="bg-gray-900 rounded-xl border border-white/5 p-4 mt-auto">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
                ATS Score Optimization
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  atsScoreData.score >= 70
                    ? "bg-green-500/10 text-green-400"
                    : "bg-amber-500/10 text-yellow-400"
                }`}
              >
                {atsScoreData.score}/100
              </span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${atsScoreData.score}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 italic">
              💡 Suggestion: {atsScoreData.currentTip}
            </p>
          </div>

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between pt-2 border-t border-white/5 shrink-0 gap-2 items-center">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={`px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold rounded-xl ${
                  step === 0 ? "opacity-0 pointer-events-none" : ""
                }`}
              >
                ← Back
              </button>

              <div className="flex items-center gap-2">
                {/* TOMBOL BACKUP DATA */}
                <button
                  type="button"
                  onClick={exportToJSON}
                  className="px-3 py-2 bg-gray-900 border border-gray-700 hover:border-gray-600 text-gray-300 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all"
                  title="Simpan data mentah CV kamu untuk di-import nanti"
                >
                  📥 Backup Data (.json)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStep((s) => Math.min(STEPS.length - 1, s + 1))
                  }
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold rounded-xl"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PANEL KANAN: LIVE REAL-TIME PREVIEW (Kertas CV Lembaran ATS) */}
<div className="bg-gray-900 p-8 overflow-y-auto flex justify-center items-start border-l border-white/5 h-full">
  <div className="w-full max-w-[550px] aspect-[1/1.414] bg-white text-gray-900 p-10 shadow-2xl rounded-sm border border-gray-200 font-serif text-left relative overflow-hidden transition-all duration-300">
    
    {/* Header CV (Nama, Judul, Ringkasan, Kontak) */}
    <div className="mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 min-h-[32px]">
            {form.name || <span className="text-gray-300 italic font-normal">Nama Anda</span>}
            {form.jobTitle && <span className="text-lg font-normal text-gray-500 font-sans"> | {form.jobTitle}</span>}
          </h1>
        </div>
      </div>

      {/* Ringkasan / Tentang Saya */}
      <p className="text-[11px] text-gray-600 text-justify mt-3 font-sans leading-relaxed">
        {form.name ? (
          `Seorang ${form.jobTitle || "profesional"} yang berkomitmen tinggi, memiliki kompetensi kuat di bidangnya, serta siap berkontribusi penuh pada target pertumbuhan jangka panjang organisasi.`
        ) : (
          <span className="text-gray-300 italic">Akan di-generate otomatis oleh AI...</span>
        )}
      </p>

      {/* Kontak Metadata */}
      <div className="flex flex-col gap-1 text-[10px] text-gray-600 mt-4 font-sans">
        {form.location && <div>Address: {form.location}</div>}
        {form.email && <div>Email: {form.email}</div>}
        {form.phone && <div>Phone: {form.phone}</div>}
        {form.linkedin && <div>LinkedIn: {form.linkedin}</div>}
      </div>
    </div>

    {/* SEKSI 1: WORK EXPERIENCE */}
    <div className="border-t border-gray-300 pt-4 mb-6">
      <h3 className="text-sm font-bold text-gray-800 mb-4 font-sans">Work Experience</h3>
      <div className="space-y-4">
        {/* Pengalaman Utama */}
        <div className="grid grid-cols-4 gap-4 text-[11px]">
          <div className="col-span-1 text-gray-400 font-sans text-[10px]">
            {form.period || "Periode Kerja"}
          </div>
          <div className="col-span-3 space-y-1">
            <div className="font-bold text-gray-800">{form.position || "Posisi Kerja"}</div>
            <div className="font-semibold text-gray-700">{form.company || "Nama Perusahaan"}</div>
            <div className="text-gray-600 mt-1 whitespace-pre-line text-[10px] leading-relaxed font-sans pl-4">
              {form.experiencePoints || <span className="text-gray-300 italic">Detail pencapaian kerja...</span>}
            </div>
          </div>
        </div>

        {/* Loop Pengalaman Tambahan */}
        {form.experiences && form.experiences.map((exp, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-4 text-[11px] pt-2">
            <div className="col-span-1 text-gray-400 font-sans text-[10px]">
              {exp.period || "Periode"}
            </div>
            <div className="col-span-3 space-y-1">
              <div className="font-bold text-gray-800">{exp.position || "Posisi Kerja"}</div>
              <div className="font-semibold text-gray-700">{exp.company || "Nama Perusahaan"}</div>
              <div className="text-gray-600 mt-1 whitespace-pre-line text-[10px] leading-relaxed font-sans pl-4">
                {exp.points || <span className="text-gray-300 italic">Pencapaian tambahan...</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* SEKSI 2: EDUCATION */}
    <div className="border-t border-gray-300 pt-4 mb-6">
      <h3 className="text-sm font-bold text-gray-800 mb-4 font-sans">Education</h3>
      <div className="grid grid-cols-4 gap-4 text-[11px]">
        <div className="col-span-1 text-gray-400 font-sans text-[10px]">
          {form.graduationYear ? `Graduated ${form.graduationYear}` : "Tahun Lulus"}
        </div>
        <div className="col-span-3 space-y-1">
          <div className="font-bold text-gray-800">
            {form.institution || <span className="text-gray-300 italic font-normal">Nama Sekolah / Universitas</span>}
          </div>
          <div className="text-gray-700 font-medium">
            {form.degree || <span className="text-gray-300 italic font-normal">Jurusan / Gelar</span>}
          </div>
          {form.educationDesc && (
            <p className="text-[10px] text-gray-500 mt-0.5 font-sans leading-relaxed">
              {form.educationDesc}
            </p>
          )}
        </div>
      </div>
    </div>

    {/* SEKSI 3: SKILLS & LANGUAGES (Bagi Dua Kolom Sejajar di Bawah) */}
    <div className="border-t border-gray-300 pt-4 grid grid-cols-2 gap-8 text-[11px]">
      {/* Kolom Kiri: Skills */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-2 font-sans">Skills</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600 font-sans text-[10px]">
          {form.technicalSkills ? (
            form.technicalSkills.split(",").map((s, i) => (
              <li key={i}>{s.trim()}</li>
            ))
          ) : (
            <li className="text-gray-300 italic">Belum ada skill dimasukkan</li>
          )}
          {form.softSkills && (
            <li className="text-gray-500 italic">Soft Skills: {form.softSkills}</li>
          )}
        </ul>
      </div>

      {/* Kolom Kanan: Languages & Achievements */}
      <div className="space-y-4">
        {form.languages && (
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2 font-sans">Languages</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 font-sans text-[10px]">
              {form.languages.split(",").map((l, i) => (
                <li key={i}>{l.trim()}</li>
              ))}
            </ul>
          </div>
        )}

        {form.achievements && (
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-1 font-sans">Achievements</h3>
            <p className="text-gray-600 font-sans text-[10px] whitespace-pre-line pl-1">
              {form.achievements}
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Watermark Branding */}
    <div className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-gray-400 select-none z-10">
      DIBUAT DENGAN CVCRAFT AI — VIBATHON 2026
    </div>
    {/* <div className="absolute bottom-4 left-0 right-0 text-center border-t border-gray-100 pt-1.5">
      <p className="text-[8px] text-gray-300 tracking-wider uppercase font-sans font-medium">
        Dibuat dengan CVCraft AI — Vibathon 2026
      </p>
    </div> */}

  </div>
</div>
      </div>
    </div>
  );
}
