import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
};

export default function LoginPage() {
  return (
    <Card className="border border-border/80 bg-surface/95 p-6 shadow-soft">
      <CardTitle className="text-center text-2xl">تسجيل الدخول</CardTitle>
      <CardDescription className="mt-2 text-center">
        أدخل بياناتك للمتابعة إلى نظام إدارة الكنيسة.
      </CardDescription>
      <LoginForm />
    </Card>
  );
}
