import Image from "next/image";
import { generateSEO } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getPortfolioConfig } from "@/services/portfolio.service";
import { Badge } from "@/components/ui/badge";
import { Award, Briefcase, GraduationCap } from "lucide-react";

export const metadata = generateSEO({
  title: "About",
  description: `Learn more about ${siteConfig.author.name} - ${siteConfig.author.title}`,
  path: "/about",
});

export default async function AboutPage() {
  const portfolioConfig = await getPortfolioConfig();

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">About Me</h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">{portfolioConfig.author.bio}</p>
          <p className="mt-4 text-muted leading-relaxed">
            Based in {portfolioConfig.author.location}, I specialize in building scalable web
            applications with modern technologies. My approach combines clean architecture,
            performance optimization, and thoughtful user experience design.
          </p>
        </div>

        <section className="mt-16">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold">Experience</h2>
          </div>
          <div className="space-y-6">
            {portfolioConfig.experience.map((exp) => (
              <div key={exp.title} className="glass rounded-xl p-6 relative pl-8 border-l-2 border-accent/30">
                <div className="absolute left-0 top-6 w-2 h-2 rounded-full bg-accent -translate-x-[5px]" />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-accent text-sm">{exp.company}</p>
                  </div>
                  <Badge variant="outline">{exp.period}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold">Education</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {portfolioConfig.education.map((edu) => (
              <div key={edu.degree} className="glass rounded-xl p-6">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm text-accent mt-1">{edu.institution}</p>
                <p className="text-sm text-muted mt-2">{edu.period}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-center gap-2 mb-8">
            <Award className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold">Certifications</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioConfig.certifications.map((cert) => (
              <div key={cert.name} className="glass rounded-xl p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-sm text-muted mt-1">{cert.issuer}</p>
                  </div>
                  {cert.certificateUrl ? (
                    <div className="relative h-36 overflow-hidden rounded-xl border border-border bg-background">
                      <Image src={cert.certificateUrl} alt={cert.name} fill className="object-cover" sizes="240px" />
                    </div>
                  ) : null}
                  <Badge variant="accent">{cert.year}</Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {portfolioConfig.skills.map((skill) => (
              <Badge key={skill.name} variant="outline">{skill.name}</Badge>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
