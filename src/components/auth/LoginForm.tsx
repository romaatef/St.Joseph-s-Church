"use client";

import { signInAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { LoginState } from "@/app/actions/auth";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useActionState, useState } from "react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    signInAction,
    {},
  );

  return (
    <form className="mt-6 space-y-4" aria-label="نموذج تسجيل الدخول" action={formAction}>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          البريد الإلكتروني
        </label>
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="username"
          placeholder="name@example.com"
          dir="ltr"
          className="h-12 rounded-2xl border border-border bg-background text-left text-sm shadow-none transition focus-visible:ring-2 focus-visible:ring-primary/35"
          aria-invalid={Boolean(state.emailError)}
          aria-describedby={state.emailError ? "email-error" : undefined}
          disabled={isPending}
        />
        {state.emailError ? (
          <p id="email-error" className="mt-1.5 text-sm text-red-700" role="alert">
            {state.emailError}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
          كلمة المرور
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            dir="ltr"
            className="h-12 rounded-2xl border border-border bg-background pr-12 text-left text-sm shadow-none transition focus-visible:ring-2 focus-visible:ring-primary/35"
            aria-invalid={Boolean(state.passwordError)}
            aria-describedby={state.passwordError ? "password-error" : undefined}
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            disabled={isPending}
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center rounded-r-2xl text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 disabled:opacity-60"
          >
            {showPassword ? (
              <EyeOff className="size-5" aria-hidden />
            ) : (
              <Eye className="size-5" aria-hidden />
            )}
          </button>
        </div>
        {state.passwordError ? (
          <p id="password-error" className="mt-1.5 text-sm text-red-700" role="alert">
            {state.passwordError}
          </p>
        ) : null}
      </div>

      {state.error ? (
        <p
          className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-6 text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="h-12 w-full rounded-2xl" disabled={isPending}>
        {isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            جارٍ تسجيل الدخول...
          </>
        ) : (
          "تسجيل الدخول"
        )}
      </Button>
    </form>
  );
}
