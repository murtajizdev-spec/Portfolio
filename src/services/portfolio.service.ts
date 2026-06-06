import { connectDB } from "@/lib/mongodb";
import { PortfolioConfig } from "@/models/PortfolioConfig";
import { siteConfig } from "@/lib/site-config";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PortfolioAuthor,
  PortfolioConfig as PortfolioConfigData,
  SkillItem,
} from "@/types";

const defaultPortfolioConfig: PortfolioConfigData = {
  author: siteConfig.author,
  homepage: siteConfig.homepage,
  experience: siteConfig.experience,
  education: siteConfig.education,
  certifications: siteConfig.certifications,
  skills: siteConfig.skills,
};

function hasMongoUri(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

function normalizeHomepage(
  homepage?: Partial<PortfolioConfigData["homepage"]> | null,
): PortfolioConfigData["homepage"] {
  const hero = {
    title: homepage?.hero?.title ?? siteConfig.homepage.hero.title,
    highlight: homepage?.hero?.highlight ?? siteConfig.homepage.hero.highlight,
    description: homepage?.hero?.description ?? siteConfig.homepage.hero.description,
  };

  const roleHighlights = {
    title: homepage?.roleHighlights?.title ?? siteConfig.homepage.roleHighlights.title,
    subtitle: homepage?.roleHighlights?.subtitle ?? siteConfig.homepage.roleHighlights.subtitle,
    roles:
      Array.isArray(homepage?.roleHighlights?.roles) && homepage.roleHighlights.roles.length
        ? homepage.roleHighlights.roles.map((role, index) => ({
            title:
              role?.title ??
              siteConfig.homepage.roleHighlights.roles[index]?.title ??
              siteConfig.homepage.roleHighlights.roles[0].title,
            description:
              role?.description ??
              siteConfig.homepage.roleHighlights.roles[index]?.description ??
              siteConfig.homepage.roleHighlights.roles[0].description,
          }))
        : siteConfig.homepage.roleHighlights.roles,
  };

  return { hero, roleHighlights };
}

export function normalizePortfolioConfig(
  config?: Partial<PortfolioConfigData> | null,
): PortfolioConfigData {
  return {
    author: config?.author ?? siteConfig.author,
    homepage: normalizeHomepage(config?.homepage),
    experience: (config?.experience as ExperienceItem[]) ?? [],
    education: (config?.education as EducationItem[]) ?? [],
    certifications: (config?.certifications as CertificationItem[]) ?? [],
    skills: (config?.skills as SkillItem[]) ?? [],
  };
}

export async function getPortfolioConfig(): Promise<PortfolioConfigData> {
  if (!hasMongoUri()) {
    return normalizePortfolioConfig(defaultPortfolioConfig);
  }

  try {
    await connectDB();
    const config = await PortfolioConfig.findOne().lean();
    return normalizePortfolioConfig(config ?? defaultPortfolioConfig);
  } catch (error) {
    console.warn("getPortfolioConfig: unable to connect to MongoDB, falling back to defaults", error);
    return normalizePortfolioConfig(defaultPortfolioConfig);
  }
}

export async function updatePortfolioConfig(
  updates: Partial<PortfolioConfigData>,
): Promise<PortfolioConfigData> {
  await connectDB();

  const config = await PortfolioConfig.findOneAndUpdate(
    {},
    updates,
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    },
  ).lean();

  if (!config) {
    throw new Error("Unable to update portfolio configuration");
  }

  return normalizePortfolioConfig(config as Partial<PortfolioConfigData>);
}
