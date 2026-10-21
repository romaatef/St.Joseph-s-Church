const STAGES = {
  "g1-g2": {
    name: "أولى وتانية",
    dataSpreadsheetId: "18r_3eOrq0zoM4-sSDfjLPbOdJ7NSbb9L",
    attendanceSpreadsheetId: "1fXK09bBYjKEO_XVSo7D5ecFdH3oYslLnS1eKWv5j3B8",
    dataSheetName: "Sheet1",
    attendanceSheetName: "Sheet1",
    groups: [
      { id: "g1-g2-servants", name: "خدام", dataAliases: ["خدام"], dataRows: [5, 14], attendanceRows: [3, 11] },
      { id: "g1-boys", name: "أولى بنين", dataAliases: ["أولى بنين", "أولى ولاد", "اولى بنين", "اولى ولاد"], attendanceAliases: ["اولي بنين"], dataRows: [16, 35], attendanceRows: [16, 35] },
      { id: "g2-boys", name: "تانية بنين", dataAliases: ["تانية بنين", "تانية ولاد", "ثانية بنين", "ثانية ولاد"], attendanceAliases: ["تانيه بنين"], dataRows: [37, 61], attendanceRows: [39, 61] },
      { id: "g1-girls", name: "أولى بنات", dataAliases: ["أولى بنات", "اولى بنات"], attendanceAliases: ["اولي بنات"], dataRows: [63, 91], attendanceRows: [65, 94] },
      { id: "g2-girls", name: "تانية بنات", dataAliases: ["تانية بنات", "ثانية بنات"], attendanceAliases: ["تانيه بنات"], dataRows: [93, 121], attendanceRows: [98, 126] },
    ],
  },
  "g3-g4": {
    enabled: true,
    name: "تالتة ورابعة",
    dataSpreadsheetId: "1Yv5CYlJujiY_sxS1g-X7Bj5a-hVcMdsRZSFND-gFonM",
    attendanceSpreadsheetId: "1rcHfeucECkcKhoLs-TAIHiz7dX7-my7yE2IeyjVQiWA",
    dataSheetName: "sheet 1",
    attendanceSheetName: "Sheet1",
    groups: [
      { id: "g3-g4-servants", name: "خدام", dataAliases: ["خدام"], dataRows: [5, 21], attendanceRows: [3, 19] },
      { id: "g3-boys", name: "تالتة بنين", dataAliases: ["تالتة بنين", "تالتة ولاد", "ثالثة بنين", "ثالثة ولاد", "تالته ولاد"], attendanceAliases: ["تالته بنين"], dataRows: [23, 43], attendanceRows: [23, 44] },
      { id: "g4-boys", name: "رابعة بنين", dataAliases: ["رابعة بنين", "رابعة ولاد", "رابعه بنين", "رابعه ولاد"], attendanceAliases: ["رابعه بنين"], dataRows: [45, 75], attendanceRows: [48, 79] },
      { id: "g3-girls", name: "تالتة بنات", dataAliases: ["تالتة بنات", "ثالثة بنات"], attendanceAliases: ["تالته بنات"], dataRows: [77, 98], attendanceRows: [83, 105] },
      { id: "g4-girls", name: "رابعة بنات", dataAliases: ["رابعة بنات", "رابعه بنات"], attendanceAliases: ["رابعه بنات"], dataRows: [100, 128], attendanceRows: [109, 137] },
    ],
  },
  "g5-g6": {
    enabled: true,
    name: "خامسة وسادسة",
    dataSpreadsheetId: "1FDO_WDPin3RWjvGDt4_awMEwMklSka8r",
    attendanceSpreadsheetId: "1xb7dc0jA8uMlgUDKDtsEIUWRyaYDx4KuAOdpxOIMfrA",
    groups: [
      { id: "g5-g6-servants", name: "خدام", dataAliases: ["خدام"], dataRows: [5, 20], attendanceRows: [3, 18] },
      { id: "g5-boys", name: "خامسة بنين", dataAliases: ["خامسة بنين", "خامسة ولاد", "خامسه ولاد"], dataRows: [22, 63], attendanceRows: [22, 64] },
      { id: "g6-boys", name: "ستة بنين", dataAliases: ["ستة بنين", "ستة ولاد", "سته ولاد", "سادسة ولاد"], dataRows: [65, 94], attendanceRows: [68, 101] },
      { id: "g5-girls", name: "خامسة بنات", dataAliases: ["خامسة بنات", "خامسه بنات"], dataRows: [96, 113], attendanceRows: [105, 122] },
      { id: "g6-girls", name: "ستة بنات", dataAliases: ["ستة بنات", "سته بنات", "سادسة بنات", "سادسه بنات"], dataRows: [115, 138], attendanceRows: [126, 150] },
    ],
  },
  "prep": {
    enabled: true,
    name: "إعدادي",
    dataSpreadsheetId: "1J0voPh-JtSuk4itpAdbL3hvG-YjWY9hmKlyyB-fbltY",
    attendanceSpreadsheetId: "1vMV0Z_IMuta-8FiwOfr4dpnXWpCSFtdLMrI3d2-HUMs",
    groups: [
      { id: "prep-servants", name: "خدام", dataAliases: ["خدام"], dataRows: [5, 25], attendanceRows: [3, 24] },
      { id: "prep-g1-boys", name: "أولى إعدادي بنين", dataAliases: ["أولى إعدادي بنين", "اولى اعدادي بنين"], attendanceAliases: ["اولي اعدادي بنين"], dataRows: [27, 65], attendanceRows: [29, 65] },
      { id: "prep-g2-boys", name: "تانية إعدادي بنين", dataAliases: ["تانية إعدادي بنين", "ثانية إعدادي بنين", "تانيه اعدادي بنين"], attendanceAliases: ["تانيه اعدادي بنين"], dataRows: [96, 137], attendanceRows: [70, 111] },
      { id: "prep-g3-boys", name: "تالتة إعدادي بنين", dataAliases: ["تالتة إعدادي بنين", "ثالثة إعدادي بنين"], attendanceAliases: ["تالته اعدادي بنين"], dataRows: [175, 215], attendanceRows: [116, 156] },
      { id: "prep-g1-girls", name: "أولى إعدادي بنات", dataAliases: ["أولى إعدادي بنات", "اولى اعدادي بنات"], attendanceAliases: ["اولي اعدادي بنات"], dataRows: [67, 94], attendanceRows: [161, 188] },
      { id: "prep-g2-girls", name: "تانية إعدادي بنات", dataAliases: ["تانية إعدادي بنات", "ثانية إعدادي بنات", "تانيه اعدادي بنات"], attendanceAliases: ["تانيه اعدادي بنات"], dataRows: [139, 173], attendanceRows: [193, 228] },
      { id: "prep-g3-girls", name: "تالتة إعدادي بنات", dataAliases: ["تالتة إعدادي بنات", "ثالثة إعدادي بنات"], attendanceAliases: ["تالته اعدادي بنات"], dataRows: [217, 265], attendanceRows: [233, 281] },
    ],
  },
  "secondary": {
    enabled: true,
    name: "ثانوي",
    dataSpreadsheetId: "1Nv4Vj7zHA6AYeHDrHsR9JDzTvK2QAucyI_-oDnrBV84",
    attendanceSpreadsheetId: "1OYhfanV-LQO44Ph_Re6dNoJWSTh5ZEEVr8DpKOc9_EY",
    groups: [
      { id: "secondary-servants", name: "خدام", dataAliases: ["خدام"], dataRows: [5, 22], attendanceRows: [3, 18] },
      { id: "secondary-g1-boys", name: "أولى ثانوي بنين", dataAliases: ["أولى ثانوي بنين", "اولى ثانوي بنين", "أولى ثانوي ولاد", "اولى ثانوي ولاد"], attendanceAliases: ["اولي ثانوي بنين"], dataRows: [24, 49], attendanceRows: [23, 48] },
      { id: "secondary-g2-boys", name: "تانية ثانوي بنين", dataAliases: ["تانية ثانوي بنين", "ثانية ثانوي بنين", "تانية ثانوي ولاد", "ثانية ثانوي ولاد"], attendanceAliases: ["تانيه ثانوي بنين"], dataRows: [81, 110], attendanceRows: [53, 82] },
      { id: "secondary-g3-boys", name: "تالتة ثانوي بنين", dataAliases: ["تالتة ثانوي بنين", "ثالثة ثانوي بنين", "تالتة ثانوي ولاد", "ثالثة ثانوي ولاد"], attendanceAliases: ["تالته ثانوي بنين"], dataRows: [140, 170], attendanceRows: [87, 117] },
      { id: "secondary-g1-girls", name: "أولى ثانوي بنات", dataAliases: ["أولى ثانوي بنات", "اولى ثانوي بنات"], attendanceAliases: ["اولي ثانوي بنات"], dataRows: [51, 79], attendanceRows: [122, 149] },
      { id: "secondary-g2-girls", name: "تانية ثانوي بنات", dataAliases: ["تانية ثانوي بنات", "ثانية ثانوي بنات"], attendanceAliases: ["تانيه ثانوي بنات"], dataRows: [112, 138], attendanceRows: [154, 180] },
      { id: "secondary-g3-girls", name: "تالتة ثانوي بنات", dataAliases: ["تالتة ثانوي بنات", "ثالثة ثانوي بنات"], attendanceAliases: ["تالته ثانوي بنات"], dataRows: [172, 200], attendanceRows: [185, 213] },
    ],
  },
  "servants": {
    enabled: false,
    name: "الخدام",
    dataSpreadsheetId: "155Eo2CCPy8nIF2u5cDAoDTdtk0OM4cJws8_wkVBJjAI",
    attendanceSpreadsheetId: "12lsNHbeUtjkjtUUCF3ia0xydqHvcXXG3",
    groups: [
      { id: "servants-had", name: "حضانة الحد", dataAliases: ["حضانة الحد"], attendanceAliases: ["حضانة"], attendanceRows: [3, 10] },
      { id: "servants-kg", name: "كي جي", dataAliases: ["كي جي", "KG", "K.G"], attendanceAliases: ["كيجي"], attendanceRows: [15, 27] },
      { id: "servants-g1-g2", name: "أولى وتانية", dataAliases: ["أولى وتانية", "اولى وتانية"], attendanceAliases: ["اولي وتانية"], attendanceRows: [32, 40] },
      { id: "servants-g3-g4", name: "تالتة ورابعة", dataAliases: ["تالتة ورابعة", "ثالثة ورابعة"], attendanceRows: [45, 61] },
      { id: "servants-g5-g6", name: "خامسة وسادسة", dataAliases: ["خامسة وسادسة", "خامسه وسادسه"], attendanceAliases: ["خامسة وستة"], attendanceRows: [66, 81] },
      { id: "servants-prep", name: "إعدادي", dataAliases: ["إعدادي", "اعدادي"], attendanceAliases: ["اعدادي"], attendanceRows: [86, 107] },
      { id: "servants-secondary", name: "ثانوي", dataAliases: ["ثانوي"], attendanceRows: [112, 128] },
      { id: "servants-meeting", name: "خدام الاجتماع", dataAliases: ["خدام الاجتماع"], attendanceRows: [133, 142] },
    ],
  },
};
const ENROLLMENT_DATES_PROPERTY_PREFIX = "ATTENDANCE_ENROLLED_ON_";
const ATTENDANCE_ROW_OFFSETS_PROPERTY_PREFIX = "ATTENDANCE_ROW_OFFSETS_";
const DATA_ROW_OFFSETS_PROPERTY_PREFIX = "DATA_ROW_OFFSETS_";

