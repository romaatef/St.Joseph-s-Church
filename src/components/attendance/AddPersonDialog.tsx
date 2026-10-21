"use client";

import { Button } from "@/components/ui/Button";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { postAttendanceApi } from "@/lib/attendance-api-client";
import type { AttendanceGroupDetails } from "@/lib/google-sheets/attendance.server";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

export function AddPersonDialog({ groups }: { groups: AttendanceGroupDetails[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>(groups[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, saving]);

  async function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !selectedGroup || !groups.some((group) => group.id === selectedGroup)) return;

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
    setError("");
    setNotice("");
    try {
      const result = await postAttendanceApi<{ success: boolean; message: string }>({
        action: "addPerson",
        group: selectedGroup,
        person,
      });
      if (result.success !== true) throw new Error("لم يؤكد الخادم إضافة الشخص.");
      setIsOpen(false);
      setNotice(result.message);
      router.refresh();
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "تعذرت إضافة الشخص.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">إضافة شخص جديد</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            أضيفي بياناته إلى شيت البيانات وشيت الغياب معًا.
          </p>
        </div>
        <Button onClick={() => { setError(""); setIsOpen(true); }}>
          <Plus className="size-4" aria-hidden />
          إضافة شخص
        </Button>
      </div>

      {notice ? (
        <p className="mb-5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary-dark" role="status">
          {notice}
        </p>
      ) : null}

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/30 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-person-dialog-title"
            className="my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-soft"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <CardTitle id="add-person-dialog-title">إضافة شخص جديد</CardTitle>
                <CardDescription>
                  ستُضاف البيانات إلى مجموعة الشخص في شيت الغياب وقسمها في شيت البيانات.
                </CardDescription>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={saving}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                aria-label="إغلاق"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            {error ? (
              <p className="mb-4 rounded-xl border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}

            <form onSubmit={(event) => void addPerson(event)} className="space-y-4">
              <label className="grid gap-1.5 text-sm font-medium">
                المجموعة *
                <select
                  required
                  value={selectedGroup}
                  onChange={(event) => setSelectedGroup(event.target.value)}
                  disabled={saving || groups.length === 0}
                  className="h-11 rounded-xl border border-border bg-background px-3 text-right text-sm outline-none focus:border-primary"
                >
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>{group.label}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="grid gap-1.5 text-sm font-medium">
                  الاسم *
                  <Input name="name" required maxLength={150} autoFocus />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  رقم الهاتف
                  <Input name="phone" type="tel" maxLength={100} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  رقم البيت
                  <Input name="homeNumber" maxLength={100} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  الشارع
                  <Input name="street" maxLength={200} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  المنطقة
                  <Input name="area" maxLength={200} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  تاريخ الميلاد
                  <Input name="birthDate" placeholder="يوم/شهر/سنة" maxLength={50} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  أب الاعتراف
                  <Input name="confessionFather" maxLength={200} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  الموقع
                  <Input name="location" maxLength={200} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2 lg:col-span-1">
                  ملاحظات
                  <Input name="notes" maxLength={500} />
                </label>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={saving}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={saving || groups.length === 0}>
                  {saving ? "جارٍ الإضافة..." : "إضافة إلى الشيتين"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
