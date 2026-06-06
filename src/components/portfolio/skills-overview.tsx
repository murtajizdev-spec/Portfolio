"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { SkillItem } from "@/types";

interface SkillsOverviewProps {
  skills: SkillItem[];
}

export function SkillsOverview({ skills }: SkillsOverviewProps) {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Skills & Technologies</h2>
          <p className="mt-2 text-muted">Tools and technologies I work with daily.</p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="font-semibold mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <Badge key={skill.name} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
