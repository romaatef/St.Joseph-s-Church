import { ChurchMark } from "@/components/brand/ChurchMark";
import { church } from "@/config/church";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <ChurchMark className="mb-4 size-12" />
          <h1 className="text-xl font-bold sm:text-2xl">{church.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{church.appName}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
