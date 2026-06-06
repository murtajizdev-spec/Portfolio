"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "@/components/ui/social-icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import type { HomeHero, PortfolioAuthor } from "@/types";

interface HeroProps {
  author: PortfolioAuthor;
  hero: HomeHero;
}

export function Hero({ author, hero }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-medium text-accent mb-4">
            {author.title}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            {hero.title}
            <span className="gradient-text"> {hero.highlight}</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/projects">
              <Button size="lg">
                View Projects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex gap-4">
            {[
              { icon: GitHubIcon, href: siteConfig.social.github, label: "GitHub" },
              { icon: LinkedInIcon, href: siteConfig.social.linkedin, label: "LinkedIn" },
              { icon: TwitterIcon, href: siteConfig.social.twitter, label: "Twitter" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2.5 glass hover:bg-foreground/5 transition-colors"
                aria-label={label}
              >
                <Icon className="h-5 w-5 text-muted" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
