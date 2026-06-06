import { Hero } from "@/components/portfolio/hero";
import { RoleHighlights } from "@/components/portfolio/role-highlights";
import { SkillsOverview } from "@/components/portfolio/skills-overview";
import { FeaturedProjects } from "@/components/portfolio/featured-projects";
import { CallToAction } from "@/components/portfolio/cta";
import { getFeaturedProjects } from "@/services/project.service";
import { getPortfolioConfig } from "@/services/portfolio.service";
import { siteConfig } from "@/lib/site-config";
import type { IProject } from "@/types";

export default async function HomePage() {
  let featuredProjects: IProject[] = [];
  try {
    featuredProjects = await getFeaturedProjects(3);
  } catch {
    featuredProjects = [];
  }

  const portfolioConfig = await getPortfolioConfig();
  const homepage = portfolioConfig.homepage ?? siteConfig.homepage;

  return (
    <>
      <Hero author={portfolioConfig.author} hero={homepage.hero} />
      <RoleHighlights roleHighlights={homepage.roleHighlights} />
      <SkillsOverview skills={portfolioConfig.skills} />
      <FeaturedProjects projects={featuredProjects} />
      <CallToAction />
    </>
  );
}