const PRESENT_MARK = "⛪";
const NOT_ENROLLED_MARK = "لم يكن مسجلًا";
const SUMMARY_LABEL_PATTERN = /^(?:ال)?(?:عدد|مجموع|إجمال[يى]|اجمال[يى])(?:\s*[:：]?\s*\d+)?$/u;

function doGet() {
  return ContentService
    .createTextOutput("Attendance API is ready")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const secret = PropertiesService.getScriptProperties().getProperty("API_SECRET");
    if (!secret || !e || !e.postData || !e.postData.contents) {
      return json({ success: false, error: "Unauthorized" });
    }

    const request = JSON.parse(e.postData.contents);
    const payload = request.payload;
    const signature = request.signature;
    if (typeof payload !== "string" || typeof signature !== "string") {
      return json({ success: false, error: "Unauthorized" });
    }

    const expected = Utilities.base64Encode(
      Utilities.computeHmacSha256Signature(payload, secret),
    );
    if (!safeEqual(signature, expected)) {
      return json({ success: false, error: "Unauthorized" });
    }

    const data = JSON.parse(payload);
    if (
      isWriteAction_(data.action) &&
      data.actorRole !== "admin" &&
      data.actorRole !== "stage_responsible"
    ) {
      return json({ success: false, error: "Unauthorized" });
    }

    if (data.action === "getGroupOptions") {
      const stage = getStageConfig_(data.stageId);
      return json({
        success: true,
        groups: stage.groups.map((group) => ({
          id: group.id,
          name: group.name,
        })),
      });
    }

    if (data.action === "getGroups") {
      const stageIds = Object.keys(STAGES);
      if (data.stageId !== undefined) {
        getStageConfig_(data.stageId);
        stageIds.splice(0, stageIds.length, data.stageId);
      }
      return json({
        success: true,
        groups: stageIds.flatMap((stageId) => {
          const stage = STAGES[stageId];
          if (!isStageLinked_(stage)) return [];

          const spreadsheet = SpreadsheetApp.openById(stage.attendanceSpreadsheetId);
          const sheet = findAttendanceSheet_(spreadsheet, stage.groups);
          return stage.groups.map((group) => ({
            id: group.id,
            name: group.name,
            children: getChildren(sheet, group.id),
          }));
        }),
      });
    }

    if (data.action === "diagnoseAttendanceSheets") {
      return json({
        success: true,
        stages: Object.keys(STAGES).flatMap((stageId) => {
          const stage = STAGES[stageId];
          if (!isStageLinked_(stage)) return [];
          try {
            const spreadsheet = SpreadsheetApp.openById(stage.attendanceSpreadsheetId);
            const diagnosis = diagnoseAttendanceSpreadsheet_(spreadsheet, stage.groups);
            return [{
              stageId,
              reasons: diagnosis.reasons,
              sheets: diagnosis.sheets,
            }];
          } catch (error) {
            console.error("Attendance diagnostics failed", error);
            return [{
              stageId,
              reasons: ["STALE_OR_UNEXPECTED_CONFIG"],
              sheets: [],
            }];
          }
        }),
      });
    }

    if (data.action === "getStageChildren") {
      const stage = getStageConfig_(data.stageId);
      return json({
        success: true,
        groups: getStageChildrenRows_(stage),
      });
    }

    if (data.action === "getDates") {
      const group = validateGroup(data.group);
      const { spreadsheet, sheet } = getAttendanceContext_(group);
      return json({
        success: true,
        dates: getDates(sheet, spreadsheet.getSpreadsheetTimeZone()),
      });
    }

    if (data.action === "getDatesForGroups") {
      const groups = validateStageGroups_(data.groups, data.stageId);
      const { spreadsheet, sheet } = getAttendanceContext_(groups[0]);
      const dates = getDates(sheet, spreadsheet.getSpreadsheetTimeZone());
      return json({
        success: true,
        groups: groups.map((group) => ({ group, dates })),
      });
    }

    if (data.action === "getAttendanceForGroups") {
      const groups = validateStageGroups_(data.groups, data.stageId);
      const { spreadsheet, sheet } = getAttendanceContext_(groups[0]);
      const dates = getDates(sheet, spreadsheet.getSpreadsheetTimeZone());
      const dateColumn = findDateColumn(dates, data.date);
      return json({
        success: true,
        date: normalizeDate(data.date),
        groups: groups.map((group) => ({
          group,
          children: getAttendanceForGroup_(sheet, group, data.date, dateColumn),
        })),
      });
    }

    if (data.action === "getAttendanceHistories") {
      if (
        !Array.isArray(data.groups) ||
        data.groups.length === 0 ||
        new Set(data.groups).size !== data.groups.length ||
        data.groups.some((requestedGroup) => !isAttendanceGroup_(requestedGroup))
      ) {
        throw new Error("Invalid attendance history groups");
      }
      return json({
        success: true,
        groups: getAttendanceHistories_(data.groups),
      });
    }

    const group = validateGroup(data.group);
    const { spreadsheet, sheet } = getAttendanceContext_(group);

    if (data.action === "getAttendance") {
      const dates = getDates(sheet, spreadsheet.getSpreadsheetTimeZone());
      const dateColumn = findDateColumn(dates, data.date);

      return json({
        success: true,
        group,
        date: normalizeDate(data.date),
        children: getAttendanceForGroup_(sheet, group, data.date, dateColumn),
      });
    }

    if (data.action === "getAttendanceHistory") {
      return json({
        success: true,
        ...getAttendanceHistoryWithContext_(group, {
          spreadsheet,
          sheet,
          dates: getDates(sheet, spreadsheet.getSpreadsheetTimeZone()),
        }),
      });
    }

    if (data.action === "addPerson") {
      const person = validatePerson_(data.person);
      try {
        return withRosterLock_(function () {
          return json({
            success: true,
            message: addPersonToSheets_(spreadsheet, group, person),
          });
        });
      } catch (error) {
        return json({
          success: false,
          error: "Roster action: " + (error && error.message ? error.message : "تعذرت الإضافة."),
        });
      }
    }

    if (data.action === "removePerson") {
      if (!Number.isInteger(data.row) || data.row < 2) {
        throw new Error("Invalid attendance row");
      }
      const name = normalizeText(data.name);
      if (!name) throw new Error("Invalid person name");
      try {
        return withRosterLock_(function () {
          return json({
            success: true,
            message: removePersonFromSheets_(spreadsheet, group, data.row, name),
          });
        });
      } catch (error) {
        return json({
          success: false,
          error: "Roster action: " + (error && error.message ? error.message : "تعذر الحذف."),
        });
      }
    }

    if (data.action === "updatePerson") {
      const currentName = normalizeText(data.currentName);
      if (!currentName || currentName.length > 150) {
        throw new Error("Invalid current person name");
      }
      const person = validatePerson_(data.person);
      try {
        return withRosterLock_(function () {
          return json({
            success: true,
            message: updatePersonInSheets_(spreadsheet, group, currentName, person),
          });
        });
      } catch (error) {
        return json({
          success: false,
          error: "Roster action: " + (error && error.message ? error.message : "تعذر تحديث البيانات."),
        });
      }
    }

    if (data.action === "saveAttendance") {
      const dates = getDates(sheet, spreadsheet.getSpreadsheetTimeZone());
      const dateColumn = findDateColumn(dates, data.date);
      if (!Array.isArray(data.presentRows)) {
        throw new Error("Invalid attendance rows");
      }

      const children = getChildren(sheet, group);
      const allowedRows = new Set(children.map((child) => child.row));
      const presentRows = new Set(data.presentRows);
      for (const row of presentRows) {
        if (!Number.isInteger(row) || !allowedRows.has(row)) {
          throw new Error("Invalid child row");
        }
      }

      let updated = 0;
      children.forEach((child) => {
        const cell = sheet.getRange(child.row, dateColumn);
        if (isNotRegisteredOnDate_(
          group,
          child.name,
          data.date,
          cell.getDisplayValue().trim(),
        )) return;
        const nextValue = presentRows.has(child.row) ? PRESENT_MARK : "";
        if (cell.getDisplayValue().trim() !== nextValue) {
          cell.setValue(nextValue);
          updated += 1;
        }
      });

      SpreadsheetApp.flush();
      return json({ success: true, message: "Attendance saved", updated });
    }

    if (data.action === "saveChildAttendance") {
      const dates = getDates(sheet, spreadsheet.getSpreadsheetTimeZone());
      const dateColumn = findDateColumn(dates, data.date);
      if (!Number.isInteger(data.row) || data.row < 2 || typeof data.present !== "boolean") {
        throw new Error("Invalid child attendance");
      }

      const child = getChildren(sheet, group).find((entry) => entry.row === data.row);
      if (!child) throw new Error("Child row does not belong to the selected group");
      const cell = sheet.getRange(child.row, dateColumn);
      if (isNotRegisteredOnDate_(
        group,
        child.name,
        data.date,
        cell.getDisplayValue().trim(),
      )) {
        throw new Error("الطفل غير مسجل في هذا التاريخ ولا يمكن تسجيل حضوره.");
      }

      const nextValue = data.present ? PRESENT_MARK : "";
      const updated = cell.getDisplayValue().trim() !== nextValue;
      if (updated) {
        cell.setValue(nextValue);
        SpreadsheetApp.flush();
      }
      return json({
        success: true,
        updated: updated ? 1 : 0,
        message: data.present ? "تم تسجيل حضور الطفل." : "تم تسجيل غياب الطفل.",
      });
    }

    return json({ success: false, error: "Unsupported action" });
  } catch (error) {
    console.error(error);
    return json({
      success: false,
      error: error && error.message ? error.message : "Request failed",
    });
  }
}

