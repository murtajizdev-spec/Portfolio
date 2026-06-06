"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { INewsletterSubscriber } from "@/types";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<INewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newsletter", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubscribers(data);
      })
      .catch(() => toast.error("Failed to load subscribers"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-muted">Loading subscribers...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <p className="text-muted text-sm mt-1">Email subscribers from the newsletter form</p>
      </div>

      {subscribers.length === 0 ? (
        <EmptyState
          title="No subscribers yet"
          description="Newsletter signups will appear here."
          icon={<Users className="h-8 w-8" />}
        />
      ) : (
        <div className="grid gap-4">
          {subscribers.map((subscriber) => (
            <Card key={subscriber._id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{subscriber.email}</p>
                    <p className="text-sm text-muted mt-1">
                      Subscribed on {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
