"use client";

import { motion } from "framer-motion";
import type { HomePanel } from "@/types";

interface RoleHighlightsProps {
  roleHighlights: HomePanel;
}

export function RoleHighlights({ roleHighlights }: RoleHighlightsProps) {
  return (
    <section className="py-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {roleHighlights.title}
          </h2>
          <p className="mt-2 text-muted">{roleHighlights.subtitle}</p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {roleHighlights.roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass rounded-3xl border border-border p-8"
            >
              <h3 className="text-xl font-semibold">{role.title}</h3>
              <p className="mt-4 text-muted leading-relaxed">{role.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
