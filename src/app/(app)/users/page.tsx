import { UsersManager, type ManagedUser } from "@/components/users/UsersManager";
import { requireAuthenticated } from "@/lib/auth/guards";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "المستخدمين",
};

async function loadManagedUsers(): Promise<
  { ok: true; users: ManagedUser[] } | { ok: false; error: string }
> {
  try {
    const admin = createSupabaseAdminClient();
    const [{ data: profiles, error: profilesError }, { data: assignments, error: assignmentsError }] =
      await Promise.all([
        admin
          .from("profiles")
          .select("id, name, role, active")
          .order("name", { ascending: true }),
        admin.from("stage_responsibilities").select("user_id, stage_id"),
      ]);

    if (profilesError || assignmentsError) {
      return {
        ok: false,
        error:
          "تعذر قراءة بيانات المستخدمين والصلاحيات. تحقق من تشغيل SQL المطلوب في Supabase.",
      };
    }

    const authUsers = [];
    for (let page = 1; ; page += 1) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) {
        return { ok: false, error: "تعذر قراءة حسابات Supabase Auth." };
      }
      authUsers.push(...data.users);
      if (data.users.length < 1000) break;
    }

    const emailById = new Map(
      authUsers.map((user) => [user.id, user.email ?? ""]),
    );
    const stageIdsByUser = new Map<string, ManagedUser["stageIds"]>();
    for (const assignment of assignments) {
      const userStages = stageIdsByUser.get(assignment.user_id) ?? [];
      if (!userStages.includes(assignment.stage_id)) userStages.push(assignment.stage_id);
      stageIdsByUser.set(assignment.user_id, userStages);
    }

    const users: ManagedUser[] = profiles.map((profile) => ({
      ...profile,
      email: emailById.get(profile.id) ?? "",
      stageIds: stageIdsByUser.get(profile.id) ?? [],
    }));

    return { ok: true, users };
  } catch {
    return {
      ok: false,
      error:
        "تعذر الاتصال بخدمة إدارة المستخدمين. تحقق من إعداد SUPABASE_SERVICE_ROLE_KEY.",
    };
  }
}

export default async function UsersPage() {
  const profile = await requireAuthenticated();
  if (profile.role !== "admin" && profile.role !== "viewer") {
    return (
      <Card role="alert">
        <CardTitle>لا تملك صلاحية عرض المستخدمين</CardTitle>
        <CardDescription>عرض الحسابات متاح لمدير النظام وViewer فقط.</CardDescription>
      </Card>
    );
  }
  if (!isSupabaseAdminConfigured()) {
    return (
      <>
        <h1 className="mb-5 text-2xl font-bold text-foreground sm:text-3xl">المستخدمين</h1>
        <Card>
          <CardTitle>إعداد الخادم مطلوب</CardTitle>
          <CardDescription>
            أضف SUPABASE_SERVICE_ROLE_KEY إلى .env.local على الخادم فقط، ثم أعد تشغيل التطبيق
            لقراءة البريد الإلكتروني وإدارة حسابات Supabase Auth.
          </CardDescription>
        </Card>
      </>
    );
  }

  const result = await loadManagedUsers();
  if (!result.ok) {
    return <UsersManager users={[]} loadError={result.error} />;
  }
  return <UsersManager users={result.users} readOnly={profile.role === "viewer"} />;
}
