"use client";

import {
  deleteUserAction,
  resetUserPasswordAction,
  saveUserAction,
  setUserActiveAction,
  type UserActionState,
} from "@/app/actions/users";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { STAGES, type StageId } from "@/config/stages";
import type { UserRole } from "@/types/database";
import { KeyRound, Pencil, Plus, Trash2, UserRoundX, UsersRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  stageIds: StageId[];
};

type UsersManagerProps = {
  users: ManagedUser[];
  loadError?: string;
  readOnly?: boolean;
};

function roleLabel(role: UserRole) {
  if (role === "admin") return "Admin";
  if (role === "viewer") return "Viewer (Read-Only)";
  return "مسؤول مرحلة";
}

function UserDialog({
  user,
  onClose,
}: {
  user?: ManagedUser;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<UserActionState, FormData>(
    saveUserAction,
    {},
  );
  const [role, setRole] = useState<UserRole>(user?.role ?? "stage_responsible");

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onClose();
    }
  }, [onClose, router, state.success]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-foreground/30 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pending) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-dialog-title"
        className="my-auto w-full max-w-xl"
      >
        <Card className="max-h-[90vh] overflow-y-auto">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <CardTitle id="user-dialog-title">
                {user ? "تعديل بيانات المستخدم" : "إضافة مستخدم"}
              </CardTitle>
              <CardDescription>
                تُدار بيانات الدخول بأمان من خلال Supabase Auth.
              </CardDescription>
            </div>
            <button
              type="button"
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted"
              onClick={onClose}
              disabled={pending}
              aria-label="إغلاق"
            >
              <X className="size-5" />
            </button>
          </div>

          <form action={action} className="space-y-4">
            {user ? <input type="hidden" name="userId" value={user.id} /> : null}

            <div>
              <label htmlFor="user-name" className="mb-1.5 block text-sm font-medium">
                الاسم
              </label>
              <Input
                id="user-name"
                name="name"
                required
                minLength={2}
                defaultValue={user?.name}
                aria-invalid={Boolean(state.fieldErrors?.name)}
                aria-describedby={state.fieldErrors?.name ? "user-name-error" : undefined}
              />
              {state.fieldErrors?.name ? (
                <p id="user-name-error" className="mt-1 text-sm text-red-700" role="alert">
                  {state.fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="user-email" className="mb-1.5 block text-sm font-medium">
                البريد الإلكتروني
              </label>
              <Input
                id="user-email"
                name="email"
                type="email"
                dir="ltr"
                className="text-left"
                required
                readOnly={Boolean(user)}
                defaultValue={user?.email}
                placeholder="name@example.com"
                aria-invalid={Boolean(state.fieldErrors?.email)}
                aria-describedby={
                  state.fieldErrors?.email ? "user-email-error" : undefined
                }
              />
              {user ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  لا يمكن تغيير البريد الإلكتروني من هذه الشاشة.
                </p>
              ) : null}
              {state.fieldErrors?.email ? (
                <p id="user-email-error" className="mt-1 text-sm text-red-700" role="alert">
                  {state.fieldErrors.email}
                </p>
              ) : null}
            </div>

            {!user ? (
              <div>
                <label htmlFor="user-password" className="mb-1.5 block text-sm font-medium">
                  كلمة المرور
                </label>
                <Input
                  id="user-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  aria-invalid={Boolean(state.fieldErrors?.password)}
                  aria-describedby={
                    state.fieldErrors?.password ? "user-password-error" : undefined
                  }
                />
                {state.fieldErrors?.password ? (
                  <p
                    id="user-password-error"
                    className="mt-1 text-sm text-red-700"
                    role="alert"
                  >
                    {state.fieldErrors.password}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label htmlFor="user-role" className="mb-1.5 block text-sm font-medium">
                الدور
              </label>
              <select
                id="user-role"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="admin">Admin</option>
                <option value="stage_responsible">مسؤول مرحلة</option>
                <option value="viewer">Viewer (Read-Only)</option>
              </select>
            </div>

            {role === "stage_responsible" || role === "viewer" ? (
              <fieldset>
                <legend className="mb-2 text-sm font-medium">
                  {role === "viewer" ? "المراحل المتاح عرضها" : "المراحل المسؤول عنها"}
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {STAGES.map((stage) => (
                    <label
                      key={stage.id}
                      className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm"
                    >
                      <input
                        type="checkbox"
                        name="stageIds"
                        value={stage.id}
                        defaultChecked={user?.stageIds.includes(stage.id)}
                        className="size-4 accent-primary"
                      />
                      {stage.name}
                    </label>
                  ))}
                </div>
                {state.fieldErrors?.stageIds ? (
                  <p className="mt-1.5 text-sm text-red-700" role="alert">
                    {state.fieldErrors.stageIds}
                  </p>
                ) : null}
              </fieldset>
            ) : null}

            {state.error ? (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-6 text-red-800"
                role="alert"
              >
                {state.error}
              </p>
            ) : null}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
                إلغاء
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "جارٍ الحفظ..." : user ? "حفظ التعديلات" : "إضافة المستخدم"}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}

function PasswordDialog({
  user,
  onClose,
}: {
  user: ManagedUser;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<UserActionState, FormData>(
    resetUserPasswordAction,
    {},
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onClose();
    }
  }, [onClose, router, state.success]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-foreground/30 p-4 backdrop-blur-[2px]">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-dialog-title"
        className="my-auto w-full max-w-md"
      >
        <Card>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <CardTitle id="password-dialog-title">تعيين كلمة مرور جديدة</CardTitle>
              <CardDescription>{user.name}</CardDescription>
            </div>
            <button
              type="button"
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted"
              onClick={onClose}
              disabled={pending}
              aria-label="إغلاق"
            >
              <X className="size-5" />
            </button>
          </div>
          <form action={action} className="space-y-4">
            <input type="hidden" name="userId" value={user.id} />
            <div>
              <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium">
                كلمة المرور الجديدة
              </label>
              <Input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                aria-invalid={Boolean(state.fieldErrors?.password)}
              />
              {state.fieldErrors?.password ? (
                <p className="mt-1 text-sm text-red-700" role="alert">
                  {state.fieldErrors.password}
                </p>
              ) : null}
            </div>
            {state.error ? (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-6 text-red-800"
                role="alert"
              >
                {state.error}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
                إلغاء
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "جارٍ التعيين..." : "تعيين كلمة المرور"}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}

export function UsersManager({ users, loadError, readOnly = false }: UsersManagerProps) {
  const router = useRouter();
  const [dialogUser, setDialogUser] = useState<ManagedUser | null | undefined>(undefined);
  const [passwordUser, setPasswordUser] = useState<ManagedUser | null>(null);
  const [actionState, setActionState] = useState<UserActionState>({});
  const [pendingUserId, setPendingUserId] = useState("");

  async function toggleUser(user: ManagedUser) {
    setPendingUserId(user.id);
    setActionState({});
    const result = await setUserActiveAction(user.id, !user.active);
    setActionState(result);
    setPendingUserId("");
    if (result.success) router.refresh();
  }

  async function deleteUser(user: ManagedUser) {
    const confirmed = window.confirm(
      `حذف حساب ${user.name} (${user.email}) نهائيًا؟ لن يتمكن من تسجيل الدخول بعد الحذف.`,
    );
    if (!confirmed) return;

    setPendingUserId(user.id);
    setActionState({});
    const result = await deleteUserAction(user.id);
    setActionState(result);
    setPendingUserId("");
    if (result.success) router.refresh();
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">المستخدمين</h1>
          <p className="mt-1 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {readOnly
              ? "عرض حسابات المستخدمين والأدوار ومراحل الخدمة."
              : "إدارة حسابات المستخدمين والأدوار ومراحل الخدمة."}
          </p>
        </div>
        {!readOnly ? (
          <Button onClick={() => setDialogUser(null)}>
            <Plus className="size-4" aria-hidden />
            إضافة مستخدم
          </Button>
        ) : null}
      </div>

      {actionState.error ? (
        <p
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {actionState.error}
        </p>
      ) : null}
      {actionState.success ? (
        <p
          className="mb-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary-dark"
          role="status"
        >
          {actionState.success}
        </p>
      ) : null}

      {loadError ? (
        <Card>
          <CardTitle>تعذر تحميل المستخدمين</CardTitle>
          <CardDescription>{loadError}</CardDescription>
        </Card>
      ) : users.length === 0 ? (
        <Card className="flex flex-col items-center py-10 text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted text-primary-dark">
            <UsersRound className="size-6" aria-hidden />
          </span>
          <CardTitle>لا يوجد مستخدمون لعرضهم</CardTitle>
          <CardDescription>
            {readOnly
              ? "لا توجد حسابات مستخدمين لعرضها."
              : "أضف مستخدمًا جديدًا لإدارة حسابه وصلاحياته."}
          </CardDescription>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-right text-sm">
              <thead className="bg-muted/70 text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">الاسم والبريد الإلكتروني</th>
                  <th scope="col" className="px-4 py-3 font-semibold">الدور</th>
                  <th scope="col" className="px-4 py-3 font-semibold">المراحل</th>
                  <th scope="col" className="px-4 py-3 font-semibold">الحالة</th>
                  {!readOnly ? (
                    <th scope="col" className="px-4 py-3 font-semibold">الإجراءات</th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => {
                  const stages = STAGES.filter((stage) => user.stageIds.includes(stage.id));
                  return (
                    <tr key={user.id} className="align-top">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-foreground">{user.name}</p>
                        <p dir="ltr" className="mt-1 text-left text-xs text-muted-foreground">
                          {user.email || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-4">{roleLabel(user.role)}</td>
                      <td className="max-w-64 px-4 py-4 text-muted-foreground">
                        {stages.length
                          ? stages.map((stage) => stage.name).join("، ")
                          : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={
                            user.active
                              ? "inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-dark"
                              : "inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                          }
                        >
                          {user.active ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      {!readOnly ? <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDialogUser(user)}
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            تعديل
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPasswordUser(user)}
                          >
                            <KeyRound className="size-3.5" aria-hidden />
                            كلمة مرور جديدة
                          </Button>
                          <Button
                            size="sm"
                            variant={user.active ? "ghost" : "secondary"}
                            disabled={pendingUserId === user.id}
                            onClick={() => void toggleUser(user)}
                          >
                            <UserRoundX className="size-3.5" aria-hidden />
                            {pendingUserId === user.id
                              ? "جارٍ التحديث..."
                              : user.active
                                ? "تعطيل الحساب"
                                : "تفعيل الحساب"}
                          </Button>
                          {user.role !== "admin" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-700 hover:bg-red-50"
                              disabled={pendingUserId === user.id}
                              onClick={() => void deleteUser(user)}
                            >
                              <Trash2 className="size-3.5" aria-hidden />
                              {pendingUserId === user.id ? "جارٍ الحذف..." : "حذف الحساب"}
                            </Button>
                          ) : null}
                        </div>
                      </td> : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!readOnly && dialogUser !== undefined ? (
        <UserDialog
          key={dialogUser?.id ?? "new-user"}
          user={dialogUser ?? undefined}
          onClose={() => setDialogUser(undefined)}
        />
      ) : null}
      {!readOnly && passwordUser ? (
        <PasswordDialog
          key={passwordUser.id}
          user={passwordUser}
          onClose={() => setPasswordUser(null)}
        />
      ) : null}
    </>
  );
}
