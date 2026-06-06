export type UserRole = "ADMIN";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  technologies: string[];
  thumbnail: string;
  gallery: string[];
  githubUrl?: string;
  liveUrl?: string;
  features: string[];
  challenges?: string;
  solutions?: string;
  featured: boolean;
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INewsletterSubscriber {
  _id: string;
  email: string;
  subscribedAt: Date;
}

export interface PortfolioAuthor {
  name: string;
  title: string;
  email: string;
  location: string;
  avatar: string;
  bio: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  certificateUrl?: string;
}

export interface SkillItem {
  name: string;
  category: string;
}

export interface HomeHero {
  title: string;
  highlight: string;
  description: string;
}

export interface HomeRoleHighlight {
  title: string;
  description: string;
}

export interface HomePanel {
  title: string;
  subtitle: string;
  roles: HomeRoleHighlight[];
}

export interface PortfolioConfig {
  author: PortfolioAuthor;
  homepage: {
    hero: HomeHero;
    roleHighlights: HomePanel;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  skills: SkillItem[];
}

export interface DashboardStats {
  totalProjects: number;
  featuredProjects: number;
  categoriesCount: number;
  recentProjects: IProject[];
  totalViews: number;
  unreadMessages: number;
  subscribersCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  details?: unknown;
}
