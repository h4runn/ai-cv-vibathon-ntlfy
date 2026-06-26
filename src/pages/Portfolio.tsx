import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { CVData } from "../types/cv";
import { Mail, Phone, MapPin, Link as LinkIcon } from "lucide-react";
import { Award } from 'lucide-react'; // Import di atas

// ✨ HELPER COMPONENT: SCROLL REVEAL ANIMATION NATIVE (Bebas Error Type & Super Smooth)
function ScrollReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(ref); // Trigger sekali untuk performa smooth
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <div
      ref={setRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isIntersecting
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-[0.99]"
      }`}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const localPortfolios = JSON.parse(
          localStorage.getItem("local_portfolios") || "{}"
        );
        const portfolio = localPortfolios[slug];

        if (portfolio && portfolio.cv_data) {
          setData(portfolio.cv_data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Gagal membaca data portofolio:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono tracking-widest text-slate-400 uppercase animate-pulse">
            Mengompilasi Portofolio Premium...
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
        <div className="text-center max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl">
          <div className="text-5xl mb-4">🛸</div>
          <h1 className="text-xl font-bold tracking-tight mb-2">
            Portofolio Tidak Ditemukan
          </h1>
          <p className="text-slate-500 text-xs mb-6 leading-relaxed">
            Halaman portofolio{" "}
            <strong className="text-blue-600">/{slug}</strong> belum
            ter-generate di database lokal kamu.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-all w-full shadow-lg shadow-blue-600/20"
          >
            ← Mulai Buat di CVCraft AI
          </Link>
        </div>
      </div>
    );
  }

  const { profile, experience, education, skills, languages, achievements } =
    data;

  // 📊 DYNAMIC METRICS ENGINE (Menghitung data asli agar sinkron)
  const totalSkills =
    (skills?.technical?.length || 0) + (skills?.soft?.length || 0);
  const totalExp = experience?.length || 0;
  const totalAchievements = achievements?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden pb-20">
      {/* 🔮 BACKGROUND MESH & GLOW PREMIUM (Versi Terang Halus ala Vercel Light Design) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[450px] h-[450px] bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* MIKRO INTERAKSI TOAST (Gaya Notifikasi Mengambang) */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200 text-blue-600 px-4 py-2 rounded-xl text-xs font-mono shadow-2xl animate-bounce flex items-center gap-2">
          <svg
            className="w-3 h-3 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M11.3 1.046A1 1 0 0010 2v7h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-7H4a1 1 0 01-.82-1.573l7-10z" />
          </svg>{" "}
          {copiedText} Berhasil Disalin!
        </div>
      )}

      {/* 🏢 TOP HEADER VERIFICATION BANNER */}
      <header className="max-w-6xl mx-auto pt-20 pb-6 px-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md w-fit text-[10px] font-mono tracking-wider text-slate-500 uppercase shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
          Engine Verified Portfolio v1.2
        </div>
      </header>

      {/* 🏛️ COMBINED BENTO GRID STRUCTURE */}
      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* ================= 🔥 BENTO 1: IDENTITY HERO CARD (SEKARANG JAUH LEBIH GEDE & MEGAH) ================= */}
        <div className="md:col-span-3">
          <ScrollReveal>
            {/* Mengubah padding dari p-8 md:p-12 menjadi p-10 md:py-24 md:px-16 untuk memberikan kesan extra space premium */}
            <div className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/90 rounded-3xl p-10 md:py-24 md:px-16 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group hover:border-slate-300 transition-all duration-300 shadow-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />

              <div className="space-y-6 flex-1">
                <div className="space-y-3">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-none">
                    {profile.name}
                  </h1>
                  {/* FIX ROKET BIRU: Memisahkan emoji roket dari text-gradient agar warnanya kembali normal */}
                  <p className="text-base md:text-xl font-extrabold flex items-center gap-2 text-slate-800">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                      {profile.jobTitle || "Expert Professional"}
                    </span>
                  </p>
                </div>

                {/* METADATA INTERAKTIF (Bisa Di-klik Copy dengan Indikator) */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs md:text-sm text-slate-600 font-mono pt-6 border-t border-slate-200/60 mt-6">
                  {profile.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />{" "}
                      {profile.location}
                    </span>
                  )}

                  {profile.email && (
                    <button
                      onClick={() => copyToClipboard(profile.email, "Email")}
                      className="hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 font-mono font-medium"
                    >
                      <Mail size={14} className="text-slate-400" />{" "}
                      {profile.email}
                    </button>
                  )}

                  {profile.phone && (
                    <button
                      onClick={() => copyToClipboard(profile.phone, "No. HP")}
                      className="hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 font-mono font-medium"
                    >
                      <Phone size={14} className="text-slate-400" />{" "}
                      {profile.phone}
                    </button>
                  )}

                  {(profile as any).linkedin && (
                    <a
                      href={`https://${(profile as any).linkedin.replace(
                        "https://",
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-30 cursor-pointer text-blue-600 hover:underline flex items-center gap-1.5 font-mono font-bold"
                    >
                      <LinkIcon size={14} className="text-slate-400" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {/* Bulatan Avatar Raksasa Sebelah Kanan (Ikut diperbesar menyesuaikan section hero baru) */}
              <div className="w-28 h-28 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl flex items-center justify-center text-4xl md:text-6xl font-black text-white shrink-0 border-4 border-white ring-4 ring-blue-50/50 group-hover:scale-105 transition-transform duration-300">
                {profile.name?.[0]?.toUpperCase() || "👤"}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ================= BENTO 2: METRICS DASHBOARD (1 Kolom) ================= */}
        <div>
          <ScrollReveal delay={100}>
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                Engine Metrics Dashboard
              </p>

              <div className="grid grid-cols-3 gap-2 py-4 my-auto">
                <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-xl font-black text-blue-600 font-mono">
                    {totalExp}
                  </span>
                  <span className="text-[9px] font-bold tracking-wide text-slate-500 block mt-1">
                    Karir
                  </span>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-xl font-black text-indigo-600 font-mono">
                    {totalSkills}
                  </span>
                  <span className="text-[9px] font-bold tracking-wide text-slate-500 block mt-1">
                    Skill
                  </span>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-xl font-black text-amber-600 font-mono">
                    {totalAchievements}
                  </span>
                  <span className="text-[9px] font-bold tracking-wide text-slate-500 block mt-1">
                    Prestasi
                  </span>
                </div>
              </div>

              <a
                href={`mailto:${profile.email}`}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-center rounded-xl text-xs font-mono text-white transition-all flex items-center justify-center gap-1.5 font-bold shadow-md shadow-slate-900/10"
              >
                <span>✨</span> Hubungi Saya Direct
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* ================= BENTO 3: TECH CLOUD & CAPABILITIES (2 Kolom) ================= */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
          <div className="md:col-span-2">
            <ScrollReveal delay={100}>
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-4">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />{" "}
                    Capabilities & Tech Stack
                  </h3>

                  {/* Hard Skills */}
                  {skills?.technical && skills.technical.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {skills.technical.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-900 text-white border border-slate-800 hover:bg-blue-600 hover:border-blue-500 rounded-lg text-xs font-mono transition-colors cursor-default font-bold shadow-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Soft Skills */}
                  {skills?.soft && skills.soft.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                      {skills.soft.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100/60 rounded-lg text-[11px] font-bold"
                        >
                          • {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Languages */}
                {languages && languages.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">
                      Languages:
                    </span>
                    {languages.map((l, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-md"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ================= BENTO 4: SUMMARY CARD (1 Kolom) ================= */}
        {profile.summary && (
          <div>
            <ScrollReveal>
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col gap-3 shadow-sm h-full">
                <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />{" "}
                  Executive Summary
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed text-justify mt-2 font-medium">
                  {profile.summary}
                </p>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ================= BENTO 5: EXPERIENCES DEPLOYMENT TIMELINE (2 Kolom) ================= */}
        {experience && experience.length > 0 && (
          <div className="md:col-span-2">
            <ScrollReveal>
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-6">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />{" "}
                  Career Timeline Track
                </h3>

                <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-6">
                  {experience.map((exp, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white border border-slate-300 ring-4 ring-white group-hover:border-blue-600 transition-colors" />

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                              {exp.position}
                            </h4>
                            <p className="text-xs text-blue-600 font-extrabold">
                              {exp.company}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                            {exp.period}
                          </span>
                        </div>

                        {exp.points && exp.points.length > 0 && (
                          <ul className="space-y-1 pt-1">
                            {exp.points.map((pt, pi) => (
                              <li
                                key={pi}
                                className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed font-medium"
                              >
                                <span className="text-blue-500 mt-0.5 font-mono text-[10px]">
                                  ›
                                </span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ================= BENTO 6: ACADEMIC BACKGROUND (1 Kolom) ================= */}
        {education && education.length > 0 && (
          <div>
            <ScrollReveal delay={100}>
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[250px]">
                <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-4">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />{" "}
                  Academic Profile
                </h3>

                <div className="space-y-4 my-auto w-full">
                  {education.map((edu, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>{edu.year}</span>
                        <span className="text-blue-600 font-extrabold">
                          DEGREE
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {edu.institution}
                      </h4>
                      <p className="text-[11px] text-slate-600 font-medium truncate">
                        {edu.degree}
                      </p>
                      {edu.description && (
                        <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200 mt-1">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ================= ✨ BENTO 7: HONORS & ACHIEVEMENTS (Ubah ke 2 Kolom untuk Mengisi Kekosongan Samping Academic Profile!) ================= */}
        {achievements && achievements.length > 0 && (
          <div className="md:col-span-2">
            <ScrollReveal>
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />{" "}
                    Verifiable Verification & Awards
                  </h3>

                  {/* Kita sesuaikan grid internalnya menjadi sm:grid-cols-2 agar tampil manis di ruang 2 kolom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {achievements.map((ach, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-4 rounded-xl flex items-center gap-3 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
  <Award size={18} strokeWidth={2.5} />
</div>
                        <p className="text-xs text-slate-800 font-bold leading-snug">
                          {ach}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}
      </main>

      {/* 🌟 FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 mt-20 pt-8 border-t border-slate-200 text-center space-y-4">
        <p className="text-[11px] font-mono text-slate-400 tracking-wider font-bold">
          SYSTEM CORE GENERATED BY CVCRAFT AI - HARUN VIBATHON 2026
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
        >
          ⚡ Build Your Premium Engine
        </Link>
      </footer>
    </div>
  );
}
