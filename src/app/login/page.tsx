import { Suspense } from "react";
import { LoginForm } from "@/components/dashboard/login-form";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Login",
  description: "Admin login for portfolio CMS",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
