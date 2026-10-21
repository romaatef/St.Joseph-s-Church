"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { postAttendanceApi } from "@/lib/attendance-api-client";
import type {
  AttendanceGroup,
  StageChildrenResult,
} from "@/lib/google-sheets/attendance.server";
import { normalizeBirthDate } from "@/lib/google-sheets/birth-date";
import { normalizePhoneNumber } from "@/lib/utils";
import { Pencil, Phone, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type ChildRecord = {
  id: string;
  name: string;
  phone: string;
  homeNumber: string;
  street: string;
  area: string;
  birthDate: string;
  confessionFather: string;
  location: string;
  notes: string;
  groupId: AttendanceGroup;
  sectionName: string;
};

type FiveSixChildrenViewProps = {
  result: StageChildrenResult;
  readOnly?: boolean;
  stageName?: string;
};

export function FiveSixChildrenView({
  result,
  readOnly = false,
  stageName = "المرحلة",
}: FiveSixChildrenViewProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [selectedChild, setSelectedChild] = useState<ChildRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!selectedChild) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) {
        setSelectedChild(null);
        setEditing(false);
      }
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
      setEditing(false);
      setNotice(response.message);
      router.refresh();
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "تعذر تحديث بيانات الطفل.");
    } finally {
      setSaving(false);
    }
  }

  const children = useMemo<ChildRecord[]>(() => {
    if (!result.ok) return [];

    return result.groups.flatMap((section) =>
      section.rows.map((row, index) => ({
        id: `${section.id}-${index}`,
        name: String(row[1] ?? "").trim(),
        phone: String(row[2] ?? "").trim(),
        homeNumber: String(row[3] ?? "").trim(),
        street: String(row[4] ?? "").trim(),
        area: String(row[5] ?? "").trim(),
        birthDate: normalizeBirthDate(row[6]),
        confessionFather: String(row[7] ?? "").trim(),
        location: String(row[8] ?? "").trim(),
        notes: String(row[9] ?? "").trim(),
        groupId: section.id,
        sectionName: section.name,
      })),
    );
  }, [result]);

  const sections = useMemo(
    () => Array.from(new Set(children.map((child) => child.sectionName))),
    [children],
  );

  const areas = useMemo(
    () => Array.from(new Set(children.map((child) => child.area).filter(Boolean))).sort(),
    [children],
  );

  const filteredChildren = useMemo(() => {
    const query = search.trim();

    return children.filter((child) => {
      const matchesSearch =
        query.length === 0 ||
        [
          child.name,
          child.phone,
          child.homeNumber,
          child.street,
          child.area,
          child.sectionName,
          child.confessionFather,
          child.location,
          child.notes,
        ].some((value) => value.toLocaleLowerCase("ar").includes(query.toLocaleLowerCase("ar")));

      const matchesSection = sectionFilter === "all" || child.sectionName === sectionFilter;
      const matchesArea = areaFilter === "all" || child.area === areaFilter;

      return matchesSearch && matchesSection && matchesArea;
    });
  }, [areaFilter, children, search, sectionFilter]);

  if (!result.ok) {
    return (
      <Card role="alert">
        <CardTitle>تعذر تحميل بيانات {stageName}</CardTitle>
        <CardDescription>{result.error}</CardDescription>
      </Card>
    );
  }

  if (children.length === 0) {
    return (
      <Card>
        <CardTitle>لا توجد بيانات أولاد لعرضها</CardTitle>
        <CardDescription>
          لم يُعثر على سجلات ضمن أقسام {stageName} في الشيت.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {notice ? (
        <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary-dark" role="status">
          {notice}
        </p>
      ) : null}

      <Card className="p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">بحث</span>
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث بالاسم أو الهاتف أو العنوان"
              aria-label="بحث في بيانات الأولاد"
              className="h-11 w-full rounded-xl border border-border bg-background pr-10 text-right text-sm outline-none transition focus:border-primary"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={sectionFilter}
              onChange={(event) => setSectionFilter(event.target.value)}
              aria-label="تصفية حسب القسم"
              className="h-11 rounded-xl border border-border bg-background px-3 text-right text-sm outline-none focus:border-primary"
            >
              <option value="all">كل الأقسام</option>
              {sections.map((sectionName) => (
                <option key={sectionName} value={sectionName}>
                  {sectionName}
                </option>
              ))}
            </select>

            <select
              value={areaFilter}
              onChange={(event) => setAreaFilter(event.target.value)}
              aria-label="تصفية حسب المنطقة"
              className="h-11 rounded-xl border border-border bg-background px-3 text-right text-sm outline-none focus:border-primary"
            >
              <option value="all">كل المناطق</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>نتائج البحث</CardTitle>
            <CardDescription>{filteredChildren.length} سجل مطابق</CardDescription>
          </div>
          {(search || sectionFilter !== "all" || areaFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setSectionFilter("all");
                setAreaFilter("all");
              }}
            >
              مسح المرشحات
            </Button>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-right text-sm">
            <thead className="bg-muted/70 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-3 font-semibold">الاسم</th>
                <th scope="col" className="px-3 py-3 font-semibold">رقم الهاتف</th>
                <th scope="col" className="px-3 py-3 font-semibold">المنطقة</th>
                <th scope="col" className="px-3 py-3 font-semibold">الشارع</th>
                <th scope="col" className="px-3 py-3 font-semibold">القسم</th>
                <th scope="col" className="px-3 py-3 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredChildren.map((child) => (
                <tr key={child.id} className="align-middle">
                  <td className="px-3 py-3 font-medium text-foreground">
                    <button
                      type="button"
                      onClick={() => setSelectedChild(child)}
                      className="text-right text-primary-dark hover:underline"
                    >
                      {child.name || "—"}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    {child.phone ? (
                      <a href={`tel:${normalizePhoneNumber(child.phone)}`} className="inline-flex items-center gap-1 text-primary-dark">
                        <Phone className="size-4" aria-hidden />
                        {child.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-3">{child.area || "—"}</td>
                  <td className="px-3 py-3">{child.street || "—"}</td>
                  <td className="px-3 py-3">{child.sectionName}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedChild(child)}>
                        التفاصيل
                      </Button>
                      {child.phone ? (
                        <a href={`tel:${normalizePhoneNumber(child.phone)}`} className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm text-foreground hover:bg-muted">
                          اتصال
                        </a>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredChildren.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    لا توجد نتائج مطابقة للبحث والتصفية الحاليين.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedChild ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/30 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setSelectedChild(null);
              setEditing(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="child-dialog-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{selectedChild.sectionName}</p>
                <CardTitle id="child-dialog-title" className="mt-1">
                  {editing ? "تعديل بيانات الطفل" : selectedChild.name || "طفل"}
                </CardTitle>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (saving) return;
                  setSelectedChild(null);
                  setEditing(false);
                }}
                disabled={saving}
                className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                aria-label="إغلاق التفاصيل"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            {editing && !readOnly ? (
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
                    <Input
                      name="birthDate"
                      placeholder="يوم/شهر/سنة"
                      maxLength={500}
                      defaultValue={selectedChild.birthDate}
                      disabled={saving}
                    />
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
                <div className="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="ghost" disabled={saving} onClick={() => {
                    setEditing(false);
                    setEditError("");
                  }}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground">رقم الهاتف</p>
                    <p className="mt-1 font-medium">{selectedChild.phone || "—"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground">رقم البيت</p>
                    <p className="mt-1 font-medium">{selectedChild.homeNumber || "—"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground">الشارع</p>
                    <p className="mt-1 font-medium">{selectedChild.street || "—"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground">المنطقة</p>
                    <p className="mt-1 font-medium">{selectedChild.area || "—"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground">تاريخ الميلاد</p>
                    <p className="mt-1 font-medium">{selectedChild.birthDate || "—"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground">أب الاعتراف</p>
                    <p className="mt-1 font-medium">{selectedChild.confessionFather || "—"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">الموقع الجغرافي</p>
                    <p className="mt-1 font-medium">{selectedChild.location || "—"}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">ملاحظات عن المخدوم</p>
                    <p className="mt-1 font-medium">{selectedChild.notes || "—"}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  {!readOnly ? (
                    <Button variant="outline" onClick={() => {
                      setEditError("");
                      setEditing(true);
                    }}>
                      <Pencil className="size-4" aria-hidden />
                      تعديل البيانات
                    </Button>
                  ) : null}
                  {selectedChild.phone ? (
                    <a
                      href={`tel:${normalizePhoneNumber(selectedChild.phone)}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                    >
                      <Phone className="size-4" aria-hidden />
                      اتصال مباشر
                    </a>
                  ) : null}
                </div>
              </>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