function isWriteAction_(action) {
  return [
    "saveAttendance",
    "saveChildAttendance",
    "addPerson",
    "updatePerson",
    "removePerson",
  ].includes(action);
}

function getStageConfig_(stageId) {
  if (
    typeof stageId !== "string" ||
    !Object.prototype.hasOwnProperty.call(STAGES, stageId) ||
    !isStageLinked_(STAGES[stageId])
  ) {
    throw new Error("المرحلة غير مرتبطة بمصدر بيانات.");
  }
  return STAGES[stageId];
}

function isStageLinked_(stage) {
  return Boolean(
    stage &&
    stage.enabled !== false &&
    typeof stage.dataSpreadsheetId === "string" &&
    stage.dataSpreadsheetId.trim() &&
    typeof stage.attendanceSpreadsheetId === "string" &&
    stage.attendanceSpreadsheetId.trim() &&
    Array.isArray(stage.groups) &&
    stage.groups.length > 0,
  );
}

function getGroupConfig_(groupId) {
  for (const stageId of Object.keys(STAGES)) {
    const stage = STAGES[stageId];
    if (!isStageLinked_(stage)) continue;

    const group = stage.groups.find((entry) => entry.id === groupId);
    if (group) {
      return Object.assign({}, group, {
        stageId,
        stageName: stage.name,
        dataSpreadsheetId: stage.dataSpreadsheetId,
        attendanceSpreadsheetId: stage.attendanceSpreadsheetId,
        stageGroups: stage.groups,
        groups: stage.groups,
      });
    }
  }
  throw new Error("Invalid group");
}

function getAllAttendanceGroups_() {
  return Object.keys(STAGES).flatMap((stageId) => {
    const stage = STAGES[stageId];
    if (!isStageLinked_(stage)) return [];

    return stage.groups.map((group) => Object.assign({}, group, {
      stageId,
      stageName: stage.name,
      dataSpreadsheetId: stage.dataSpreadsheetId,
      attendanceSpreadsheetId: stage.attendanceSpreadsheetId,
      stageGroups: stage.groups,
      groups: stage.groups,
    }));
  });
}

function getAttendanceConfig_(groupId) {
  return getGroupConfig_(groupId);
}

function isAttendanceGroup_(groupId) {
  return typeof groupId === "string" &&
    getAllAttendanceGroups_().some((group) => group.id === groupId);
}

function getAttendanceContext_(groupId) {
  const config = getGroupConfig_(groupId);
  const spreadsheet = SpreadsheetApp.openById(config.attendanceSpreadsheetId);
  const sheet = findAttendanceSheet_(spreadsheet, config.stageGroups);
  return { spreadsheet, sheet };
}

function getAttendanceForGroup_(sheet, groupId, date, dateColumn) {
  const children = getChildren(sheet, groupId);
  if (children.length === 0) return [];
  const firstRow = children[0].row;
  const lastRow = children[children.length - 1].row;
  const values = sheet
    .getRange(firstRow, dateColumn, lastRow - firstRow + 1, 1)
    .getDisplayValues();
  return children.map((child) => {
    const value = values[child.row - firstRow][0].trim();
    return {
      row: child.row,
      name: child.name,
      present: value === PRESENT_MARK,
      notRegistered: isNotRegisteredOnDate_(groupId, child.name, date, value),
    };
  });
}

function validateStageGroups_(groups, stageId) {
  if (
    typeof stageId !== "string" ||
    !Array.isArray(groups) ||
    groups.length === 0 ||
    new Set(groups).size !== groups.length ||
    groups.some((group) => !isAttendanceGroup_(group))
  ) {
    throw new Error("Invalid attendance stage groups");
  }
  const stage = getStageConfig_(stageId);
  if (groups.some((group) => getGroupConfig_(group).stageId !== stageId)) {
    throw new Error("Attendance groups do not match the requested stage");
  }
  if (groups.some((group) => !stage.groups.some((entry) => entry.id === group))) {
    throw new Error("Attendance groups do not belong to the requested stage");
  }
  return groups;
}

function getAttendanceHistories_(groupIds) {
  const contexts = {};
  return groupIds.map((groupId) => {
    const config = getGroupConfig_(groupId);
    let context = contexts[config.stageId];
    if (!context) {
      const spreadsheet = SpreadsheetApp.openById(config.attendanceSpreadsheetId);
      const sheet = findAttendanceSheet_(spreadsheet, config.stageGroups);
      context = {
        spreadsheet,
        sheet,
        dates: getDates(sheet, spreadsheet.getSpreadsheetTimeZone()),
      };
      contexts[config.stageId] = context;
    }
    return getAttendanceHistoryWithContext_(groupId, context);
  });
}

function getAttendanceHistoryWithContext_(groupId, context) {
  const { sheet, dates } = context;
  const children = getChildren(sheet, groupId);
  if (children.length === 0) return { group: groupId, dates, children: [] };

  const firstRow = children[0].row;
  const lastRow = children[children.length - 1].row;
  const firstColumn = dates[0].column;
  const lastColumn = dates[dates.length - 1].column;
  const values = sheet
    .getRange(firstRow, firstColumn, lastRow - firstRow + 1, lastColumn - firstColumn + 1)
    .getDisplayValues();
  const properties = PropertiesService.getScriptProperties();
  const parsedDates = dates.map((date) => ({
    ...date,
    parsed: parseSheetDate_(date.value),
  }));

  return {
    group: groupId,
    dates,
    children: children.map((child) => {
      const enrolledOn = properties.getProperty(
        getEnrollmentDatePropertyKey_(groupId, child.name),
      );
      const enrollmentDate = enrolledOn ? parseSheetDate_(enrolledOn) : null;
      const attendance = {};
      parsedDates.forEach((date) => {
        const value = values[child.row - firstRow][date.column - firstColumn].trim();
        const beforeEnrollment =
          enrollmentDate &&
          date.parsed &&
          date.parsed.getTime() < enrollmentDate.getTime();
        attendance[date.value] =
          value === NOT_ENROLLED_MARK || beforeEnrollment
            ? null
            : value === PRESENT_MARK;
      });
      return { row: child.row, name: child.name, attendance };
    }),
  };
}

