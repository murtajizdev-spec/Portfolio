import { generateSEO } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { ContactForm } from "@/components/portfolio/contact-form";
import { Mail, MapPin } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "@/components/ui/social-icons";

export const metadata = generateSEO({
  title: "Contact",
  description: `Get in touch with ${siteConfig.author.name}`,
  path: "/contact",
});

const socialLinks = [
  { icon: GitHubIcon, label: "GitHub", href: siteConfig.social.github },
  { icon: LinkedInIcon, label: "LinkedIn", href: siteConfig.social.linkedin },
  { icon: TwitterIcon, label: "Twitter", href: siteConfig.social.twitter },
  { icon: Mail, label: "Email", href: siteConfig.social.email },
];

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Get in Touch</h1>
            <p className="mt-4 text-muted leading-relaxed">
              Have a project in mind or want to collaborate? I&apos;d love to hear from you.
              Fill out the form and I&apos;ll get back to you as soon as possible.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-muted">
                <MapPin className="h-5 w-5 text-accent" />
                <span>{siteConfig.author.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted">
                <Mail className="h-5 w-5 text-accent" />
                <a href={siteConfig.social.email} className="hover:text-foreground transition-colors">
                  {siteConfig.author.email}
                </a>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-medium mb-4">Connect with me</h3>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-3 glass hover:bg-foreground/5 transition-colors"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
