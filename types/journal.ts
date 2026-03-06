export interface Journal {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  thumbnail: string | null;
  hero_image: string | null;
  images: string[];
  category: string | null;
  tags: string[];
  location: string | null;
  reading_time: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface JournalFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  hero_image: string;
  images: string[];
  category: string;
  tags: string[];
  location: string;
  reading_time: number;
  published: boolean;
}

// ---- Articles ----
export interface Article {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string | null;
  tags: string[];
  excerpt: string | null;
  hero_image: string | null;
  author_name: string | null;
  author_role: string | null;
  reading_time: number;
  content: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ---- Projects ----
export interface Project {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string | null;
  tags: string[];
  excerpt: string | null;
  hero_image: string | null;
  featured: boolean;
  content: string | null;
  images: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ---- Services ----
export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

// ---- CV ----
export interface CVContact {
  id: string;
  phone: string;
  email: string;
  address: string;
}

export interface CVEducation {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string | null;
  sort_order: number;
}

export interface CVExperience {
  id: string;
  title: string;
  organization: string;
  period: string;
  responsibilities: string[];
  sort_order: number;
}

export interface CVCommunityWork {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string | null;
  sort_order: number;
}

export interface CVSkill {
  id: string;
  name: string;
  level: number;
  sort_order: number;
}

export interface CVLanguage {
  id: string;
  name: string;
  proficiency: number;
  sort_order: number;
}

export interface CVCertification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  sort_order: number;
}

export interface CVData {
  contact: CVContact;
  languages: CVLanguage[];
  education: CVEducation[];
  experience: CVExperience[];
  communityWork: CVCommunityWork[];
  skills: CVSkill[];
  certifications: CVCertification[];
}
