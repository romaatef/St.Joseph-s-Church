"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { postAttendanceApi } from "@/lib/attendance-api-client";
import type { AttendanceGroup } from "@/lib/google-sheets/attendance.server";
import { Check, FileChartColumn, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type AttendanceDate = { value: string; column: number };
type AttendanceChild = {
  row: number;
  name: string;
  group: AttendanceGroup;
  present: boolean;
  notRegistered: boolean;
};

function attendanceChildKey(child: Pick<AttendanceChild, "group" | "row">) {
  return `${child.group}:${child.row}`;
}

export function AttendanceManager({
  allowedGroups,
  readOnly = false,
}: {
  allowedGroups: AttendanceGroup[];
  readOnly?: boolean;
}) {
  const [groups, setGroups] = useState<AttendanceGroup[]>([]);
  const [groupLabels, setGroupLabels] = useState<Record<string, string>>({});
  const [dates, setDates] = useState<AttendanceDate[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<AttendanceGroup | "all" | "">("");
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");
  const [children, setChildren] = useState<AttendanceChild[]>([]);
  const [presentRows, setPresentRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [loadingSetup, setLoadingSetup] = useState(true);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingRows, setSavingRows] = useState<Set<string>>(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const latestAttendanceRequest = useRef(0);
  const latestDateRequest = useRef(0);

  const loadDatesForSelection = useCallback(async (
    group: AttendanceGroup | "all",
    availableGroups: AttendanceGroup[],
  ) => {
    const requestId = ++latestDateRequest.current;
    const requestedGroups = group === "all" ? availableGroups : [group];
    setSelectedGroup(group);
    setDates([]);
    setSelectedDate("");
    setSelectedRows(new Set());
    setError("");
    if (requestedGroups.length === 0) return;

    setLoadingDates(true);
    try {
      const results = group === "all"
        ? (await postAttendanceApi<{
            groups: Array<{ group: AttendanceGroup; dates: AttendanceDate[] }>;
          }>({
            action: "getDatesForGroups",
            groups: requestedGroups,
          })).groups
        : await Promise.all(
            requestedGroups.map((requestedGroup) =>
              postAttendanceApi<{ dates: AttendanceDate[] }>({
            action: "getDates",
            group: requestedGroup,
              }).then((result) => ({ group: requestedGroup, dates: result.dates })),
            ),
          );
      if (requestId !== latestDateRequest.current) return;
      if (
        results.some(
          (result) =>
            !Array.isArray(result.dates) ||
            !availableGroups.includes(result.group) ||
            result.dates.some(
              (date) =>
                !date ||
                typeof date.value !== "string" ||
                !Number.isSafeInteger(date.column),
            ),
        )
      ) {
        throw new Error("استجابة تواريخ الحضور غير صالحة.");
      }
      const commonDates = results[0].dates.filter((date) =>
        results.every((result) => result.dates.some((candidate) => candidate.value === date.value)),
      );
      setDates(commonDates);
      setSelectedDate(commonDates.at(-1)?.value ?? "");
    } catch (loadError: unknown) {
      if (requestId === latestDateRequest.current) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "تعذر تحميل تواريخ الحضور.",
        );
      }
    } finally {
      if (requestId === latestDateRequest.current) setLoadingDates(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    postAttendanceApi<{
      groups: Array<{ id: AttendanceGroup; label: string }>;
    }>({ action: "getGroups" })
      .then((groupResult) => {
        if (!active) return;
        if (
          !Array.isArray(groupResult.groups) ||
          groupResult.groups.some(
            (group) =>
              !group ||
              typeof group !== "object" ||
              !allowedGroups.includes(group.id) ||
              typeof group.label !== "string" ||
              !group.label.trim(),
          )
        ) {
          throw new Error("استجابة مجموعات الحضور غير صالحة.");
        }
        const accessible = groupResult.groups
          .map((group) => group.id)
          .filter((group) => allowedGroups.includes(group));
        setGroupLabels(
          Object.fromEntries(
            groupResult.groups.map((group) => [group.id, group.label]),
          ),
        );
        setGroups(accessible);
        const firstGroup = accessible[0];
        if (firstGroup) void loadDatesForSelection(firstGroup, accessible);
        else setSelectedGroup("");
      })
      .catch((loadError: unknown) => {
        if (active) setError(
          loadError instanceof Error ? loadError.message : "تعذر تحميل بيانات الغياب.",
        );
      })
      .finally(() => {
        if (active) setLoadingSetup(false);
      });
    return () => {
      active = false;
    };
  }, [allowedGroups, loadDatesForSelection]);

  const loadAttendance = useCallback(async (requestId = ++latestAttendanceRequest.current) => {
    if (loadingDates || !selectedGroup || !selectedDate) {
      if (requestId === latestAttendanceRequest.current) {
        setChildren([]);
        setPresentRows(new Set());
        setLoadingChildren(false);
      }
      return;
    }
    setLoadingChildren(true);
    setError("");
    setNotice("");
    try {
      const requestedGroups = selectedGroup === "all" ? groups : [selectedGroup];
      const groupChildren = selectedGroup === "all"
        ? (await postAttendanceApi<{
            groups: Array<{
              group: AttendanceGroup;
              children: Omit<AttendanceChild, "group">[];
            }>;
          }>({
            action: "getAttendanceForGroups",
            groups: requestedGroups,
            date: selectedDate,
          })).groups
        : await Promise.all(requestedGroups.map(async (group) => {
            const result = await postAttendanceApi<{
              children: Omit<AttendanceChild, "group">[];
            }>({
              action: "getAttendance",
              group,
              date: selectedDate,
            });
            return { group, children: result.children };
          }));
      if (!Array.isArray(groupChildren) || groupChildren.length !== requestedGroups.length) {
        throw new Error("استجابة مجموعات الحضور غير مكتملة.");
      }
      const attendanceChildren = groupChildren.flatMap(({ group, children: groupRecords }) => {
        if (!requestedGroups.includes(group) || !Array.isArray(groupRecords)) {
          throw new Error("استجابة أسماء وحالة حضور الأطفال غير صالحة.");
        }
        const result = { children: groupRecords };
        if (
          !Array.isArray(result.children) ||
          result.children.some(
            (child) =>
              !child ||
              !Number.isSafeInteger(child.row) ||
              child.row <= 1 ||
              typeof child.name !== "string" ||
              !child.name.trim() ||
              typeof child.present !== "boolean" ||
              typeof child.notRegistered !== "boolean",
          )
        ) {
          throw new Error("استجابة أسماء وحالة حضور الأطفال غير صالحة.");
        }
        return result.children.map((child) => ({ ...child, group }));
      });
      if (requestId !== latestAttendanceRequest.current) return;
      setChildren(attendanceChildren);
      setSelectedRows((current) => {
        const valid = new Set<string>();
        for (const key of current) {
          if (attendanceChildren.some((child) => attendanceChildKey(child) === key)) {
            valid.add(key);
          }
        }
        return valid;
      });
      setPresentRows(
        new Set(
          attendanceChildren
            .filter((child) => child.present)
            .map((child) => attendanceChildKey(child)),
        ),
      );
    } catch (loadError) {
      if (requestId === latestAttendanceRequest.current) {
        setError(loadError instanceof Error ? loadError.message : "تعذر تحميل سجل الحضور.");
        setChildren([]);
        setPresentRows(new Set());
      }
    } finally {
      if (requestId === latestAttendanceRequest.current) setLoadingChildren(false);
    }
  }, [groups, loadingDates, selectedDate, selectedGroup]);

  useEffect(() => {
    if (loadingSetup) return;
    const requestId = ++latestAttendanceRequest.current;
    const task = window.setTimeout(() => void loadAttendance(requestId), 0);
    return () => {
      window.clearTimeout(task);
      if (requestId === latestAttendanceRequest.current) {
        latestAttendanceRequest.current += 1;
      }
    };
  }, [loadAttendance, loadingSetup]);

  const toggleRowSelection = useCallback((child: AttendanceChild) => {
    const key = attendanceChildKey(child);
    setSelectedRows((current) => {
      const updated = new Set(current);
      if (updated.has(key)) updated.delete(key);
      else updated.add(key);
      return updated;
    });
  }, []);

  async function saveChildAttendance(child: AttendanceChild, present: boolean) {
    const key = attendanceChildKey(child);
    if (savingRows.has(key) || !selectedDate || child.notRegistered) return;

    const previousPresent = presentRows.has(key);
    setSavingRows((current) => {
      const updated = new Set(current);
      updated.add(key);
      return updated;
    });
    setPresentRows((current) => {
      const updated = new Set(current);
      if (present) updated.add(key);
      else updated.delete(key);
      return updated;
    });
    setChildren((current) =>
      current.map((entry) =>
        attendanceChildKey(entry) === key ? { ...entry, present } : entry,
      ),
    );
    setError("");
    setNotice("");
    try {
      const result = await postAttendanceApi<{
        success: boolean;
        message: string;
      }>({
        action: "saveChildAttendance",
        group: child.group,
        date: selectedDate,
        row: child.row,
        present,
      });
      if (result.success !== true) throw new Error("لم يؤكد الخادم حفظ حالة الطفل.");
      setNotice(result.message);
    } catch (saveError) {
      setPresentRows((current) => {
        const updated = new Set(current);
        if (previousPresent) updated.add(key);
        else updated.delete(key);
        return updated;
      });
      setChildren((current) =>
        current.map((entry) =>
          attendanceChildKey(entry) === key
            ? { ...entry, present: previousPresent }
            : entry,
        ),
      );
      setError(saveError instanceof Error ? saveError.message : "تعذر تسجيل حضور الطفل.");
    } finally {
      setSavingRows((current) => {
        const updated = new Set(current);
        updated.delete(key);
        return updated;
      });
    }
  }

  async function saveSelectedAttendance(present: boolean) {
    if (bulkSaving || !selectedDate || selectedRows.size === 0 || selectedGroup === "all") return;

    const selectedChildren = children.filter((child) =>
      selectedRows.has(attendanceChildKey(child)),
    );
    const previousStates = new Map(
      selectedChildren.map((child) => [
        attendanceChildKey(child),
        presentRows.has(attendanceChildKey(child)),
      ]),
    );
    setBulkSaving(true);
    setPresentRows((current) => {
      const updated = new Set(current);
      for (const child of selectedChildren) {
        const key = attendanceChildKey(child);
        if (present) updated.add(key);
        else updated.delete(key);
      }
      return updated;
    });
    setChildren((current) =>
      current.map((entry) =>
        selectedRows.has(attendanceChildKey(entry)) ? { ...entry, present } : entry,
      ),
    );
    setError("");
    setNotice("");
    try {
      const invalidSelection = selectedChildren.some((child) => child.notRegistered);
      if (invalidSelection) {
        throw new Error("لا يمكن تسجيل حضور/غياب الأطفال غير المسجلين دفعة واحدة.");
      }

      const nextPresentRows = new Set(
        children
          .filter(
            (child) =>
              child.group === selectedGroup &&
              presentRows.has(attendanceChildKey(child)),
          )
          .map((child) => child.row),
      );
      for (const child of selectedChildren) {
        if (present) nextPresentRows.add(child.row);
        else nextPresentRows.delete(child.row);
      }

      const result = await postAttendanceApi<{ success: boolean; updated: number; message: string }>({
        action: "saveAttendance",
        group: selectedGroup,
        date: selectedDate,
        presentRows: [...nextPresentRows].sort((left, right) => left - right),
      });
      if (result.success !== true) throw new Error("لم يؤكد الخادم حفظ السجل المجمّع.");

      setSelectedRows(new Set());
      setNotice(result.message);
    } catch (saveError) {
      setPresentRows((current) => {
        const updated = new Set(current);
        for (const [key, wasPresent] of previousStates.entries()) {
          if (wasPresent) updated.add(key);
          else updated.delete(key);
        }
        return updated;
      });
      setChildren((current) =>
        current.map((entry) => {
          const key = attendanceChildKey(entry);
          const previousPresent = previousStates.get(key) ?? entry.present;
          return previousStates.has(key) ? { ...entry, present: previousPresent } : entry;
        }),
      );
      setError(saveError instanceof Error ? saveError.message : "تعذر حفظ الحضور الجماعي.");
    } finally {
      setBulkSaving(false);
    }
  }

  async function removePerson(child: AttendanceChild) {
    if (saving) return;
    if (
      !window.confirm(
        `سيتم حذف ${child.name} وبياناته وسجل حضوره من شيت الغياب وشيت البيانات نهائيًا. هل تريدين المتابعة؟`,
      )
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await postAttendanceApi<{ success: boolean; message: string }>({
        action: "removePerson",
        group: child.group,
        row: child.row,
        name: child.name,
      });
      if (result.success !== true) throw new Error("لم يؤكد الخادم حذف الشخص.");
      await loadAttendance();
      setNotice(result.message);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "تعذر حذف الشخص.");
    } finally {
      setSaving(false);
    }
  }

  const filteredChildren = children.filter((child) =>
    child.name.toLocaleLowerCase("ar").includes(search.trim().toLocaleLowerCase("ar")),
  );
  const selectableChildren = filteredChildren.filter((child) => !child.notRegistered);
  const allVisibleSelected =
    selectableChildren.length > 0 &&
    selectableChildren.every((child) => selectedRows.has(attendanceChildKey(child)));

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="mb-4 flex justify-end">
          <Link
            href={`/attendance/report?${new URLSearchParams({
              ...(selectedGroup && selectedGroup !== "all" ? { group: selectedGroup } : {}),
              ...(selectedDate ? { date: selectedDate } : {}),
            }).toString()}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
              <FileChartColumn className="size-4" aria-hidden />
              تقرير نسب الحضور والغياب
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-foreground">
            المجموعة
            <select
              value={selectedGroup}
              onChange={(event) => {
                if (event.target.value === "all") {
                  void loadDatesForSelection("all", groups);
                  return;
                }
                const group = allowedGroups.find((allowed) => allowed === event.target.value);
                if (group) {
                  void loadDatesForSelection(group, groups);
                }
              }}
              disabled={loadingSetup || loadingDates || bulkSaving || groups.length === 0}
              className="h-11 rounded-xl border border-border bg-background px-3 text-right text-sm outline-none focus:border-primary"
            >
              {groups.length > 1 ? <option value="all">كل المجموعات</option> : null}
              {groups.map((group) => (
                <option key={group} value={group}>{groupLabels[group] ?? group}</option>
              ))}
              {groups.length === 0 ? <option value="">لا توجد مجموعات متاحة</option> : null}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-foreground">
            تاريخ الجمعة
            <select
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              disabled={loadingSetup || loadingDates || bulkSaving || dates.length === 0}
              className="h-11 rounded-xl border border-border bg-background px-3 text-right text-sm outline-none focus:border-primary"
            >
              {dates.map((date) => (
                <option key={date.value} value={date.value}>{date.value}</option>
              ))}
              {dates.length === 0 ? <option value="">لا توجد تواريخ في الشيت</option> : null}
            </select>
          </label>
        </div>
      </Card>

      {error ? (
        <Card role="alert" className="border-danger/30 p-4">
          <CardTitle>تعذر تنفيذ العملية</CardTitle>
          <CardDescription>{error}</CardDescription>
        </Card>
      ) : null}
      {notice ? (
        <Card role="status" className="border-primary/30 p-4">
          <CardDescription className="mt-0 text-foreground">{notice}</CardDescription>
        </Card>
      ) : null}

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>تسجيل الحضور</CardTitle>
            <CardDescription>
              ابحثي عن الاسم وسجّلي حضوره أو غيابه فورًا من الزر بجوار اسمه.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => void loadAttendance()}
              disabled={bulkSaving || loadingSetup || loadingChildren || !selectedGroup || !selectedDate}
            >
              <RefreshCw className="size-4" aria-hidden />
              إعادة تحميل
            </Button>
            {!readOnly ? (
              <Button
                variant="outline"
                onClick={() => setSelectedRows(new Set())}
                disabled={bulkSaving || selectedRows.size === 0}
              >
                إلغاء التحديد
              </Button>
            ) : null}
          </div>
        </div>

        {loadingSetup || loadingDates || loadingChildren ? (
          <p className="py-8 text-center text-sm text-muted-foreground" role="status">
            جارٍ تحميل الأسماء وحالة الحضور من الشيت...
          </p>
        ) : children.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground" role="status">
            لا توجد أسماء متاحة لهذه المجموعة. تحققي من بيانات المجموعة في الشيت.
          </p>
        ) : (
          <>
            {!readOnly ? (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={() => {
                      if (selectedGroup === "all") return;
                      if (allVisibleSelected) {
                        setSelectedRows((current) => {
                          const next = new Set(current);
                          for (const child of selectableChildren) {
                            next.delete(attendanceChildKey(child));
                          }
                          return next;
                        });
                        return;
                      }
                      setSelectedRows((current) => {
                        const next = new Set(current);
                        for (const child of selectableChildren) {
                          next.add(attendanceChildKey(child));
                        }
                        return next;
                      });
                    }}
                    disabled={selectedGroup === "all" || selectableChildren.length === 0 || bulkSaving}
                    aria-label="تحديد كل النتائج المرئية"
                    className="size-4"
                  />
                  {selectedGroup === "all"
                    ? "اختياري تحديد عدة أشخاص متاح فقط عند اختيار مجموعة واحدة"
                    : "تحديد كل النتائج المرئية"}
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={selectedGroup === "all" || bulkSaving || selectedRows.size === 0 || loadingChildren}
                    onClick={() => void saveSelectedAttendance(true)}
                  >
                    تسجيل حضور المحددين
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={selectedGroup === "all" || bulkSaving || selectedRows.size === 0 || loadingChildren}
                    onClick={() => void saveSelectedAttendance(false)}
                  >
                    تسجيل غياب المحددين
                  </Button>
                </div>
              </div>
            ) : null}
            <label className="relative mb-4 block">
              <span className="sr-only">بحث بالاسم</span>
              <Search
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحثي باسم الطفل..."
                aria-label="بحث عن اسم في المجموعة"
                className="h-11 w-full rounded-xl border border-border bg-background pr-10 text-right text-sm outline-none focus:border-primary"
              />
            </label>
            <div className="overflow-x-auto">
              <table className={`w-full ${readOnly ? "min-w-[420px]" : "min-w-[620px]"} text-right text-sm`}>
                <thead className="bg-muted/70 text-xs text-muted-foreground">
                  <tr>
                    {!readOnly ? (
                      <th className="px-3 py-3 text-center font-semibold">
                        <span className="sr-only">تحديد</span>
                      </th>
                    ) : null}
                    <th className="px-3 py-3 font-semibold">الاسم</th>
                    {selectedGroup === "all" ? <th className="px-3 py-3 font-semibold">المجموعة</th> : null}
                    <th className="px-3 py-3 text-center font-semibold">الحالة</th>
                    {!readOnly ? (
                      <>
                        <th className="px-3 py-3 text-center font-semibold">تسجيل فوري</th>
                        <th className="px-3 py-3 text-center font-semibold">إدارة</th>
                      </>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredChildren.map((child) => {
                    const key = attendanceChildKey(child);
                    const present = presentRows.has(key);
                    const selected = selectedRows.has(key);
                    return (
                      <tr key={key}>
                        {!readOnly ? (
                          <td className="px-3 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleRowSelection(child)}
                              disabled={child.notRegistered || bulkSaving || savingRows.has(key)}
                              aria-label={`تحديد ${child.name}`}
                              className="size-4"
                            />
                          </td>
                        ) : null}
                        <td className="px-3 py-3 font-medium">{child.name}</td>
                        {selectedGroup === "all" ? (
                          <td className="px-3 py-3">{groupLabels[child.group] ?? child.group}</td>
                        ) : null}
                        <td className="px-3 py-3">
                          <span className={child.notRegistered ? "text-muted-foreground" : present ? "font-medium text-primary-dark" : "text-muted-foreground"}>
                            {child.notRegistered ? "غير مسجل" : present ? "حاضر" : "غائب"}
                          </span>
                        </td>
                        {!readOnly ? <td className="px-3 py-3 text-center">
                          <Button
                            type="button"
                            variant={present ? "outline" : "primary"}
                            size="sm"
                            disabled={savingRows.has(key) || loadingChildren || child.notRegistered}
                            onClick={() => void saveChildAttendance(child, !present)}
                            aria-label={`${present ? "تسجيل غياب" : "تسجيل حضور"} ${child.name} فورًا`}
                          >
                            <Check className="size-4" aria-hidden />
                            {present ? "تسجيل غياب الآن" : "تسجيل حضور الآن"}
                          </Button>
                        </td> : null}
                        {!readOnly ? <td className="px-3 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={saving}
                            onClick={() => void removePerson(child)}
                            className="text-danger hover:bg-danger/10"
                          >
                            حذف
                          </Button>
                        </td> : null}
                      </tr>
                    );
                  })}
                  {filteredChildren.length === 0 ? (
                    <tr>
                      <td colSpan={selectedGroup === "all" ? (readOnly ? 3 : 6) : (readOnly ? 2 : 5)} className="px-4 py-8 text-center text-muted-foreground">
                        لا يوجد اسم مطابق للبحث.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
