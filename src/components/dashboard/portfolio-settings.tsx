"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/dashboard/image-upload";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PortfolioConfig,
  SkillItem,
} from "@/types";
import { siteConfig } from "@/lib/site-config";

function normalizeHomepageSettings(config: Partial<PortfolioConfig> | null): PortfolioConfig["homepage"] {
  const hero = {
    title: config?.homepage?.hero?.title ?? siteConfig.homepage.hero.title,
    highlight: config?.homepage?.hero?.highlight ?? siteConfig.homepage.hero.highlight,
    description: config?.homepage?.hero?.description ?? siteConfig.homepage.hero.description,
  };

  const roleHighlights = {
    title: config?.homepage?.roleHighlights?.title ?? siteConfig.homepage.roleHighlights.title,
    subtitle:
      config?.homepage?.roleHighlights?.subtitle ?? siteConfig.homepage.roleHighlights.subtitle,
    roles:
      Array.isArray(config?.homepage?.roleHighlights?.roles) && config.homepage.roleHighlights.roles.length
        ? config.homepage.roleHighlights.roles.map((role, index) => ({
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

function normalizePortfolioConfig(config: Partial<PortfolioConfig> | null): PortfolioConfig {
  return {
    author: config?.author ?? siteConfig.author,
    homepage: normalizeHomepageSettings(config),
    experience: config?.experience ?? [],
    education: config?.education ?? [],
    certifications: config?.certifications ?? [],
    skills: config?.skills ?? [],
  };
}

const emptyExperience: ExperienceItem = {
  title: "",
  company: "",
  period: "",
  description: "",
};

const emptyEducation: EducationItem = {
  degree: "",
  institution: "",
  period: "",
};

const emptyCertification: CertificationItem = {
  name: "",
  issuer: "",
  year: "",
  certificateUrl: "",
};

const emptyRoleHighlight = {
  title: "",
  description: "",
};

const emptySkill: SkillItem = {
  name: "",
  category: "",
};

type SettingsTab = "Homepage" | "Profile" | "Experience" | "Education" | "Certifications" | "Skills";

const tabs: SettingsTab[] = ["Homepage", "Profile", "Experience", "Education", "Certifications", "Skills"];

export function PortfolioSettings() {
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState<SettingsTab>("Profile");

  useEffect(() => {
    fetch("/api/portfolio", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setConfig(normalizePortfolioConfig(data)))
      .catch(() => toast.error("Unable to load portfolio settings"))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (path: string, value: string) => {
    if (!config) return;
    setConfig((current) => {
      if (!current) return current;
      return {
        ...current,
        author: {
          ...current.author,
          [path]: value,
        },
      } as PortfolioConfig;
    });
  };

  const updateHomepageField = (section: "hero" | "roleHighlights", path: string, value: string) => {
    if (!config) return;
    setConfig((current) => {
      if (!current) return current;
      return {
        ...current,
        homepage: {
          ...(current.homepage ?? siteConfig.homepage),
          [section]: {
            ...(current.homepage?.[section as "hero" | "roleHighlights"] ?? (siteConfig.homepage as any)[section]),
            [path]: value,
          },
        },
      } as PortfolioConfig;
    });
  };

  const updateRoleHighlightItem = (index: number, field: string, value: string) => {
    if (!config) return;
    setConfig((current) => {
      if (!current) return current;
      const roles = [...((current.homepage ?? siteConfig.homepage).roleHighlights.roles)];
      const item = { ...roles[index], [field]: value };
      roles[index] = item;
      return {
        ...current,
        homepage: {
          ...(current.homepage ?? siteConfig.homepage),
          roleHighlights: {
            ...((current.homepage ?? siteConfig.homepage).roleHighlights),
            roles,
          },
        },
      } as PortfolioConfig;
    });
  };

  const addRoleHighlightItem = () => {
    if (!config) return;
    setConfig((current) => {
      if (!current) return current;
      return {
        ...current,
        homepage: {
          ...(current.homepage ?? siteConfig.homepage),
          roleHighlights: {
            ...((current.homepage ?? siteConfig.homepage).roleHighlights),
            roles: [...((current.homepage ?? siteConfig.homepage).roleHighlights.roles), emptyRoleHighlight],
          },
        },
      } as PortfolioConfig;
    });
  };

  const removeRoleHighlightItem = (index: number) => {
    if (!config) return;
    setConfig((current) => {
      if (!current) return current;
      const roles = [...((current.homepage ?? siteConfig.homepage).roleHighlights.roles)];
      roles.splice(index, 1);
      return {
        ...current,
        homepage: {
          ...(current.homepage ?? siteConfig.homepage),
          roleHighlights: {
            ...((current.homepage ?? siteConfig.homepage).roleHighlights),
            roles,
          },
        },
      } as PortfolioConfig;
    });
  };

  const updateArrayItem = <T extends object>(
    key: keyof PortfolioConfig,
    index: number,
    field: string,
    value: string,
  ) => {
    if (!config) return;
    setConfig((current) => {
      if (!current) return current;
      const array = [...(current[key] as T[])];
      const item = { ...(array[index] as Record<string, unknown>) };
      item[field] = value;
      array[index] = item as T;
      return { ...current, [key]: array } as PortfolioConfig;
    });
  };

  const addArrayItem = (key: keyof PortfolioConfig) => {
    if (!config) return;
    setConfig((current) => {
      if (!current) return current;
      const next = { ...current } as PortfolioConfig;
      if (key === "experience") {
        next.experience = [...current.experience, emptyExperience];
      }
      if (key === "education") {
        next.education = [...current.education, emptyEducation];
      }
      if (key === "certifications") {
        next.certifications = [...current.certifications, emptyCertification];
      }
      if (key === "skills") {
        next.skills = [...current.skills, emptySkill];
      }
      return next;
    });
  };

  const removeArrayItem = (key: keyof PortfolioConfig, index: number) => {
    if (!config) return;
    setConfig((current) => {
      if (!current) return current;
      const array = [...(current[key] as any[])];
      array.splice(index, 1);
      return { ...current, [key]: array } as PortfolioConfig;
    });
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Save failed");
      }
      setConfig(data);
      toast.success("Portfolio settings saved");
    } catch (error) {
      toast.error("Failed to save portfolio settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-muted">Loading portfolio settings...</div>;
  }

  if (!config) {
    return <div className="text-muted">No portfolio settings found.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Portfolio Settings</h1>
        <p className="text-muted text-sm mt-1">Edit profile, experience, education, certifications, and skills in separate tabs.</p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-3xl border border-border bg-background p-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedTab(tab)}
            className={cn(
              "rounded-2xl px-4 py-2 text-sm font-medium transition",
              selectedTab === tab
                ? "bg-accent text-white"
                : "text-muted hover:bg-foreground/5",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {selectedTab === "Homepage" && (
        <div className="glass rounded-xl p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Homepage</h2>
              <p className="text-sm text-muted">Edit the hero text and top role highlights shown on the home page.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                label="Hero title"
                value={(config.homepage ?? siteConfig.homepage).hero.title}
                onChange={(e) => updateHomepageField("hero", "title", e.target.value)}
              />
              <Input
                label="Hero highlight"
                value={(config.homepage ?? siteConfig.homepage).hero.highlight}
                onChange={(e) => updateHomepageField("hero", "highlight", e.target.value)}
              />
              <Textarea
                label="Hero description"
                value={(config.homepage ?? siteConfig.homepage).hero.description}
                onChange={(e) => updateHomepageField("hero", "description", e.target.value)}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                label="Highlights section title"
                value={(config.homepage ?? siteConfig.homepage).roleHighlights.title}
                onChange={(e) => updateHomepageField("roleHighlights", "title", e.target.value)}
              />
              <Input
                label="Highlights section subtitle"
                value={(config.homepage ?? siteConfig.homepage).roleHighlights.subtitle}
                onChange={(e) => updateHomepageField("roleHighlights", "subtitle", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">Role highlights</h3>
                <Button variant="outline" size="sm" onClick={addRoleHighlightItem}>Add Role</Button>
              </div>
              {(config.homepage ?? siteConfig.homepage).roleHighlights.roles.map((role, index) => (
                <div key={`${role.title}-${index}`} className="glass rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <Badge variant="accent">Role {index + 1}</Badge>
                    <Button variant="danger" size="sm" onClick={() => removeRoleHighlightItem(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <Input
                      label="Role title"
                      value={role.title}
                      onChange={(e) => updateRoleHighlightItem(index, "title", e.target.value)}
                    />
                    <Textarea
                      label="Role description"
                      value={role.description}
                      onChange={(e) => updateRoleHighlightItem(index, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === "Profile" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Experience</h2>
              <p className="text-sm text-muted">Add, edit, and remove experience entries.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => addArrayItem("experience")}>Add Experience</Button>
          </div>

          <div className="space-y-4">
            {config.experience.map((item, index) => (
              <div key={`${item.title}-${index}`} className="glass rounded-xl border border-border p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Badge variant="accent">Entry {index + 1}</Badge>
                  <Button variant="danger" size="sm" onClick={() => removeArrayItem("experience", index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Input
                    label="Title"
                    value={item.title}
                    onChange={(e) => updateArrayItem("experience", index, "title", e.target.value)}
                  />
                  <Input
                    label="Company"
                    value={item.company}
                    onChange={(e) => updateArrayItem("experience", index, "company", e.target.value)}
                  />
                  <Input
                    label="Period"
                    value={item.period}
                    onChange={(e) => updateArrayItem("experience", index, "period", e.target.value)}
                  />
                  <Textarea
                    label="Description"
                    value={item.description}
                    onChange={(e) => updateArrayItem("experience", index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedTab === "Education" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Education</h2>
              <p className="text-sm text-muted">Update your education history.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => addArrayItem("education")}>Add Education</Button>
          </div>

          <div className="space-y-4">
            {config.education.map((item, index) => (
              <div key={`${item.degree}-${index}`} className="glass rounded-xl border border-border p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Badge variant="accent">Entry {index + 1}</Badge>
                  <Button variant="danger" size="sm" onClick={() => removeArrayItem("education", index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Input
                    label="Degree"
                    value={item.degree}
                    onChange={(e) => updateArrayItem("education", index, "degree", e.target.value)}
                  />
                  <Input
                    label="Institution"
                    value={item.institution}
                    onChange={(e) => updateArrayItem("education", index, "institution", e.target.value)}
                  />
                  <Input
                    label="Period"
                    value={item.period}
                    onChange={(e) => updateArrayItem("education", index, "period", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedTab === "Certifications" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Certifications</h2>
              <p className="text-sm text-muted">Add certificates and upload certificate images.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => addArrayItem("certifications")}>Add Certification</Button>
          </div>

          <div className="space-y-4">
            {config.certifications.map((item, index) => (
              <div key={`${item.name}-${index}`} className="glass rounded-xl border border-border p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Badge variant="accent">Entry {index + 1}</Badge>
                  <Button variant="danger" size="sm" onClick={() => removeArrayItem("certifications", index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Input
                    label="Certificate"
                    value={item.name}
                    onChange={(e) => updateArrayItem("certifications", index, "name", e.target.value)}
                  />
                  <Input
                    label="Issuer"
                    value={item.issuer}
                    onChange={(e) => updateArrayItem("certifications", index, "issuer", e.target.value)}
                  />
                  <Input
                    label="Year"
                    value={item.year}
                    onChange={(e) => updateArrayItem("certifications", index, "year", e.target.value)}
                  />
                  <ImageUpload
                    label="Certificate Image"
                    images={item.certificateUrl ? [item.certificateUrl] : []}
                    onChange={(images) => updateArrayItem("certifications", index, "certificateUrl", images[0] || "")}
                    multiple={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedTab === "Skills" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Skills</h2>
              <p className="text-sm text-muted">Edit the skill tags shown on the about page.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => addArrayItem("skills")}>Add Skill</Button>
          </div>

          <div className="space-y-4">
            {config.skills.map((item, index) => (
              <div key={`${item.name}-${index}`} className="glass rounded-xl border border-border p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Badge variant="accent">Skill {index + 1}</Badge>
                  <Button variant="danger" size="sm" onClick={() => removeArrayItem("skills", index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Input
                    label="Skill"
                    value={item.name}
                    onChange={(e) => updateArrayItem("skills", index, "name", e.target.value)}
                  />
                  <Input
                    label="Category"
                    value={item.category}
                    onChange={(e) => updateArrayItem("skills", index, "category", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex justify-end">
        <Button loading={saving} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
