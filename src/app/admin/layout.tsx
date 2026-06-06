import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
