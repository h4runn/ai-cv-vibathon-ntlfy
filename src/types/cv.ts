export interface CVProfile {
  name: string
  email: string
  phone: string
  location: string
  jobTitle: string
  summary: string
}

export interface CVEducation {
  institution: string
  degree: string
  year: string
  description: string
}

export interface CVExperience {
  company: string
  position: string
  period: string
  points: string[]
}

export interface CVSkills {
  technical: string[]
  soft: string[]
}

export interface CVData {
  profile: CVProfile
  education: CVEducation[]
  experience: CVExperience[]
  skills: CVSkills
  languages: string[]
  achievements: string[]
}

export interface CVFormData {
  // Personal
  name: string
  email: string
  phone: string
  location: string
  jobTitle: string
  // Education
  institution: string
  degree: string
  graduationYear: string
  educationDesc: string
  // Experience
  company: string
  position: string
  period: string
  experiencePoints: string
  // Extra experience
  experiences: Array<{
    company: string
    position: string
    period: string
    points: string
  }>
  // Skills
  technicalSkills: string
  softSkills: string
  languages: string
  // Achievements
  achievements: string
}

export interface LocalCV {
  id: string
  formData: CVFormData
  aiResult: CVData
  createdAt: string
  templateColor: string
}

export interface Portfolio {
  id: string
  slug: string
  cv_data: CVData
  created_at: string
}

export type CVTemplate = 'blue' | 'green' | 'minimal'

export const defaultFormData: CVFormData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  jobTitle: '',
  institution: '',
  degree: '',
  graduationYear: '',
  educationDesc: '',
  company: '',
  position: '',
  period: '',
  experiencePoints: '',
  experiences: [],
  technicalSkills: '',
  softSkills: '',
  languages: '',
  achievements: '',
}
