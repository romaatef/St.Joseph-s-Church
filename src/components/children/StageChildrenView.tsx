"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { postAttendanceApi } from "@/lib/attendance-api-client";
import type {
  AttendanceGroup,
  StageChildrenResult,
} from "@/lib/google-sheets/attendance.server";
import { normalizePhoneNumber } from "@/lib/utils";
import { Pencil, Phone, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";

const CHILD_DETAILS = [
  { index: 3, label: "رقم المنزل" },
  { index: 4, label: "الشارع" },
  { index: 5, label: "المنطقة" },
  { index: 6, label: "تاريخ الميلاد" },
  { index: 7, label: "أب الاعتراف" },
  { index: 8, label: "الموقع" },
  { index: 9, label: "ملاحظات" },
];

type SelectedChild = {
  groupId: AttendanceGroup;
  sectionName: string;
  name: string;
  phone: string;
  homeNumber: string;
  street: string;
  area: string;
  birthDate: string;
  confessionFather: string;
  location: string;
  notes: string;
};

export function StageChildrenView({
  result,
  readOnly = false,
}: {
  result: StageChildrenResult;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedChild, setSelectedChild] = useState<SelectedChild | null>(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [notice, setNotice] = useState("");
  const groupsWithRows = useMemo(() => {
    if (!result.ok) return [];
    const query = search.trim().toLocaleLowerCase("ar");
    return result.groups.map((group) => ({
      ...group,
      rows: query
        ? group.rows.filter((row) =>
            row.some((value) => value.toLocaleLowerCase("ar").includes(query)),
          )
        : group.rows,
    }));
  }, [result, search]);

  useEffect(() => {
    if (!selectedChild) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) setSelectedChild(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saving, selectedChild]);

  async function saveChild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChild || saving || readOnly) return;

    const formData = new FormData(event.currentTarget);
    const person = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      homeNumber: String(formData.get("homeNumber") ?? ""),
      street: String(formData.get("street") ?? ""),
      area: String(formData.get("area") ?? ""),
      birthDate: String(formData.get("birthDate") ?? ""),
      confessionFather: String(formData.get("confessionFather") ?? ""),
      location: String(formData.get("location") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    setSaving(true);
    setEditError("");
    setNotice("");
    try {
      const response = await postAttendanceApi<{ success: boolean; message: string }>({
        action: "updatePerson",
        group: selectedChild.groupId,
        currentName: selectedChild.name,
        person,
      });
      if (response.success !== true) throw new Error("لم يؤكد الخادم تحديث البيانات.");
      setSelectedChild(null);
      setNotice(response.message);
      router.refresh();
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "تعذر تحديث بيانات الطفل.");
    } finally {
      setSaving(false);
    }
  }

  if (!result.ok) {
    return (
      <Card role="alert">
        <CardTitle>تعذر تحميل بيانات المرحلة</CardTitle>
        <CardDescription>{result.error}</CardDescription>
      </Card>
    );
  }

  if (!result.groups.some((group) => group.rows.length > 0)) {
    return (
      <Card>
        <CardTitle>لا توجد بيانات أطفال لعرضها</CardTitle>
        <CardDescription>لم تُعثر على سجلات في أقسام المرحلة المحددة.</CardDescription>
      </Card>
    );
  }

  const matchingRecordCount = groupsWithRows.reduce(
    (total, group) => total + group.rows.length,
    0,
  );
  const visibleGroups = groupsWithRows.filter((group) => group.rows.length > 0);

  return (
    <div className="space-y-4">
      {notice ? (
        <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary-dark" role="status">
          {notice}
        </p>
      ) : null}
      <Card className="p-4">
        <label className="relative block">
          <span className="sr-only">بحث في بيانات الأولاد</span>
          <Search
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث بالاسم أو الهاتف أو العنوان"
            aria-label="بحث في بيانات الأولاد"
            className="h-11 w-full rounded-xl border border-border bg-background pr-10 text-right text-sm outline-none transition focus:border-primary"
          />
        </label>
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          {matchingRecordCount} سجل مطابق
        </p>
      </Card>

      {visibleGroups.map((group) => (
        <section key={group.id} className="space-y-3">
          <div className="flex items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{group.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {group.rows.length} {search.trim() ? "نتيجة" : "سجل"}
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.rows.map((row, index) => {
              const phone = row[2]?.trim() ?? "";
              const name = row[1]?.trim() ?? "";
              const child: SelectedChild = {
                groupId: group.id,
                sectionName: group.name,
                name,
                phone,
                homeNumber: row[3]?.trim() ?? "",
                street: row[4]?.trim() ?? "",
                area: row[5]?.trim() ?? "",
                birthDate: row[6]?.trim() ?? "",
                confessionFather: row[7]?.trim() ?? "",
                location: row[8]?.trim() ?? "",
                notes: row[9]?.trim() ?? "",
              };
              const details = CHILD_DETAILS
                .map(({ index: cellIndex, label }) => ({
                  label,
                  value: row[cellIndex]?.trim() ?? "",
                }))
                .filter((detail) => detail.value);

              return (
                <article
                  key={`${group.id}:${row[0]}:${index}`}
                  className="rounded-2xl border border-border bg-surface p-4 shadow-soft transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-foreground">
                        {name || "بدون اسم"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {row[0] ? `رقم ${row[0]}` : group.name}
                      </p>
                    </div>
                    {phone ? (
                      <a
                        href={`tel:${normalizePhoneNumber(phone)}`}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        aria-label={`اتصال بـ ${name || "الطفل"}`}
                      >
                        <Phone className="size-4" aria-hidden />
                        اتصال
                      </a>
                    ) : null}
                  </div>

                  {phone ? (
                    <p className="mt-3 text-sm text-muted-foreground" dir="ltr">
                      {phone}
                    </p>
                  ) : null}

                  {details.length > 0 ? (
                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-border pt-3">
                      {details.map(({ label, value }) => (
                        <div key={label} className="min-w-0">
                          <dt className="text-xs text-muted-foreground">{label}</dt>
                          <dd className="mt-1 break-words text-sm text-foreground">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {!readOnly ? (
                    <div className="mt-4 border-t border-border pt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditError("");
                          setSelectedChild(child);
                        }}
                      >
                        <Pencil className="size-4" aria-hidden />
                        تعديل البيانات
                      </Button>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}
      {matchingRecordCount === 0 ? (
        <Card>
          <CardDescription>لا توجد سجلات تطابق البحث.</CardDescription>
        </Card>
      ) : null}
      {selectedChild && !readOnly ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/30 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setSelectedChild(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="stage-child-dialog-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{selectedChild.sectionName}</p>
                <CardTitle id="stage-child-dialog-title" className="mt-1">
                  تعديل بيانات {selectedChild.name || "الطفل"}
                </CardTitle>
                <CardDescription>
                  سيتم تحديث بيانات الطفل في شيت البيانات وسجل الغياب.
                </CardDescription>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChild(null)}
                disabled={saving}
                className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                aria-label="إغلاق التعديل"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <form onSubmit={(event) => void saveChild(event)} className="mt-5 space-y-4">
              {editError ? (
                <p className="rounded-xl border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger" role="alert">
                  {editError}
                </p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium">
                  الاسم *
                  <Input name="name" required maxLength={150} defaultValue={selectedChild.name} disabled={saving} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  رقم الهاتف
                  <Input name="phone" type="tel" maxLength={500} defaultValue={selectedChild.phone} disabled={saving} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  رقم البيت
                  <Input name="homeNumber" maxLength={500} defaultValue={selectedChild.homeNumber} disabled={saving} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  الشارع
                  <Input name="street" maxLength={500} defaultValue={selectedChild.street} disabled={saving} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  المنطقة
                  <Input name="area" maxLength={500} defaultValue={selectedChild.area} disabled={saving} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  تاريخ الميلاد
                  <Input name="birthDate" placeholder="يوم/شهر/سنة" maxLength={500} defaultValue={selectedChild.birthDate} disabled={saving} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  أب الاعتراف
                  <Input name="confessionFather" maxLength={500} defaultValue={selectedChild.confessionFather} disabled={saving} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  الموقع الجغرافي
                  <Input name="location" maxLength={500} defaultValue={selectedChild.location} disabled={saving} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                  ملاحظات عن المخدوم
                  <Input name="notes" maxLength={500} defaultValue={selectedChild.notes} disabled={saving} />
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" disabled={saving} onClick={() => setSelectedChild(null)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