function findAttendanceSheet_(spreadsheet, requiredGroups) {
  validateAttendanceRowRanges_(requiredGroups);
  const stageId = getGroupConfig_(requiredGroups[0].id).stageId;
  const sheetName = STAGES[stageId].attendanceSheetName;
  let sheets = spreadsheet.getSheets();
  if (sheetName) {
    const namedSheet = spreadsheet.getSheetByName(sheetName);
    if (namedSheet) sheets = [namedSheet];
  }
  const timezone = spreadsheet.getSpreadsheetTimeZone();
  const candidates = sheets.filter((sheet) =>
    hasFridayDateHeader_(sheet, timezone) &&
    requiredGroups.every((group) => {
      try {
        return getGroupBounds_(sheet, group.id).children.length > 0;
      } catch {
        return false;
      }
    }),
  );

  if (candidates.length !== 1) {
    throw new Error(
      candidates.length === 0
        ? "لم يتم العثور على تبويب حضور يطابق تواريخ الجمعة وكل مجموعات المرحلة."
        : "يوجد أكثر من تبويب حضور مطابق؛ لم يتم اختيار تبويب أو تعديل أي بيانات.",
    );
  }
  return candidates[0];
}

function validateAttendanceRowRanges_(groups) {
  const ordered = groups
    .map((group) => {
      const rows = group.attendanceRows;
      if (
        !Array.isArray(rows) ||
        rows.length !== 2 ||
        !Number.isSafeInteger(rows[0]) ||
        !Number.isSafeInteger(rows[1]) ||
        rows[0] < 2 ||
        rows[1] < rows[0]
      ) {
        throw new Error("Attendance row configuration is invalid.");
      }
      return { startRow: rows[0], endRow: rows[1] };
    })
    .sort((left, right) => left.startRow - right.startRow);
  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index].startRow <= ordered[index - 1].endRow) {
      throw new Error("Attendance row configuration contains overlapping ranges.");
    }
  }
}

function diagnoseAttendanceSpreadsheet_(spreadsheet, requiredGroups) {
  try {
    validateAttendanceRowRanges_(requiredGroups);
  } catch {
    return {
      reasons: ["STALE_OR_UNEXPECTED_CONFIG"],
      sheets: [],
    };
  }
  const sheets = spreadsheet.getSheets();
  const timezone = spreadsheet.getSpreadsheetTimeZone();
  const sheetResults = sheets.map((sheet, index) => {
    const dateHeader = getFridayDateHeaderDiagnostics_(sheet, timezone);
    if (dateHeader.headerRow === null) {
      return { sheetIndex: index + 1, reasons: ["NO_FRIDAY_DATES"], dateHeader };
    }

    const reasons = new Set();
    requiredGroups.forEach((group) => {
      const reason = diagnoseAttendanceGroup_(sheet, group.id, requiredGroups);
      if (reason) reasons.add(reason);
    });
    return {
      sheetIndex: index + 1,
      reasons: reasons.size > 0 ? [...reasons] : ["MATCH"],
      dateHeader,
    };
  });

  const matchingCount = sheetResults.filter((sheet) =>
    sheet.reasons.length === 1 && sheet.reasons[0] === "MATCH",
  ).length;
  const reasons = matchingCount > 1
    ? ["MULTIPLE_MATCHES"]
    : matchingCount === 1
      ? ["MATCH"]
      : sheets.length === 0
        ? ["STALE_OR_UNEXPECTED_CONFIG"]
        : [...new Set(sheetResults.flatMap((sheet) => sheet.reasons))];

  return { reasons, sheets: sheetResults };
}

function diagnoseAttendanceGroup_(sheet, groupId, requiredGroups) {
  const group = getGroupConfig_(groupId);
  let bounds;
  try {
    bounds = getConfiguredAttendanceRows_(group);
  } catch {
    return "STALE_OR_UNEXPECTED_CONFIG";
  }

  const lastRow = sheet.getLastRow();
  if (bounds.startRow < 2 || bounds.endRow > lastRow) {
    return "STALE_OR_UNEXPECTED_CONFIG";
  }

  const names = sheet
    .getRange(bounds.startRow, 1, bounds.endRow - bounds.startRow + 1, 1)
    .getDisplayValues();
  if (!names.some((row) => isChildName_(row[0]))) return "EMPTY_GROUP";
  if (!getAttendanceSummaryRow_(sheet, group, requiredGroups)) {
    return "SUMMARY_ROW_MISMATCH";
  }
  return null;
}

function getGroupBounds_(sheet, groupId) {
  const group = getGroupConfig_(groupId);
  const lastRow = sheet.getLastRow();
  const configuredRows = getConfiguredAttendanceRows_(group);
  if (
    configuredRows.startRow < 2 ||
    configuredRows.endRow < configuredRows.startRow ||
    configuredRows.endRow > lastRow
  ) {
    throw new Error("Attendance row range is outside the configured sheet.");
  }
  const names = sheet
    .getRange(
      configuredRows.startRow,
      1,
      configuredRows.endRow - configuredRows.startRow + 1,
      1,
    )
    .getDisplayValues();
  const children = [];
  names.forEach((values, index) => {
    const name = normalizeText(values[0]);
    if (isChildName_(name)) {
      children.push({ row: configuredRows.startRow + index, name });
    }
  });
  if (children.length === 0) {
    throw new Error("No attendance children were found in the configured row range.");
  }
  return {
    headerRow: configuredRows.startRow - 1,
    startRow: configuredRows.startRow,
    endRow: configuredRows.endRow,
    summaryRow: getAttendanceSummaryRow_(sheet, group, group.stageGroups),
    children,
  };
}

function getConfiguredAttendanceRows_(group) {
  if (
    !Array.isArray(group.attendanceRows) ||
    group.attendanceRows.length !== 2 ||
    !Number.isSafeInteger(group.attendanceRows[0]) ||
    !Number.isSafeInteger(group.attendanceRows[1])
  ) {
    throw new Error("Attendance row range is not configured.");
  }

  const stage = STAGES[group.stageId];
  const rangeSignature = JSON.stringify(
    stage.groups.map((entry) => [entry.id, entry.attendanceRows]),
  );
  const propertyKey = ATTENDANCE_ROW_OFFSETS_PROPERTY_PREFIX + group.stageId;
  const stored = PropertiesService.getScriptProperties().getProperty(propertyKey);
  let offsets = {};
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.signature === rangeSignature && parsed.offsets && typeof parsed.offsets === "object") {
        offsets = parsed.offsets;
      }
    } catch {
      throw new Error("Stored attendance row offsets are invalid.");
    }
  }

  const groupOffset = offsets[group.id] || {};
  const startRow = group.attendanceRows[0] + (Number(groupOffset.start) || 0);
  const endRow = group.attendanceRows[1] + (Number(groupOffset.end) || 0);
  if (
    !Number.isSafeInteger(startRow) ||
    !Number.isSafeInteger(endRow) ||
    startRow < 2 ||
    endRow < startRow
  ) {
    throw new Error("Attendance row range is invalid.");
  }
  return { startRow, endRow, rangeSignature, propertyKey, offsets };
}

function getAttendanceSummaryRow_(sheet, group, stageGroups) {
  const bounds = getConfiguredAttendanceRows_(group);
  const nextGroupStart = stageGroups
    .filter((entry) => entry.id !== group.id)
    .map((entry) => getConfiguredAttendanceRows_(getGroupConfig_(entry.id)).startRow)
    .filter((row) => row > bounds.endRow)
    .reduce((next, row) => Math.min(next, row), sheet.getLastRow() + 1);
  if (nextGroupStart <= bounds.endRow + 1) return null;

  const labels = sheet
    .getRange(bounds.endRow + 1, 1, nextGroupStart - bounds.endRow - 1, 1)
    .getDisplayValues();
  const summaryIndex = labels.findIndex((row) => isSummaryRow(row[0]));
  return summaryIndex < 0 ? null : bounds.endRow + 1 + summaryIndex;
}

