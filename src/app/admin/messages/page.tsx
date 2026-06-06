"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { IContactMessage } from "@/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<IContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(() => toast.error("Failed to load messages"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this message?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setMessages((current) => current.filter((message) => message._id !== id));
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  }

  async function handleToggleRead(id: string) {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ read: true }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Update failed");

      setMessages((current) =>
        current.map((message) =>
          message._id === id ? { ...message, read: true } : message,
        ),
      );
      toast.success("Message marked as read");
    } catch {
      toast.error("Failed to update message");
    }
  }

  if (loading) {
    return <div className="text-muted">Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted text-sm mt-1">Contact form submissions</p>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Contact form submissions will appear here."
          icon={<Mail className="h-8 w-8" />}
        />
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {msg.read ? (
                        <MailOpen className="h-4 w-4 text-muted" />
                      ) : (
                        <Mail className="h-4 w-4 text-accent" />
                      )}
                      <h3 className="font-semibold">{msg.subject}</h3>
                    </div>
                    <p className="text-sm text-muted mt-1">
                      {msg.name} · {msg.email}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                    </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={msg.read ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleToggleRead(msg._id)}
                    >
                      {msg.read ? "Read" : "Mark Read"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(msg._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed">{msg.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
