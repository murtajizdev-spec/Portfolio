export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Murtajiz Hassan",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  description:
    "Data scientist and web developer portfolio showcasing data-driven applications and interactive web experiences.",
  author: {
    name: "Murtajiz Hassan",
    title: "Data Scientist & Web Developer",
    email: "hello@example.com",
    location: "San Francisco, CA",
    avatar: "/avatar.jpg",
    bio: "I combine data science and web development to build fast, useful, and visually engaging digital products.",
  },
  homepage: {
    hero: {
      title: "I&apos;m Murtajiz Hassan — a data scientist and web developer creating",
      highlight: "intelligent, modern products.",
      description:
        "I collaborate across teams to turn data into polished web experiences that drive decisions and growth.",
    },
    roleHighlights: {
      title: "Dual focus: data science and web development",
      subtitle: "I deliver both analytical insight and polished web experiences.",
      roles: [
        {
          title: "Data Scientist",
          description:
            "Transform raw data into insights using Python, machine learning, visualization, and statistics.",
        },
        {
          title: "Web Developer",
          description:
            "Build fast, responsive web applications with Next.js, React, and modern cloud APIs.",
        },
      ],
    },
  },
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "mailto:hello@example.com",
  },
  skills: [
    { name: "Python", category: "Language" },
    { name: "Data Science", category: "Analytics" },
    { name: "Machine Learning", category: "Analytics" },
    { name: "TensorFlow", category: "Analytics" },
    { name: "PyTorch", category: "Analytics" },
    { name: "scikit-learn", category: "Analytics" },
    { name: "Pandas", category: "Analytics" },
    { name: "NumPy", category: "Analytics" },
    { name: "SQL", category: "Database" },
    { name: "TypeScript", category: "Language" },
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "MongoDB", category: "Database" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "GraphQL", category: "Backend" },
    { name: "Docker", category: "DevOps" },
    { name: "AWS", category: "DevOps" },
    { name: "Redis", category: "Database" },
  ],
  experience: [
    {
      title: "Senior Full-Stack Developer",
      company: "TechCorp Inc.",
      period: "2022 — Present",
      description:
        "Lead development of microservices architecture serving 2M+ users. Mentored junior developers and established coding standards.",
    },
    {
      title: "Full-Stack Developer",
      company: "StartupXYZ",
      period: "2020 — 2022",
      description:
        "Built and shipped multiple SaaS products from concept to production. Implemented CI/CD pipelines and automated testing.",
    },
    {
      title: "Frontend Developer",
      company: "Digital Agency",
      period: "2018 — 2020",
      description:
        "Developed responsive web applications for enterprise clients. Optimized performance achieving 95+ Lighthouse scores.",
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "University of Technology",
      period: "2014 — 2018",
    },
  ],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", year: "2023" },
    { name: "MongoDB Developer", issuer: "MongoDB Inc.", year: "2022" },
    { name: "Meta Front-End Developer", issuer: "Meta", year: "2021" },
  ],
  navLinks: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ],
};

export function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
  // Ensure the URL includes a protocol. If VERCEL_URL is provided it may be just the host.
  if (!envUrl.startsWith("http://") && !envUrl.startsWith("https://")) {
    return `https://${envUrl}`;
  }
  return envUrl;
}
