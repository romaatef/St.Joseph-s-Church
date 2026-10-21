export async function postAttendanceApi<T>(body: Record<string, unknown>): Promise<T> {
  let response: Response;
  try {
    response = await fetch("/api/attendance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("تعذر الاتصال بالموقع. تحققي من اتصال الإنترنت وحاولي مرة أخرى.");
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error("استجابة خادم الغياب غير مفهومة.");
  }
  if (!response.ok || !result || typeof result !== "object") {
    const message =
      result && typeof result === "object" && "error" in result && typeof result.error === "string"
        ? result.error
        : "تعذر تنفيذ طلب الغياب.";
    throw new Error(message);
  }
  return result as T;
}
