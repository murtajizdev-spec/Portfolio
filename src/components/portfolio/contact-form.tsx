"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@/validators/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to send message");
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" id="name" error={errors.name?.message} {...register("name")} />
        <Input
          label="Email"
          id="email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <Input label="Subject" id="subject" error={errors.subject?.message} {...register("subject")} />
      <Textarea
        label="Message"
        id="message"
        rows={5}
        error={errors.message?.message}
        {...register("message")}
      />
      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