function buildAttendanceRowOffsetUpdate_(group, insertedRow) {
  const bounds = getConfiguredAttendanceRows_(group);
  const offsets = JSON.parse(JSON.stringify(bounds.offsets));
  group.stageGroups.forEach((entry) => {
    const entryBounds = getConfiguredAttendanceRows_(getGroupConfig_(entry.id));
    const current = offsets[entry.id] || { start: 0, end: 0 };
    if (entry.id === group.id) {
      current.end = (Number(current.end) || 0) + 1;
    } else if (entryBounds.startRow >= insertedRow) {
      current.start = (Number(current.start) || 0) + 1;
      current.end = (Number(current.end) || 0) + 1;
    }
    offsets[entry.id] = current;
  });
  return {
    propertyKey: bounds.propertyKey,
    value: JSON.stringify({ signature: bounds.rangeSignature, offsets }),
  };
}

function getChildren(sheet, groupId) {
  return getGroupBounds_(sheet, groupId).children;
}

function getAttendanceGroupHeadingAliases_(group) {
  return [group.name].concat(group.attendanceAliases || []).map(normalizeText);
}

function withRosterLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function validatePerson_(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid person data");
  }

  const keys = [
    "name",
    "phone",
    "homeNumber",
    "street",
    "area",
    "birthDate",
    "confessionFather",
    "location",
    "notes",
  ];
  const person = {};
  keys.forEach((key) => {
    if (typeof value[key] !== "string" || value[key].length > 500) {
      throw new Error("Invalid person field: " + key);
    }
    person[key] = normalizeText(value[key]);
  });
  if (!person.name || person.name.length > 150) {
    throw new Error("يجب إدخال اسم صحيح لا يتجاوز 150 حرفًا.");
  }
  return person;
}

function getDataSectionAliases_(group) {
  return getGroupConfig_(group).dataAliases;
}

function getDataSpreadsheet_(group) {
  return SpreadsheetApp.openById(getAttendanceConfig_(group).dataSpreadsheetId);
}

function getConfiguredDataRows_(stage, group) {
  if (
    !Array.isArray(group.dataRows) ||
    group.dataRows.length !== 2 ||
    !Number.isSafeInteger(group.dataRows[0]) ||
    !Number.isSafeInteger(group.dataRows[1]) ||
    group.dataRows[0] < 2 ||
    group.dataRows[1] < group.dataRows[0]
  ) {
    throw new Error("Data row range is not configured.");
  }

  const rangeSignature = JSON.stringify(
    stage.groups.map((entry) => [entry.id, entry.dataRows]),
  );
  const stageId = Object.keys(STAGES).find((id) => STAGES[id] === stage);
  if (!stageId) throw new Error("Data stage configuration is invalid.");
  const propertyKey = DATA_ROW_OFFSETS_PROPERTY_PREFIX + stageId;
  const stored = PropertiesService.getScriptProperties().getProperty(propertyKey);
  let offsets = {};
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (
        parsed.signature === rangeSignature &&
        parsed.offsets &&
        typeof parsed.offsets === "object"
      ) {
        offsets = parsed.offsets;
      }
    } catch {
      throw new Error("Stored data row offsets are invalid.");
    }
  }

  const groupOffset = offsets[group.id] || {};
  const startRow = group.dataRows[0] + (Number(groupOffset.start) || 0);
  const endRow = group.dataRows[1] + (Number(groupOffset.end) || 0);
  if (
    !Number.isSafeInteger(startRow) ||
    !Number.isSafeInteger(endRow) ||
    startRow < 2 ||
    endRow < startRow
  ) {
    throw new Error("Data row range is invalid.");
  }
  return {
    rows: [startRow, endRow],
    rangeSignature,
    propertyKey,
    offsets,
  };
}

function buildDataRowOffsetUpdate_(stage, group, insertedRow) {
  const configured = getConfiguredDataRows_(stage, group);
  const offsets = JSON.parse(JSON.stringify(configured.offsets));
  stage.groups.forEach((entry) => {
    const entryRows = getConfiguredDataRows_(stage, entry).rows;
    const current = offsets[entry.id] || { start: 0, end: 0 };
    if (entry.id === group.id) {
      current.end = (Number(current.end) || 0) + 1;
    } else if (entryRows[0] >= insertedRow) {
      current.start = (Number(current.start) || 0) + 1;
      current.end = (Number(current.end) || 0) + 1;
    }
    offsets[entry.id] = current;
  });
  return {
    propertyKey: configured.propertyKey,
    value: JSON.stringify({ signature: configured.rangeSignature, offsets }),
  };
}

function getDataSectionRows_(group) {
  const section = getDataSection_(getDataSpreadsheet_(group), group);
  const rows = [];
  for (let row = section.firstRow; row <= section.lastRow; row += 1) {
    const values = section.values[row - 1].slice(0, 10).map(normalizeText);
    while (values.length < 10) values.push("");
    if (isChildName_(values[1])) rows.push(values);
  }
  return rows;
}

function getStageChildrenRows_(stage) {
  if (!stage.groups.every((group) => Array.isArray(group.dataRows))) {
    return stage.groups.map((group) => ({
      id: group.id,
      name: group.name,
      rows: getDataSectionRows_(group.id),
    }));
  }

  const spreadsheet = SpreadsheetApp.openById(stage.dataSpreadsheetId);
  let sheet = stage.dataSheetName
    ? spreadsheet.getSheetByName(stage.dataSheetName)
    : null;
  if (!sheet) {
    const matchingSheets = spreadsheet
      .getSheets()
      .filter((candidate) => hasConfiguredDataRowsForStage_(candidate, stage));
    if (matchingSheets.length !== 1) {
      throw new Error("تعذر تحديد تبويب بيانات فريد يطابق نطاقات المرحلة.");
    }
    [sheet] = matchingSheets;
  }

  const lastRow = sheet.getLastRow();
  const lastConfiguredRow = Math.max(
    ...stage.groups.map((group) => {
      const rows = getConfiguredDataRows_(stage, group).rows;
      if (
        rows.length !== 2 ||
        !Number.isSafeInteger(rows[0]) ||
        !Number.isSafeInteger(rows[1]) ||
        rows[0] < 2 ||
        rows[1] < rows[0] ||
        rows[1] > lastRow
      ) {
        throw new Error("نطاق صفوف بيانات المجموعة غير صالح.");
      }
      return rows[1];
    }),
  );
  if (sheet.getMaxColumns() < 10) {
    throw new Error("تبويب بيانات المرحلة لا يحتوي على الأعمدة المطلوبة.");
  }

  const values = sheet
    .getRange(1, 1, lastConfiguredRow, 10)
    .getDisplayValues();
  return stage.groups.map((group) => {
    const [firstRow, endRow] = getConfiguredDataRows_(stage, group).rows;
    const rows = [];
    for (let row = firstRow; row <= endRow; row += 1) {
      const valuesForRow = values[row - 1].slice(0, 10).map(normalizeText);
      while (valuesForRow.length < 10) valuesForRow.push("");
      if (isChildName_(valuesForRow[1])) rows.push(valuesForRow);
    }
    return { id: group.id, name: group.name, rows };
  });
}

function hasConfiguredDataRowsForStage_(sheet, stage) {
  if (sheet.getMaxColumns() < 10) return false;
  const lastRow = sheet.getLastRow();
  if (!stage.groups.every((group) =>
    (() => {
      const [startRow, endRow] = getConfiguredDataRows_(stage, group).rows;
      return startRow >= 2 && endRow >= startRow && endRow <= lastRow;
    })()
  )) return false;

  const values = sheet.getRange(1, 1, lastRow, 10).getDisplayValues();
  return stage.groups.every((group) => {
    const [startRow, endRow] = getConfiguredDataRows_(stage, group).rows;
    return values
      .slice(startRow - 1, endRow)
      .some((row) => isChildName_(row[1]));
  });
}

function normalizeSectionHeading_(value) {
  return normalizeText(value)
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ى]/g, "ي")
    .replace(/[ة]/g, "ه")
    .replace(/\s+/g, " ");
}

function isDataSectionSeparator_(row) {
  return normalizeSectionHeading_(row[0]) &&
    row.slice(1, 10).every((cell) => !normalizeText(cell));
}

function isDataSectionHeading_(value) {
  return getAllAttendanceGroups_().some((group) =>
    group.dataAliases.some(
      (alias) => normalizeSectionHeading_(alias) === normalizeSectionHeading_(value),
    ),
  );
}

