import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Bell,
  Cake,
  CalendarX,
  ClipboardList,
  ContactRound,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Settings,
  UsersRound,
} from "lucide-react";

export type AppRoute =
  | "/"
  | "/login"
  | "/dashboard"
  | "/children"
  | "/attendance"
  | "/repeated-absence"
  | "/visitation"
  | "/birthdays"
  | "/notifications"
  | "/users"
  | "/servants"
  | "/settings";

export type NavItem = {
  href: AppRoute;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const mainNav: readonly NavItem[] = [
  {
    href: "/",
    label: "الرئيسية",
    icon: LayoutDashboard,
    description: "نظرة عامة على الخدمة اليومية",
  },
  {
    href: "/children",
    label: "بيانات الأولاد",
    icon: Baby,
    description: "ملفات الأولاد ومعلوماتهم الأساسية",
  },
  {
    href: "/attendance",
    label: "الغياب",
    icon: ClipboardList,
    description: "تسجيل ومتابعة الحضور والغياب",
  },
  {
    href: "/repeated-absence",
    label: "الغياب المتكرر",
    icon: CalendarX,
    description: "متابعة من يتكرر غيابهم",
  },
  {
    href: "/visitation",
    label: "قوائم الافتقاد",
    icon: HeartHandshake,
    description: "تنظيم زيارات الافتقاد",
  },
  {
    href: "/birthdays",
    label: "أعياد الميلاد",
    icon: Cake,
    description: "أعياد ميلاد الأولاد هذا الأسبوع والشهر",
  },
  {
    href: "/notifications",
    label: "الإشعارات",
    icon: Bell,
    description: "تنبيهات الخدمة والمتابعة",
  },
  {
    href: "/users",
    label: "المستخدمين",
    icon: UsersRound,
    description: "إدارة حسابات الخدام والصلاحيات",
  },
  {
    href: "/servants",
    label: "بيانات الخدام",
    icon: ContactRound,
    description: "عرض بيانات مرحلة الخدام",
  },
  {
    href: "/settings",
    label: "الإعدادات",
    icon: Settings,
    description: "إعدادات النظام والكنيسة",
  },
] as const;

export const authNav: readonly NavItem[] = [
  {
    href: "/login",
    label: "تسجيل الخروج",
    icon: LogOut,
    description: "العودة إلى شاشة تسجيل الدخول",
  },
] as const;
