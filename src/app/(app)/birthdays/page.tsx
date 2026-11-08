import { BirthdayOverview } from "@/components/birthdays/BirthdayOverview";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireAuthenticated } from "@/lib/auth/guards";
import { getBirthdayEntriesFromGroups } from "@/lib/google-sheets/birthdays";
import {
  getAttendanceGroupDetails,
  getAccessibleAttendanceStages,
  getStageChildrenForStages,
} from "@/lib/google-sheets/attendance.server";
import type { StageId } from "@/config/stages";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أعياد الميلاد",
};

export default async function BirthdaysPage() {
  const profile = await requireAuthenticated();
  const stages = getAccessibleAttendanceStages(profile.role, profile.stageIds);
  if (stages.length === 0) redirect("/stages?error=not-authorized");

  const result = await getStageChildrenForStages(stages.map((stage) => stage.id));
  const entries = result.ok
    ? result.groups.flatMap((group) =>
        getBirthdayEntriesFromGroups([group]).map((entry) => ({
          ...entry,
          stageId: getAttendanceGroupDetails(group.id).stageId,
        })),
      )
    : [];
  const birthdayEntries = entries;
  let whatsappContacts: Partial<Record<StageId, string[]>> = {};
  let whatsappContactsError: string | undefined;

  if (profile.role === "admin") {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("stage_whatsapp_contacts")
      .select("stage_id, whatsapp_phone");
    if (error) {
      console.error("Failed to load birthday WhatsApp contacts:", error.code);
      whatsappContactsError =
        "تعذر تحميل أرقام مسؤولي المراحل. راجع إعدادات قاعدة البيانات.";
    } else {
      whatsappContacts = data.reduce<Partial<Record<StageId, string[]>>>(
        (contacts, contact) => {
          const stageId = contact.stage_id as StageId;
          contacts[stageId] = [
            ...(contacts[stageId] ?? []),
            contact.whatsapp_phone,
          ];
          return contacts;
        },
        {},
      );
    }
  }

  const birthdayStages = stages.map((stage) => ({
    stageId: stage.id,
    stageName: stage.name,
    children: entries.filter(
      (entry) => entry.stageId === stage.id && entry.isToday,
    ),
    whatsappNumbers: whatsappContacts[stage.id] ?? [],
  }));

  return (
    <>
      <PageHeader
        title="أعياد الميلاد"
        description="عرض أعياد ميلاد مراحل الخدمة المتاحة لحسابك بناءً على تواريخ الميلاد المسجلة."
      />

      {result.ok ? (
        <BirthdayOverview
          items={birthdayEntries}
          birthdayStages={birthdayStages}
          isAdmin={profile.role === "admin"}
          whatsappContactsError={whatsappContactsError}
          sourceRecordCount={result.groups.reduce(
            (total, group) => total + group.rows.length,
            0,
          )}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground">تعذر تحميل أعياد الميلاد</h2>
          <p className="mt-2 text-sm text-muted-foreground">{result.error}</p>
        </div>
      )}
    </>
  );
}
