import Link from "next/link";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/services/project.service";
import type { DashboardStats } from "@/types";

const emptyStats: DashboardStats = {
  totalProjects: 0,
  featuredProjects: 0,
  categoriesCount: 0,
  recentProjects: [],
  totalViews: 0,
  unreadMessages: 0,
  subscribersCount: 0,
};

export default async function AdminDashboardPage() {
  let stats = emptyStats;
  try {
    stats = await getDashboardStats();
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Overview of your portfolio</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>

      <StatsCards stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentProjects.length === 0 ? (
            <p className="text-sm text-muted">No projects yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{project.title}</p>
                    <p className="text-xs text-muted">{project.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={project.published ? "accent" : "default"}>
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                    <Link href={`/admin/projects/${project._id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
