import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  avatar: z.string().min(1),
  bio: z.string().min(1),
});

export const experienceItemSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  description: z.string().min(1),
});

export const educationItemSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  period: z.string().min(1),
});

export const certificationItemSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  year: z.string().min(1),
  certificateUrl: z.string().url().optional(),
});

export const skillItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
});

export const homeHeroSchema = z.object({
  title: z.string().min(1),
  highlight: z.string().min(1),
  description: z.string().min(1),
});

export const homeRoleHighlightSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const homePanelSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  roles: z.array(homeRoleHighlightSchema).default([]),
});

export const portfolioConfigSchema = z.object({
  author: authorSchema,
  homepage: z.object({
    hero: homeHeroSchema,
    roleHighlights: homePanelSchema,
  }),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  certifications: z.array(certificationItemSchema).default([]),
  skills: z.array(skillItemSchema).default([]),
});

export type PortfolioConfigInput = z.infer<typeof portfolioConfigSchema>;
