/**
 * Seed script — creates admin user and sample projects.
 * Run: npm run seed
 *
 * Requires MONGODB_URI and ADMIN_* env vars in .env.local
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio-cms";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin User";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "ADMIN" },
  },
  { timestamps: true },
);

const ProjectSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    shortDescription: String,
    fullDescription: String,
    category: String,
    technologies: [String],
    thumbnail: String,
    gallery: [String],
    githubUrl: String,
    liveUrl: String,
    features: [String],
    challenges: String,
    solutions: String,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    });
    console.log(`✓ Admin user created: ${ADMIN_EMAIL}`);
  } else {
    console.log(`→ Admin user already exists: ${ADMIN_EMAIL}`);
  }

  const sampleProjects = [
    {
      title: "E-Commerce Platform",
      slug: "ecommerce-platform",
      shortDescription:
        "A full-stack e-commerce platform with real-time inventory, payment processing, and admin dashboard.",
      fullDescription:
        "<p>Built a scalable e-commerce solution handling 10K+ daily transactions. Features include product catalog, cart management, Stripe payments, and order tracking.</p>",
      category: "Full-Stack",
      technologies: ["Next.js", "TypeScript", "MongoDB", "Stripe", "Tailwind CSS"],
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      features: ["Real-time inventory", "Stripe payments", "Admin dashboard", "Order tracking"],
      challenges: "<p>Handling concurrent inventory updates during flash sales.</p>",
      solutions: "<p>Implemented optimistic locking with Redis-based queue for order processing.</p>",
      featured: true,
      published: true,
    },
    {
      title: "Task Management App",
      slug: "task-management-app",
      shortDescription:
        "Collaborative task management with drag-and-drop boards, real-time updates, and team workspaces.",
      fullDescription:
        "<p>A Trello-inspired project management tool with real-time collaboration, file attachments, and activity feeds.</p>",
      category: "SaaS",
      technologies: ["React", "Node.js", "Socket.io", "PostgreSQL", "Redis"],
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=450&fit=crop",
      gallery: [],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      features: ["Drag-and-drop boards", "Real-time sync", "Team workspaces", "File attachments"],
      featured: true,
      published: true,
    },
    {
      title: "AI Content Generator",
      slug: "ai-content-generator",
      shortDescription:
        "AI-powered content generation tool with templates, SEO optimization, and multi-language support.",
      fullDescription:
        "<p>Leverages OpenAI API to generate blog posts, social media content, and marketing copy with built-in SEO analysis.</p>",
      category: "AI/ML",
      technologies: ["Next.js", "OpenAI", "Python", "FastAPI", "Tailwind CSS"],
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
      gallery: [],
      githubUrl: "https://github.com",
      features: ["AI generation", "SEO analysis", "Multi-language", "Template library"],
      featured: false,
      published: true,
    },
  ];

  for (const project of sampleProjects) {
    const slug = project.slug || slugify(project.title, { lower: true, strict: true });
    const exists = await Project.findOne({ slug });
    if (!exists) {
      await Project.create({ ...project, slug });
      console.log(`✓ Created project: ${project.title}`);
    } else {
      console.log(`→ Project exists: ${project.title}`);
    }
  }

  console.log("\nSeed completed!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
