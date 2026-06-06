import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Eye, Mail, MapPin } from "lucide-react";
import { GitHubIcon } from "@/components/ui/social-icons";
import { generateSEO } from "@/lib/seo";
import { getProjectBySlug } from "@/services/project.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "@/lib/site-config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);
    if (!project) return {};
    return generateSEO({
      title: project.title,
      description: project.shortDescription,
      path: `/projects/${slug}`,
      image: project.thumbnail,
    });
  } catch {
    return {};
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let project = null;

  try {
    project = await getProjectBySlug(slug, true);
  } catch {
    // DB not connected
  }

  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    url: `${getBaseUrl()}/projects/${project.slug}`,
    image: project.thumbnail,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <header>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="accent">{project.category}</Badge>
              {project.featured && <Badge variant="default">Featured</Badge>}
              <span className="flex items-center gap-1 text-sm text-muted">
                <Eye className="h-3.5 w-3.5" />
                {project.views} views
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{project.title}</h1>
            <p className="mt-4 text-lg text-muted">{project.shortDescription}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <GitHubIcon className="h-4 w-4" />
                    View Code
                  </Button>
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </Button>
                </a>
              )}
            </div>
          </header>

          <div className="mt-10 relative aspect-video rounded-xl overflow-hidden glass">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mt-12 prose-content">
            <h2>Overview</h2>
            <div dangerouslySetInnerHTML={{ __html: project.fullDescription }} />
          </div>

          {project.features.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-muted">
                    <span className="text-accent mt-1">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(project.challenges || project.solutions) && (
            <section className="mt-12 grid gap-6 sm:grid-cols-2">
              {project.challenges && (
                <div className="glass rounded-xl p-6">
                  <h3 className="font-semibold mb-3">Challenges</h3>
                  <div
                    className="text-sm text-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.challenges }}
                  />
                </div>
              )}
              {project.solutions && (
                <div className="glass rounded-xl p-6">
                  <h3 className="font-semibold mb-3">Solutions</h3>
                  <div
                    className="text-sm text-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.solutions }}
                  />
                </div>
              )}
            </section>
          )}

          {project.gallery.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-6">Screenshots</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.gallery.map((image, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden glass">
                    <Image
                      src={image}
                      alt={`${project.title} screenshot ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 896px) 100vw, 448px"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
