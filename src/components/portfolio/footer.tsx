import Link from "next/link";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "@/components/ui/social-icons";
import { siteConfig } from "@/lib/site-config";
import { NewsletterForm } from "@/components/portfolio/newsletter-form";

const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  email: Mail,
};

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-2">{siteConfig.name}</h3>
            <p className="text-sm text-muted max-w-xs">{siteConfig.description}</p>
            <div className="flex gap-3 mt-4">
              {Object.entries(siteConfig.social).map(([key, href]) => {
                const Icon = socialIcons[key as keyof typeof socialIcons];
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
                    aria-label={key}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Newsletter</h4>
            <p className="text-sm text-muted mb-3">Get updates on new projects and articles.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted">
          © {new Date().getFullYear()} {siteConfig.author.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