function getDataSection_(spreadsheet, group) {
  const candidates = [];
  const config = getAttendanceConfig_(group);
  const stage = STAGES[config.stageId];
  let sheets = spreadsheet.getSheets();
  if (stage.dataSheetName) {
    const namedSheet = spreadsheet.getSheetByName(stage.dataSheetName);
    if (namedSheet) {
      sheets = [namedSheet];
    } else {
      const matchingSheets = sheets.filter((sheet) => hasConfiguredDataRows_(sheet, stage));
      if (matchingSheets.length !== 1) {
        throw new Error("تعذر تحديد تبويب بيانات فريد يطابق نطاقات المرحلة.");
      }
      sheets = matchingSheets;
    }
  } else if (stage.groups.every((entry) => Array.isArray(entry.dataRows))) {
    const matchingSheets = sheets.filter((sheet) => hasConfiguredDataRows_(sheet, stage));
    if (matchingSheets.length !== 1) {
      throw new Error("تعذر تحديد تبويب بيانات فريد يطابق نطاقات المرحلة.");
    }
    sheets = matchingSheets;
  }
  if (config.dataRows) {
    const configuredData = getConfiguredDataRows_(stage, config);
    const [firstRow, lastRow] = configuredData.rows;
    if (sheets.length !== 1) {
      throw new Error("تعذر تحديد تبويب البيانات المخصص للمجموعة.");
    }
    const sheet = sheets[0];
    if (lastRow > sheet.getLastRow() || sheet.getMaxColumns() < 10) {
      throw new Error("نطاق صفوف بيانات المجموعة خارج حدود التبويب.");
    }
    const values = sheet.getRange(1, 1, sheet.getLastRow(), 10).getDisplayValues();
    const formulas = sheet.getRange(1, 1, sheet.getLastRow(), 10).getFormulas();
    return {
      sheet,
      values,
      formulas,
      headerRow: null,
      firstRow,
      lastRow,
      nextHeadingRow: null,
      fixedRows: true,
    };
  }

  function hasConfiguredDataRows_(sheet, stage) {
    if (sheet.getMaxColumns() < 10) return false;
    const lastRow = sheet.getLastRow();
    if (!stage.groups.every((group) => {
      const [startRow, endRow] = getConfiguredDataRows_(stage, group).rows;
      return startRow >= 2 && endRow >= startRow && endRow <= lastRow;
    })) return false;

    return stage.groups.every((group) => {
      const [startRow, endRow] = getConfiguredDataRows_(stage, group).rows;
      return sheet
        .getRange(startRow, 2, endRow - startRow + 1, 1)
        .getDisplayValues()
        .some(([value]) => isChildName_(value));
    });
  }
  sheets.forEach((sheet) => {
    const lastRow = sheet.getLastRow();
    if (lastRow < 2 || sheet.getLastColumn() < 2) return;
    if (sheet.getMaxColumns() < 10) return;
    const values = sheet.getRange(1, 1, lastRow, 10).getDisplayValues();
    const formulas = sheet.getRange(1, 1, lastRow, 10).getFormulas();
    const headerIndex = values.findIndex(isDataHeader_);
    if (headerIndex < 0) return;

    const stageAliases = config.stageGroups
      .flatMap((entry) => entry.dataAliases)
      .map(normalizeSectionHeading_);
    const headings = [];
    values.forEach((row, index) => {
      if (
        index > headerIndex &&
        isDataSectionSeparator_(row) &&
        stageAliases.includes(normalizeSectionHeading_(row[0]))
      ) {
        headings.push({ row: index + 1, name: normalizeSectionHeading_(row[0]) });
      }
    });
    const aliases = getDataSectionAliases_(group).map(normalizeSectionHeading_);
    const matches = headings.filter((heading) => aliases.includes(heading.name));
    if (matches.length === 1) {
      candidates.push({ sheet, values, formulas, headings, marker: matches[0], headerRow: headerIndex + 1 });
    }
  });

  if (candidates.length !== 1) {
    throw new Error(
      candidates.length === 0
        ? "لم يتم العثور على تبويب بيانات فريد يطابق عناوين الأعمدة وقسم " + config.name + "."
        : "يوجد أكثر من تبويب بيانات مطابق لقسم " + config.name + "؛ لم يتم اختيار تبويب.",
    );
  }

  const candidate = candidates[0];
  const nextHeading = candidate.headings.find((heading) => heading.row > candidate.marker.row);
  return {
    sheet: candidate.sheet,
    values: candidate.values,
    formulas: candidate.formulas,
    headerRow: candidate.headerRow,
    firstRow: candidate.marker.row + 1,
    lastRow: nextHeading ? nextHeading.row - 1 : candidate.values.length,
    nextHeadingRow: nextHeading ? nextHeading.row : null,
  };
}

function isDataHeader_(row) {
  const cells = row.map((value) => normalizeText(value).replace(/\s+/g, ""));
  const startsWith = (index, prefixes) =>
    prefixes.some((prefix) => cells[index].startsWith(prefix));
  return startsWith(0, ["الرقم", "رقم"]) &&
    startsWith(1, ["الأسم", "الاسم", "اسم"]) &&
    startsWith(2, ["رقمالتليفون", "رقمالهاتف", "رقمالموبايل"]) &&
    startsWith(3, ["رقمالبيت", "رقمالمنزل"]) &&
    startsWith(4, ["الشارع"]) &&
    startsWith(5, ["المنطقة"]) &&
    startsWith(6, ["تاريخالميلاد"]) &&
    startsWith(7, ["ابالاعتراف", "أبالاعتراف"]) &&
    startsWith(8, ["الموقعالجغرافي", "الموقع"]) &&
    startsWith(9, ["ملاحظات"]);
}

function findAvailableAttendanceRow_(sheet, group) {
  const groupConfig = getGroupConfig_(group);
  const bounds = getGroupBounds_(sheet, groupConfig.id);
  const children = bounds.children;
  const lastChildRow = children.length
    ? Math.max(...children.map((child) => child.row))
    : bounds.headerRow;
  const row = lastChildRow + 1;
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  if (row <= bounds.endRow) {
    const nextRow = sheet.getRange(row, 1, 1, lastColumn);
    const values = nextRow.getDisplayValues()[0];
    const formulas = nextRow.getFormulas()[0];
    if (
      values.every((cell) => !normalizeText(cell)) &&
      formulas.every((formula) => !formula)
    ) {
      return { row, inserted: false };
    }
  }

  let inserted = false;
  let insertedRow = 0;
  try {
    insertedRow = bounds.endRow + 1;
    sheet.insertRowsBefore(insertedRow, 1);
    inserted = true;
    sheet.getRange(insertedRow - 1, 1, 1, lastColumn).copyTo(
      sheet.getRange(insertedRow, 1, 1, lastColumn),
      SpreadsheetApp.CopyPasteType.PASTE_FORMAT,
      false,
    );
    return {
      row: insertedRow,
      inserted: true,
      rowOffsetUpdate: buildAttendanceRowOffsetUpdate_(groupConfig, insertedRow),
    };
  } catch (error) {
    if (inserted) {
      try {
        sheet.deleteRow(insertedRow);
      } catch (rollbackError) {
        console.error("Attendance row expansion rollback failed", rollbackError);
        throw new Error("تعذر توسيع مجموعة الغياب واسترجاع الشيت؛ راجعي الشيت قبل إعادة المحاولة.");
      }
    }
    throw error;
  }
}

function getEnrollmentDatePropertyKey_(group, name) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    group + "\n" + normalizeText(name),
  );
  return ENROLLMENT_DATES_PROPERTY_PREFIX + Utilities.base64EncodeWebSafe(digest);
}

function isNotRegisteredOnDate_(group, name, date, cellValue) {
  if (cellValue === NOT_ENROLLED_MARK) return true;
  const enrolledOn = PropertiesService.getScriptProperties().getProperty(
    getEnrollmentDatePropertyKey_(group, name),
  );
  if (!enrolledOn) return false;
  const attendanceDate = parseSheetDate_(date);
  const enrollmentDate = parseSheetDate_(enrolledOn);
  return Boolean(attendanceDate && enrollmentDate && attendanceDate < enrollmentDate);
}

function findDataPersonRows_(section, name) {
  const matches = [];
  for (let row = section.firstRow; row <= section.lastRow; row += 1) {
    const values = section.values[row - 1];
    if (normalizeText(values[1]) === normalizeText(name)) matches.push(row);
  }
  return matches;
}

function getNextDataNumber_(section) {
  let maximum = 0;
  for (let row = section.firstRow; row <= section.lastRow; row += 1) {
    const number = Number(section.values[row - 1][0]);
    if (Number.isSafeInteger(number) && number > maximum) maximum = number;
  }
  return maximum + 1;
}

