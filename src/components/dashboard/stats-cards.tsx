import { FolderKanban, Star, Tags, Eye, Mail, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

const statConfig = [
  { key: "totalProjects" as const, label: "Total Projects", icon: FolderKanban },
  { key: "featuredProjects" as const, label: "Featured", icon: Star },
  { key: "categoriesCount" as const, label: "Categories", icon: Tags },
  { key: "totalViews" as const, label: "Total Views", icon: Eye },
  { key: "unreadMessages" as const, label: "Unread Messages", icon: Mail },
  { key: "subscribersCount" as const, label: "Subscribers", icon: Users },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statConfig.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-accent/10 p-3">
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted">{label}</p>
              <p className="text-2xl font-bold">{stats[key]}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
