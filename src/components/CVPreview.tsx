import type { CVData, CVTemplate } from '../types/cv'

interface CVPreviewProps {
  data: CVData
  template: CVTemplate
}

const TEMPLATE_COLORS: Record<CVTemplate, { primary: string; light: string; text: string; border: string }> = {
  blue: {
    primary: '#4F6EF7',
    light: '#EEF2FF',
    text: '#4F6EF7',
    border: '#C7D2FE',
  },
  green: {
    primary: '#10B981',
    light: '#ECFDF5',
    text: '#059669',
    border: '#A7F3D0',
  },
  minimal: {
    primary: '#374151',
    light: '#F3F4F6',
    text: '#374151',
    border: '#D1D5DB',
  },
}

export default function CVPreview({ data, template }: CVPreviewProps) {
  const c = TEMPLATE_COLORS[template]
  const { profile, education, experience, skills, languages, achievements } = data

  // ==========================================
  // SENIORKU TRICK: Fungsi Pendeteksi Label Dinamis
  // ==========================================
  const getSkillLabel = (jobTitle: string) => {
    const title = (jobTitle || '').toLowerCase();
    
    // Jika mengandung unsur profesi non-IT umum, ubah namanya agar logis
    if (
      title.includes('guru') || 
      title.includes('teacher') || 
      title.includes('sales') || 
      title.includes('akuntan') || 
      title.includes('accounting') ||
      title.includes('admin') ||
      title.includes('hrd')
    ) {
      return 'Keahlian Utama'; // Atau bisa kamu ganti jadi 'Hard Skills'
    }
    
    return 'Technical Skills'; // Default untuk developer / anak IT
  }

  return (
    <div
      id="cv-content"
      className="bg-white shadow-xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1F2937',
      }}
    >
      {/* Header */}
      <div style={{ backgroundColor: c.primary, color: 'white', padding: '28px 32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
          {profile.name}
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px', fontWeight: 500 }}>
          {profile.jobTitle}
        </p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '11px', opacity: 0.85, flexWrap: 'wrap' }}>
          {profile.email && <span>✉ {profile.email}</span>}
          {profile.phone && <span>📞 {profile.phone}</span>}
          {profile.location && <span>📍 {profile.location}</span>}
        </div>
      </div>

      {/* Body — 2 columns */}
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Left column */}
        <div style={{ flex: 2, padding: '24px 28px', borderRight: `1px solid ${c.border}` }}>
          {/* Summary */}
          {profile.summary && (
            <section style={{ marginBottom: '24px' }}>
              <SectionTitle color={c.primary}>Tentang Saya</SectionTitle>
              <p style={{ color: '#374151', lineHeight: 1.7, fontSize: '11px' }}>
                {profile.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <SectionTitle color={c.primary}>Pengalaman Kerja</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '12px', color: '#111827', margin: 0 }}>
                          {exp.position}
                        </p>
                        <p style={{ color: c.text, fontSize: '11px', fontWeight: 600, margin: '2px 0' }}>
                          {exp.company}
                        </p>
                      </div>
                      <span style={{ color: '#9CA3AF', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                        {exp.period}
                      </span>
                    </div>
                    {exp.points?.length > 0 && (
                      <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px' }}>
                        {exp.points.map((pt, pi) => (
                          <li key={pi} style={{ color: '#4B5563', marginBottom: '3px', fontSize: '10.5px' }}>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <section>
              <SectionTitle color={c.primary}>Pendidikan</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {education.map((edu, i) => (
                  <div key={i} style={{ backgroundColor: c.light, borderRadius: '8px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ fontWeight: 700, fontSize: '12px', color: '#111827', margin: 0 }}>
                        {edu.institution}
                      </p>
                      <span style={{ color: '#9CA3AF', fontSize: '10px' }}>{edu.year}</span>
                    </div>
                    <p style={{ color: c.text, fontSize: '11px', fontWeight: 600, margin: '3px 0 0' }}>
                      {edu.degree}
                    </p>
                    {edu.description && (
                      <p style={{ color: '#6B7280', fontSize: '10px', margin: '4px 0 0' }}>
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div style={{ flex: 1, padding: '24px 20px', backgroundColor: c.light }}>
          {/* UPGRADED: Label Technical Skills sekarang memanggil fungsi getSkillLabel */}
          {skills?.technical?.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <SectionTitle color={c.primary} small>
                {getSkillLabel(profile.jobTitle)}
              </SectionTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {skills.technical.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: 'white',
                      border: `1px solid ${c.border}`,
                      color: c.text,
                      borderRadius: '20px',
                      padding: '2px 8px',
                      fontSize: '10px',
                      fontWeight: 500,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Soft Skills */}
          {skills?.soft?.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <SectionTitle color={c.primary} small>Soft Skills</SectionTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {skills.soft.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #D1FAE5',
                      color: '#059669',
                      borderRadius: '20px',
                      padding: '2px 8px',
                      fontSize: '10px',
                      fontWeight: 500,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <SectionTitle color={c.primary} small>Bahasa</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {languages.map((lang, i) => (
                  <span key={i} style={{ fontSize: '10.5px', color: '#374151' }}>
                    • {lang}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {achievements?.length > 0 && (
            <section>
              <SectionTitle color={c.primary} small>Pencapaian</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {achievements.map((ach, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      fontSize: '10px',
                      color: '#374151',
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    🏆 {ach}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      {/* <div style={{ borderTop: `1px solid ${c.border}`, padding: '10px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: '9px', color: '#9CA3AF', margin: 0 }}>
          Dibuat dengan CVCraft AI — Harun Vibathon 2026
        </p>
      </div> */}
    </div>
  )
}

function SectionTitle({ children, color, small }: { children: React.ReactNode; color: string; small?: boolean }) {
  return (
    <div style={{ marginBottom: small ? '8px' : '12px' }}>
      <h3
        style={{
          fontSize: small ? '11px' : '13px',
          fontWeight: 700,
          color,
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {children}
      </h3>
      <div style={{ height: '2px', backgroundColor: color, width: '32px', marginTop: '3px', borderRadius: '2px', opacity: 0.5 }} />
    </div>
  )
}