function addPersonToSheets_(attendanceSpreadsheet, group, person) {
  const config = getAttendanceConfig_(group);
  const attendanceSheet = findAttendanceSheet_(
    attendanceSpreadsheet,
    config.groups,
    config.attendanceSheetName,
  );
  const existingChildren = getChildren(attendanceSheet, group);
  if (existingChildren.some((child) => normalizeText(child.name) === normalizeText(person.name))) {
    throw new Error("يوجد شخص بهذا الاسم بالفعل في مجموعة الغياب.");
  }
  const section = getDataSection_(getDataSpreadsheet_(group), group);
  if (findDataPersonRows_(section, person.name).length > 0) {
    throw new Error("يوجد شخص بهذا الاسم بالفعل في قسمه بشيت البيانات.");
  }
  const stage = STAGES[config.stageId];
  let dataRow = 0;
  let insertedDataRow = false;
  let insertAtRow = 0;
  let dataRange = null;
  let dataRowOffsetUpdate = null;
  const dataSheet = section.sheet;
  for (let row = section.firstRow; row <= section.lastRow; row += 1) {
    if (
      section.values[row - 1].slice(0, 10).every((cell) => !normalizeText(cell)) &&
      section.formulas[row - 1].slice(0, 10).every((formula) => !formula)
    ) {
      dataRow = row;
      break;
    }
  }

  if (!dataRow) {
    if (section.fixedRows) {
      insertAtRow = section.lastRow + 1;
      dataRowOffsetUpdate = buildDataRowOffsetUpdate_(stage, config, insertAtRow);
    } else if (section.nextHeadingRow) {
      insertAtRow = section.nextHeadingRow;
    } else {
      insertAtRow = dataSheet.getLastRow() + 1;
    }
  }

  const attendanceReservation = findAvailableAttendanceRow_(attendanceSheet, group);
  const attendanceRow = attendanceReservation.row;
  const attendanceRange = attendanceSheet.getRange(
    attendanceRow,
    1,
    1,
    Math.max(attendanceSheet.getLastColumn(), 1),
  );
  const enrollmentPropertyKey = getEnrollmentDatePropertyKey_(group, person.name);
  const properties = PropertiesService.getScriptProperties();
  const previousEnrollmentDate = properties.getProperty(enrollmentPropertyKey);
  const previousDataRowOffsets = dataRowOffsetUpdate
    ? properties.getProperty(dataRowOffsetUpdate.propertyKey)
    : null;
  let enrollmentDateUpdated = false;
  let dataRowOffsetsUpdated = false;
  let rowOffsetsUpdated = false;
  const previousRowOffsets = attendanceReservation.rowOffsetUpdate
    ? properties.getProperty(attendanceReservation.rowOffsetUpdate.propertyKey)
    : null;
  try {
    if (insertAtRow) {
      if (section.fixedRows || section.nextHeadingRow) {
        dataSheet.insertRowsBefore(insertAtRow, 1);
      } else {
        dataSheet.insertRowsAfter(dataSheet.getLastRow(), 1);
      }
      dataRow = insertAtRow;
      insertedDataRow = true;
      const sourceRow = dataRow - 1;
      if (sourceRow >= section.firstRow) {
        dataSheet.getRange(sourceRow, 1, 1, 10).copyTo(
          dataSheet.getRange(dataRow, 1, 1, 10),
          SpreadsheetApp.CopyPasteType.PASTE_FORMAT,
          false,
        );
      }
    }
    dataRange = dataSheet.getRange(dataRow, 1, 1, 10);
    const nextNumber = getNextDataNumber_(section);
    const enrolledOn = Utilities.formatDate(new Date(), "Africa/Cairo", "d/M/yyyy");
    attendanceRange.getCell(1, 1).setValue(person.name);
    dataRange.setValues([[
      String(nextNumber),
      person.name,
      person.phone,
      person.homeNumber,
      person.street,
      person.area,
      person.birthDate,
      person.confessionFather,
      person.location,
      person.notes,
    ]]);
    SpreadsheetApp.flush();
    enrollmentDateUpdated = true;
    properties.setProperty(enrollmentPropertyKey, enrolledOn);
    if (attendanceReservation.rowOffsetUpdate) {
      properties.setProperty(
        attendanceReservation.rowOffsetUpdate.propertyKey,
        attendanceReservation.rowOffsetUpdate.value,
      );
      rowOffsetsUpdated = true;
    }
    if (dataRowOffsetUpdate) {
      properties.setProperty(dataRowOffsetUpdate.propertyKey, dataRowOffsetUpdate.value);
      dataRowOffsetsUpdated = true;
    }
    return "تمت إضافة الشخص إلى شيت الغياب وشيت البيانات.";
  } catch (error) {
    try {
      if (dataRowOffsetsUpdated && dataRowOffsetUpdate) {
        if (previousDataRowOffsets) {
          properties.setProperty(dataRowOffsetUpdate.propertyKey, previousDataRowOffsets);
        } else {
          properties.deleteProperty(dataRowOffsetUpdate.propertyKey);
        }
      }
      if (rowOffsetsUpdated && attendanceReservation.rowOffsetUpdate) {
        if (previousRowOffsets) {
          properties.setProperty(
            attendanceReservation.rowOffsetUpdate.propertyKey,
            previousRowOffsets,
          );
        } else {
          properties.deleteProperty(attendanceReservation.rowOffsetUpdate.propertyKey);
        }
      }
      if (enrollmentDateUpdated) {
        if (previousEnrollmentDate) {
          properties.setProperty(enrollmentPropertyKey, previousEnrollmentDate);
        } else {
          properties.deleteProperty(enrollmentPropertyKey);
        }
      }
      if (attendanceReservation.inserted) {
        attendanceSheet.deleteRow(attendanceRow);
      } else {
        attendanceRange.clearContent();
      }
      if (insertedDataRow) dataSheet.deleteRow(dataRow);
      else if (dataRange) dataRange.clearContent();
      SpreadsheetApp.flush();
    } catch (rollbackError) {
      console.error("Roster add rollback failed", rollbackError);
      throw new Error("فشلت الإضافة ولم يكتمل التراجع عنها؛ راجعي الشيتين قبل إعادة المحاولة.");
    }
    throw error;
  }
}

function getRowSnapshot_(range) {
  return { values: range.getValues()[0], formulas: range.getFormulas()[0] };
}

function restoreRow_(range, snapshot) {
  range.setValues([snapshot.values]);
  snapshot.formulas.forEach((formula, index) => {
    if (formula) range.getCell(1, index + 1).setFormula(formula);
  });
}

function removePersonFromSheets_(attendanceSpreadsheet, group, row, name) {
  const config = getAttendanceConfig_(group);
  const attendanceSheet = findAttendanceSheet_(
    attendanceSpreadsheet,
    config.groups,
    config.attendanceSheetName,
  );
  const child = getChildren(attendanceSheet, group).find((entry) => entry.row === row);
  if (!child || normalizeText(child.name) !== normalizeText(name)) {
    throw new Error("تغيرت قائمة المجموعة. حدّثي الصفحة وحاولي مرة أخرى.");
  }

  const section = getDataSection_(getDataSpreadsheet_(group), group);
  const dataRows = findDataPersonRows_(section, name);
  if (dataRows.length !== 1) {
    throw new Error(
      dataRows.length === 0
        ? "لم يتم العثور على الشخص في قسمه بشيت البيانات."
        : "يوجد أكثر من سجل بالاسم نفسه في شيت البيانات؛ لم يتم حذف أي سجل.",
    );
  }

  const attendanceRange = attendanceSheet.getRange(
    row,
    1,
    1,
    Math.max(attendanceSheet.getLastColumn(), 1),
  );
  const dataRange = section.sheet.getRange(dataRows[0], 1, 1, 10);
  const attendanceSnapshot = getRowSnapshot_(attendanceRange);
  const dataSnapshot = getRowSnapshot_(dataRange);
  const enrollmentPropertyKey = getEnrollmentDatePropertyKey_(group, name);
  const properties = PropertiesService.getScriptProperties();
  const enrollmentDate = properties.getProperty(enrollmentPropertyKey);
  let enrollmentDateDeleted = false;
  try {
    attendanceRange.clearContent();
    dataRange.clearContent();
    SpreadsheetApp.flush();
    enrollmentDateDeleted = true;
    properties.deleteProperty(enrollmentPropertyKey);
    return "تم حذف الشخص وبياناته وسجل حضوره من الشيتين.";
  } catch (error) {
    try {
      if (enrollmentDateDeleted && enrollmentDate) {
        properties.setProperty(enrollmentPropertyKey, enrollmentDate);
      }
      restoreRow_(attendanceRange, attendanceSnapshot);
      restoreRow_(dataRange, dataSnapshot);
      SpreadsheetApp.flush();
    } catch (rollbackError) {
      console.error("Roster removal rollback failed", rollbackError);
      throw new Error("فشل الحذف ولم يكتمل استرجاع البيانات؛ راجعي الشيتين فورًا.");
    }
    throw error;
  }
}

