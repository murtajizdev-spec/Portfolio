import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="glass rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-purple-500/5" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Let&apos;s build something together
            </h2>
            <p className="mt-4 text-muted max-w-lg mx-auto">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities
              to be part of your vision.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg">Start a Conversation</Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg">
                  Browse Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
