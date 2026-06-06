import mongoose, { Schema, type Document, type Model } from "mongoose";

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

export interface IPortfolioConfigDocument extends Document {
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

const subSchemaOptions = { _id: false };

const ExperienceSchema = new Schema<ExperienceItem>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  subSchemaOptions,
);

const EducationSchema = new Schema<EducationItem>(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
  },
  subSchemaOptions,
);

const CertificationSchema = new Schema<CertificationItem>(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    certificateUrl: { type: String, trim: true },
  },
  subSchemaOptions,
);

const SkillSchema = new Schema<SkillItem>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
  },
  subSchemaOptions,
);

const HomeHeroSchema = new Schema<HomeHero>(
  {
    title: { type: String, required: true, trim: true },
    highlight: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  subSchemaOptions,
);

const HomeRoleHighlightSchema = new Schema<HomeRoleHighlight>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  subSchemaOptions,
);

const HomePanelSchema = new Schema<HomePanel>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    roles: { type: [HomeRoleHighlightSchema], default: [] },
  },
  subSchemaOptions,
);

const PortfolioConfigSchema = new Schema<IPortfolioConfigDocument>(
  {
    author: {
      name: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true },
      avatar: { type: String, required: true, trim: true },
      bio: { type: String, required: true, trim: true },
    },
    homepage: {
      hero: { type: HomeHeroSchema, required: true },
      roleHighlights: { type: HomePanelSchema, required: true },
    },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    certifications: { type: [CertificationSchema], default: [] },
    skills: { type: [SkillSchema], default: [] },
  },
  { timestamps: true },
);

export const PortfolioConfig: Model<IPortfolioConfigDocument> =
  mongoose.models.PortfolioConfig ||
  mongoose.model<IPortfolioConfigDocument>(
    "PortfolioConfig",
    PortfolioConfigSchema,
  );