function updatePersonInSheets_(attendanceSpreadsheet, group, currentName, person) {
  const config = getAttendanceConfig_(group);
  const attendanceSheet = findAttendanceSheet_(
    attendanceSpreadsheet,
    config.groups,
    config.attendanceSheetName,
  );
  const attendanceMatches = getChildren(attendanceSheet, group).filter(
    (child) => normalizeText(child.name) === normalizeText(currentName),
  );
  if (attendanceMatches.length !== 1) {
    throw new Error(
      attendanceMatches.length === 0
        ? "لم يتم العثور على الشخص في مجموعته بشيت الغياب."
        : "يوجد أكثر من شخص بالاسم نفسه في شيت الغياب؛ لم يتم تحديث أي سجل.",
    );
  }

  const section = getDataSection_(getDataSpreadsheet_(group), group);
  const dataRows = findDataPersonRows_(section, currentName);
  if (dataRows.length !== 1) {
    throw new Error(
      dataRows.length === 0
        ? "لم يتم العثور على الشخص في قسمه بشيت البيانات."
        : "يوجد أكثر من سجل بالاسم نفسه في شيت البيانات؛ لم يتم تحديث أي سجل.",
    );
  }

  const attendanceChild = attendanceMatches[0];
  const dataRow = dataRows[0];
  const normalizedNewName = normalizeText(person.name);
  if (normalizedNewName !== normalizeText(currentName)) {
    if (getChildren(attendanceSheet, group).some(
      (child) => child.row !== attendanceChild.row &&
        normalizeText(child.name) === normalizedNewName,
    )) {
      throw new Error("يوجد شخص بهذا الاسم بالفعل في مجموعة الغياب.");
    }
    if (findDataPersonRows_(section, person.name).some((row) => row !== dataRow)) {
      throw new Error("يوجد شخص بهذا الاسم بالفعل في قسمه بشيت البيانات.");
    }
  }

  const attendanceRange = attendanceSheet.getRange(attendanceChild.row, 1);
  const dataRange = section.sheet.getRange(dataRow, 2, 1, 9);
  const attendanceSnapshot = getRowSnapshot_(attendanceRange);
  const dataSnapshot = getRowSnapshot_(dataRange);
  const oldEnrollmentKey = getEnrollmentDatePropertyKey_(group, currentName);
  const newEnrollmentKey = getEnrollmentDatePropertyKey_(group, person.name);
  const properties = PropertiesService.getScriptProperties();
  const oldEnrollmentDate = properties.getProperty(oldEnrollmentKey);
  const newEnrollmentDate = oldEnrollmentKey === newEnrollmentKey
    ? oldEnrollmentDate
    : properties.getProperty(newEnrollmentKey);
  if (
    oldEnrollmentKey !== newEnrollmentKey &&
    oldEnrollmentDate &&
    newEnrollmentDate
  ) {
    throw new Error("توجد بيانات تسجيل مرتبطة بالاسم الجديد؛ لم يتم تحديث أي سجل.");
  }

  try {
    attendanceRange.setValue(person.name);
    dataRange.setValues([[
      person.name,
      person.phone,
      person.homeNumber,
      person.street,
      person.area,
      person.birthDate,
      person.confessionFather,
      person.location,
      person.notes,
    ]]);
    if (oldEnrollmentKey !== newEnrollmentKey && oldEnrollmentDate) {
      properties.setProperty(newEnrollmentKey, oldEnrollmentDate);
      properties.deleteProperty(oldEnrollmentKey);
    }
    SpreadsheetApp.flush();
    return "تم تحديث بيانات الشخص في شيت البيانات وسجل الحضور.";
  } catch (error) {
    try {
      restoreRow_(attendanceRange, attendanceSnapshot);
      restoreRow_(dataRange, dataSnapshot);
      if (oldEnrollmentKey !== newEnrollmentKey) {
        if (oldEnrollmentDate) properties.setProperty(oldEnrollmentKey, oldEnrollmentDate);
        else properties.deleteProperty(oldEnrollmentKey);
        if (newEnrollmentDate) properties.setProperty(newEnrollmentKey, newEnrollmentDate);
        else properties.deleteProperty(newEnrollmentKey);
      }
      SpreadsheetApp.flush();
    } catch (rollbackError) {
      console.error("Roster update rollback failed", rollbackError);
      throw new Error("فشل التحديث ولم يكتمل استرجاع البيانات؛ راجعي الشيتين فورًا.");
    }
    throw error;
  }
}

function hasFridayDateHeader_(sheet, timezone) {
  return getDateHeaderInfo_(sheet, timezone).dates.length > 0;
}

function getFridayDateHeaderDiagnostics_(sheet, timezone) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn < 2) {
    return {
      headerRow: null,
      rows: [],
    };
  }

  const rowCount = Math.min(sheet.getLastRow(), 10);
  if (rowCount === 0) return { headerRow: null, rows: [] };
  const values = sheet.getRange(1, 1, rowCount, lastColumn).getValues();
  let selectedRow = null;
  let selectedFridayCount = 0;
  const rows = values.map((headers, index) => {
    let nonEmptyCellCount = 0;
    let dateObjectCount = 0;
    let numericDateCount = 0;
    let parseableDateCount = 0;
    let fridayDateCount = 0;
    headers.forEach((value) => {
      if (value !== "" && value !== null) nonEmptyCellCount += 1;
      if (value instanceof Date && !isNaN(value.getTime())) dateObjectCount += 1;
      if (typeof value === "number" && isGoogleDateSerial_(value)) numericDateCount += 1;
      if (normalizeDate(value, timezone)) parseableDateCount += 1;
      if (isFridayDateHeader(value, timezone)) fridayDateCount += 1;
    });
    if (fridayDateCount > selectedFridayCount) {
      selectedRow = index + 1;
      selectedFridayCount = fridayDateCount;
    }
    return {
      row: index + 1,
      nonEmptyCellCount,
      dateObjectCount,
      numericDateCount,
      parseableDateCount,
      fridayDateCount,
    };
  });
  return {
    headerRow: selectedRow,
    rows,
  };
}

function getDateHeaderInfo_(sheet, timezone) {
  const lastColumn = sheet.getLastColumn();
  const rowCount = Math.min(sheet.getLastRow(), 10);
  if (lastColumn < 1 || rowCount < 1) return { row: null, dates: [] };

  const values = sheet.getRange(1, 1, rowCount, lastColumn).getValues();
  let best = { row: null, dates: [] };
  values.forEach((headers, index) => {
    const dates = [];
    headers.forEach((value, column) => {
      const normalized = normalizeDate(value, timezone);
      if (normalized && isFridayDateHeader(value, timezone)) {
        dates.push({ value: normalized, column: column + 1 });
      }
    });
    if (dates.length > best.dates.length) {
      best = { row: index + 1, dates };
    }
  });
  return best;
}

function isGoogleDateSerial_(value) {
  return Number.isFinite(value) && value >= 1 && value <= 2958465;
}

function isChildName_(value) {
  const name = normalizeText(value);
  if (!name || isSummaryRow(name) || isGroupName_(name)) return false;
  if (/^(?:الحضور|الغياب|النسبة|الأسم|الاسم|بنين|بنات)$/u.test(name)) return false;
  if (/^[\d\s=+*/_.-]+$/u.test(name) || name.startsWith("=")) return false;
  return true;
}

function isGroupName_(value) {
  const normalized = normalizeText(value);
  return getAllAttendanceGroups_().some((group) =>
    getAttendanceGroupHeadingAliases_(group).includes(normalized),
  );
}

function getDates(sheet, timezone) {
  const dates = getDateHeaderInfo_(sheet, timezone).dates;
  if (dates.length === 0) {
    throw new Error("No Friday dates found in spreadsheet");
  }

  return dates;
}

function findDateColumn(dates, requestedDate) {
  const wanted = normalizeDate(requestedDate);
  if (!wanted) throw new Error("Invalid date");

  const date = dates.find((entry) => entry.value === wanted);
  if (!date) throw new Error("Date not found in spreadsheet");
  return date.column;
}

function validateGroup(group) {
  if (!isAttendanceGroup_(group)) throw new Error("Invalid group");
  return group;
}

function normalizeDate(value, timezone) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, timezone, "d/M/yyyy");
  }

  if (typeof value === "number" && isGoogleDateSerial_(value)) {
    const milliseconds = Date.UTC(1899, 11, 30) + Math.floor(value) * 86400000;
    return Utilities.formatDate(new Date(milliseconds), timezone, "d/M/yyyy");
  }

  const text = String(value || "").trim();
  let match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) return "";
    return `${day}/${month}/${year}`;
  }

  match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return "";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) return "";
  return `${day}/${month}/${year}`;
}

function parseSheetDate_(value) {
  const match = String(value || "").trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])));
  if (
    date.getUTCFullYear() !== Number(match[3]) ||
    date.getUTCMonth() !== Number(match[2]) - 1 ||
    date.getUTCDate() !== Number(match[1])
  ) {
    return null;
  }
  return date;
}

function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function isSummaryRow(value) {
  const normalized = normalizeText(value).replace(/[:：]\s*\d+\s*$/, "");
  return SUMMARY_LABEL_PATTERN.test(normalized) ||
    /^(?:(?:ال)?(?:عدد|مجموع|إجمال[يى]|اجمال[يى]))(?:\s|$)/u.test(normalized) ||
    /^\d+$/.test(normalized);
}

function isFridayDateHeader(value, timezone) {
  const normalized = normalizeDate(value, timezone);
  if (!normalized) return false;

  const [day, month, year] = normalized.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getDay() === 5;
}

function safeEqual(left, right) {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
