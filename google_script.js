/**
 * DARSHAN PASS PUBLIC FORM - GOOGLE APPS SCRIPT
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit
 * 
 * Clean 19-Column Structure (Pass Created Date in Col B & Pass Status in Col C):
 * 1. Timestamp (dd/mm/yyyy hh:mm:ss)
 * 2. पास बनने की तिथि (Pass Created Date - DD/MM/YYYY)
 * 3. पास स्थिति (Pass Status - Pending / Pass Created / Rejected)
 * 4. दर्शन तिथि (Visit Date - DD/MM/YYYY)
 * 5. दर्शन समय स्लॉट (Visit Time Slot - 07:00 AM - 09:00 AM)
 * 6. नाम व उम्र (Name & Age)
 * 7. राज्य (State)
 * 8. जिला (District)
 * 9. आधार नं0/पासपोर्ट नं0 (ID Number)
 * 10. पुरूषो व महिलाओं की संख्या (Gender Counts Text)
 * 11. मो0नं0 (Mobile Number)
 * 12. गाडी नं0 (Vehicle Number)
 * 13. साथ में आने वाले सदस्यों के नाम व उम्र (Accompanying Devotees)
 * 14. Referred by (Reference Officer)
 * 15. आवेदनकर्ता गूगल नाम (Submitter Name)
 * 16. आवेदनकर्ता ईमेल ID (Submitter Email)
 * 17. कुल दर्शनार्थी संख्या (Total Devotees Numeric SUM)
 * 18. पुरुष संख्या (Male Count Numeric)
 * 19. महिला संख्या (Female Count Numeric)
 */

/**
 * 🔐 AUTHORIZED ADMIN CONFIGURATION
 * Only users listed in ADMIN_EMAILS or the Spreadsheet Owner can access/view "⚙️ VIP Tools".
 * Unauthorized shared editors or viewers will NOT see the VIP Tools menu and cannot run administrative tools.
 */
var ADMIN_EMAILS = [
  "smartcellayd@gmail.com"
];

function isAuthorizedAdmin() {
  try {
    var activeEmail = (Session.getActiveUser().getEmail() || '').toLowerCase().trim();
    var effectiveEmail = (Session.getEffectiveUser().getEmail() || '').toLowerCase().trim();

    for (var i = 0; i < ADMIN_EMAILS.length; i++) {
      var adm = ADMIN_EMAILS[i].toLowerCase().trim();
      if ((activeEmail && activeEmail === adm) || (effectiveEmail && effectiveEmail === adm)) {
        return true;
      }
    }

    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet() || getTargetSpreadsheet();
      if (ss) {
        var owner = ss.getOwner();
        if (owner && owner.getEmail()) {
          var ownerEmail = owner.getEmail().toLowerCase().trim();
          if ((activeEmail && activeEmail === ownerEmail) || (effectiveEmail && effectiveEmail === ownerEmail)) {
            return true;
          }
        }
      }
    } catch (e) {}

    return false;
  } catch (err) {
    return false;
  }
}

// HELPER: RESPOND AS JSON OR JSONP
function respondJson(e, obj) {
  var callback = e && e.parameter ? e.parameter.callback : null;
  var jsonStr = JSON.stringify(obj);
  if (callback && typeof callback === 'string' && /^[a-zA-Z0-9_$]+$/.test(callback)) {
    return ContentService.createTextOutput(callback + "(" + jsonStr + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(jsonStr)
    .setMimeType(ContentService.MimeType.JSON);
}

// HELPER: PARSE TIMESTAMPS ROBUSTLY (HANDLES DATE OBJECTS, ISO, AND DD/MM/YYYY HH:mm:ss)
function parseTimestampSafe(val) {
  if (!val) return 0;
  if (val instanceof Date) {
    var t = val.getTime();
    return isNaN(t) ? 0 : t;
  }
  var str = String(val).trim();
  var match = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (match) {
    var day = parseInt(match[1], 10);
    var month = parseInt(match[2], 10) - 1;
    var year = parseInt(match[3], 10);
    var hour = parseInt(match[4] || 0, 10);
    var min = parseInt(match[5] || 0, 10);
    var sec = parseInt(match[6] || 0, 10);
    var d = new Date(year, month, day, hour, min, sec);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }
  var parsed = new Date(str).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = false;
  try {
    // Wait up to 30 seconds for concurrent submissions to queue safely
    hasLock = lock.waitLock(30000);
  } catch (lockErr) {
    hasLock = false;
  }

  try {
    var ss = getTargetSpreadsheet();
    var sheet = getMainDataSheet(ss);
    if (!sheet) {
      return respondJson(e, {
        "result": "error",
        "status": "error",
        "error": "Google Sheet not accessible."
      });
    }

    var data = {};

    // 1. Extract payload from JSON or Form Parameters
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 2. Extract values safely
    var visitDate = data.visitDate || data.visit_date || '';
    var visitSlot = data.visitSlot || data.visit_slot || '';
    var visitDateTime = data.visitDateTime || data.visitdate || data.visit_date || '';

    if (!visitDate && visitDateTime) {
      var match = visitDateTime.match(/^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\s*\((.*)\)$/);
      if (match) {
        visitDate = match[1];
        visitSlot = match[2];
      }
    }

    if (visitDate && visitDate.includes("-")) {
      var parts = visitDate.split("-");
      if (parts.length === 3) {
        visitDate = parts[2] + "/" + parts[1] + "/" + parts[0]; // DD/MM/YYYY
      }
    }

    var nameAge = data.nameAge || data.name_age || data.name || '';
    var state = data.state || '';
    var district = data.district || '';
    var idNumber = data.idNumber || data.id_number || data.id || '';

    var mVal = parseInt(data.maleCount || data.male_count || 0) || 0;
    var fVal = parseInt(data.femaleCount || data.female_count || 0) || 0;
    var genderCountsStr = "Male: " + mVal + ", Female: " + fVal;
    var totalDevotees = mVal + fVal;

    var mobile = data.mobile || data.phone || '';
    var vehicleNo = data.vehicleNo || data.vehicle_no || '';
    var accompanying = data.accompanying || data.members || '';
    var referredBy = data.referredBy || data.referred_by || '';
    var submitterName = data.submitterName || data.submitter_name || data.user_name || '';
    var submitterEmail = data.submitterEmail || data.submitter_email || data.user_email || '';

    // Safety Guard: Reject empty/ghost submissions
    if (!nameAge && !visitDate && !mobile) {
      return respondJson(e, {
        "result": "ignored",
        "message": "Empty submission ignored."
      });
    }

    // 3. SERVER-SIDE 24-HOUR DUPLICATE GUARD BEFORE APPENDING ROW (आधार व मोबाइल नंबर चेक)
    var dupCheck = checkDuplicateBeforeSubmission(sheet, idNumber, mobile);
    if (dupCheck && dupCheck.isDuplicate) {
      return respondJson(e, {
        "result": "duplicate",
        "isDuplicate": true,
        "matchedRow": dupCheck.matchedRow,
        "matchedField": dupCheck.matchedField,
        "status": dupCheck.status,
        "message": "इस " + dupCheck.matchedField + " से आवेदन पहले ही दर्ज है (Row: " + dupCheck.matchedRow + ", स्थिति: " + dupCheck.status + ")।"
      });
    }

    // Initial Status is always 'Pending' when form is filled
    var passStatus = "Pending";
    var passCreatedDate = ""; // Empty until pass is generated

    // 4. Append row in exact 19-column order matching Google Sheet
    sheet.appendRow([
      new Date(),                                    // 1. Timestamp (Column A)
      passCreatedDate,                               // 2. पास बनने की तिथि (Pass Created Date - Column B)
      passStatus,                                    // 3. पास स्थिति (Pass Status - Column C)
      visitDate,                                     // 4. दर्शन तिथि (Visit Date - DD/MM/YYYY)
      visitSlot,                                     // 5. दर्शन समय स्लॉट (Visit Time Slot)
      nameAge,                                       // 6. नाम व उम्र
      state,                                         // 7. राज्य
      district,                                      // 8. जिला
      idNumber,                                      // 9. आधार नं0/पासपोर्ट नं0
      genderCountsStr,                               // 10. पुरूषो व महिलाओं की संख्या
      mobile,                                        // 11. मो0नं0
      vehicleNo,                                     // 12. गाडी नं0
      accompanying,                                  // 13. साथ में आने वाले सदस्यों के नाम व उम्र
      referredBy,                                    // 14. Referred by
      submitterName,                                 // 15. Submitter Name
      submitterEmail,                                // 16. Submitter Email
      totalDevotees,                                 // 17. कुल दर्शनार्थी संख्या (Numeric SUM)
      mVal,                                          // 18. पुरुष संख्या (Numeric)
      fVal                                           // 19. महिला संख्या (Numeric)
    ]);

    // Flush immediately so the row is committed and exact row number is locked in
    SpreadsheetApp.flush();
    var lastRow = sheet.getLastRow();

    // Fast, non-blocking row dropdown configuration
    try {
      if (lastRow > 1) {
        var statusCell = sheet.getRange(lastRow, 3);
        var rule = SpreadsheetApp.newDataValidation()
          .requireValueInList(["Pending", "Pass Created", "Already Created (अन्य काउंटर से)", "Rejected"], true)
          .setAllowInvalid(false)
          .build();
        statusCell.setDataValidation(rule);
      }
    } catch (fmtErr) {}

    // Generate atomic Token ID: AYO-YYYYMMDD-ROW
    var nowKolkata = new Date();
    var ymd = Utilities.formatDate(nowKolkata, "Asia/Kolkata", "yyyyMMdd");
    var generatedToken = "AYO-" + ymd + "-" + lastRow;

    return respondJson(e, {
      "result": "success",
      "status": "success",
      "rowNumber": lastRow,
      "row": lastRow,
      "token": generatedToken,
      "name": nameAge,
      "mobile": mobile,
      "isDuplicate": false,
      "message": "Darshan Pass entry saved successfully with Status = Pending in Column C!"
    });

  } catch (error) {
    return respondJson(e, {
      "result": "error",
      "status": "error",
      "error": error.toString()
    });

  } finally {
    try {
      if (hasLock && lock.hasLock()) {
        lock.releaseLock();
      }
    } catch (relErr) {}
  }
}

function doGet(e) {
  var ss = getTargetSpreadsheet();
  var sheet = getMainDataSheet(ss);
  var lastRow = sheet ? sheet.getLastRow() : 0;

  // DYNAMIC REFERENCE OFFICERS SYNC HANDLER
  if (e && e.parameter && (e.parameter.action === 'get_officers' || e.parameter.action === 'officers')) {
    try {
      var officersList = getReferenceOfficersList(ss);
      return respondJson(e, {
        "status": "success",
        "officers": officersList
      });
    } catch (oErr) {
      return respondJson(e, {
        "status": "error",
        "message": oErr.toString(),
        "officers": DEFAULT_OFFICERS_LIST
      });
    }
  }

  // 1-CLICK SETUP REFERENCE OFFICERS TAB
  if (e && e.parameter && (e.parameter.action === 'setup_officers' || e.parameter.action === 'init_officers')) {
    try {
      getOrCreateReferenceOfficersSheet(ss);
      return respondJson(e, {
        "status": "success",
        "message": "Reference_Officers tab successfully initialized and active!"
      });
    } catch (sErr) {
      return respondJson(e, {
        "status": "error",
        "message": sErr.toString()
      });
    }
  }

  // 1-CLICK AUTO REPAIR & FORMAT SHEET HANDLER
  if (e && e.parameter && (e.parameter.action === 'format' || e.parameter.action === 'fix' || e.parameter.action === 'realign')) {
    try {
      var result = fixAndRealignAllSheetColumns();
      return respondJson(e, {
        "status": "success",
        "result": result,
        "message": "Google Sheet columns and rows successfully repaired and 100% realigned!"
      });
    } catch (err) {
      return respondJson(e, {
        "status": "error",
        "message": err.toString()
      });
    }
  }

  // INSTANT COLOR REFRESH HANDLER
  if (e && e.parameter && (e.parameter.action === 'recolor' || e.parameter.action === 'color')) {
    try {
      refreshAllRowColors();
      return respondJson(e, {
        "status": "success",
        "message": "All row colors successfully refreshed according to status!"
      });
    } catch (cErr) {
      return respondJson(e, {
        "status": "error",
        "message": cErr.toString()
      });
    }
  }

  // 1-CLICK LOCK & PROTECT ROW 1 HEADERS
  if (e && e.parameter && (e.parameter.action === 'lock' || e.parameter.action === 'protect')) {
    try {
      var lockResult = lockAndProtectHeaderRow();
      return respondJson(e, {
        "status": "success",
        "result": lockResult,
        "message": "Row 1 headers successfully locked and protected!"
      });
    } catch (lErr) {
      return respondJson(e, {
        "status": "error",
        "message": lErr.toString()
      });
    }
  }

  // 1-CLICK UNLOCK ROW 1 HEADERS
  if (e && e.parameter && (e.parameter.action === 'unlock' || e.parameter.action === 'unprotect')) {
    try {
      var unlockResult = unlockRow1Headers();
      return respondJson(e, {
        "status": "success",
        "result": unlockResult,
        "message": "Row 1 headers successfully unlocked!"
      });
    } catch (uErr) {
      return respondJson(e, {
        "status": "error",
        "message": uErr.toString()
      });
    }
  }

  // PASS APPLICATION TRACKING HANDLER (Token, Mobile, or Aadhaar)
  if (e && e.parameter && e.parameter.action === 'track') {
    var rawQuery = String(e.parameter.query || e.parameter.token || e.parameter.mobile || '').trim();
    if (!rawQuery || !sheet) {
      return respondJson(e, {
        "result": "not_found",
        "message": "कृपया टोकन, आधार या 10-अंकों का मोबाइल नंबर दर्ज करें"
      });
    }

    var query = rawQuery.toLowerCase();
    var queryDigits = rawQuery.replace(/\D/g, '');

    // Disambiguate Mobile vs Aadhaar:
    // Mobile: exactly 10 digits, or 11 with leading 0, or 12 starting with 91
    var queryLast10 = "";
    if (queryDigits.length === 10) {
      queryLast10 = queryDigits;
    } else if (queryDigits.length === 11 && queryDigits.startsWith("0")) {
      queryLast10 = queryDigits.slice(1);
    } else if (queryDigits.length === 12 && queryDigits.startsWith("91")) {
      queryLast10 = queryDigits.slice(2);
    }
    var queryCleanId = String(rawQuery).trim().toUpperCase().replace(/[\s\-]/g, '');

    // Extract exact target row if searching by Token (e.g. AYO-20260830-1140 -> "1140")
    var targetTokenRow = "";
    var cleanTokenStr = query.replace(/^ayo-/i, "");
    var lastDash = cleanTokenStr.lastIndexOf("-");
    if (lastDash !== -1) {
      targetTokenRow = cleanTokenStr.substring(lastDash + 1).trim();
    } else if (/^\d+$/.test(query) && query.length < 7) {
      targetTokenRow = query;
    }

    var data = sheet.getDataRange().getValues();
    var match = null;

    var statusCol = findStatusColumn(sheet);
    var dateCol = findPassCreatedDateColumn(sheet);
    var colSlot = findColumnByKeywords(sheet, ["स्लॉट", "slot"], 5);
    var colName = findColumnByKeywords(sheet, ["नाम", "name"], 6);
    var colId = findColumnByKeywords(sheet, ["आधार", "पहचान", "id"], 9);
    var colMob = findColumnByKeywords(sheet, ["मो0नं0", "mobile", "phone"], 11);
    var colRef = findColumnByKeywords(sheet, ["referred", "संदर्भ"], 14);
    var colTotal = findColumnByKeywords(sheet, ["कुल दर्शनार्थी", "total"], 17);

    for (var r = data.length - 1; r >= 1; r--) {
      var rowData = data[r];
      var rowNum = r + 1;

      // Detect slot cell index dynamically in this row
      var slotIdx = -1;
      for (var c = 0; c < rowData.length; c++) {
        var strCell = String(rowData[c] || '').trim();
        if (/^\d{1,2}:\d{2}\s*(?:AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM)$/i.test(strCell)) {
          slotIdx = c;
          break;
        }
      }

      var vSlot = "";
      var vDate = "";
      var name = "";
      var rowId = "";
      var mob = "";
      var ref = "";
      var total = "";

      if (slotIdx !== -1) {
        vSlot = String(rowData[slotIdx] || '').trim();
        vDate = formatSheetDateToDDMMYYYY(rowData[slotIdx - 1]);
        name = String(rowData[slotIdx + 1] || '').trim();
        rowId = String(rowData[slotIdx + 4] || '').trim();
        mob = String(rowData[slotIdx + 6] || '').trim();
        ref = String(rowData[slotIdx + 9] || '').trim();
        total = String(rowData[slotIdx + 12] || '').trim();
      } else {
        vDate = formatSheetDateToDDMMYYYY(rowData[colSlot - 2] || rowData[3]);
        vSlot = String(rowData[colSlot - 1] || rowData[4] || '').trim();
        name = String(rowData[colName - 1] || rowData[5] || '').trim();
        rowId = String(rowData[colId - 1] || rowData[8] || '').trim();
        mob = String(rowData[colMob - 1] || rowData[10] || '').trim();
        ref = String(rowData[colRef - 1] || rowData[13] || '').trim();
        total = String(rowData[colTotal - 1] || rowData[16] || '').trim();
      }

      // Skip ghost or blank rows
      if (!name && !mob && !vDate) continue;

      var cleanMob = String(mob).replace(/\D/g, '');
      var mobLast10 = cleanMob.length >= 10 ? cleanMob.slice(-10) : "";
      var cleanId = String(rowId).trim().toUpperCase().replace(/[\s\-]/g, '');

      var isMobileMatch = (queryLast10 !== "" && mobLast10 !== "" && queryLast10 === mobLast10);
      var isIdMatch = (queryCleanId.length >= 6 && cleanId.length >= 6 && (cleanId === queryCleanId || cleanId.includes(queryCleanId) || queryCleanId.includes(cleanId)));
      var isRowMatch = (targetTokenRow !== "" && String(rowNum) === targetTokenRow);

      // Deep search row cells if not yet matched
      if (!isMobileMatch && !isIdMatch && !isRowMatch) {
        for (var mc = 0; mc < rowData.length; mc++) {
          var cellVal = String(rowData[mc] || '').trim();
          var cellDigits = cellVal.replace(/\D/g, '');
          if (queryLast10 && cellDigits.length >= 10 && cellDigits.slice(-10) === queryLast10) {
            isMobileMatch = true;
            break;
          }
          var cleanCellId = cellVal.toUpperCase().replace(/[\s\-]/g, '');
          if (queryCleanId.length >= 6 && cleanCellId.length >= 6 && (cleanCellId === queryCleanId || cleanCellId.includes(queryCleanId) || queryCleanId.includes(cleanCellId))) {
            isIdMatch = true;
            break;
          }
        }
      }

      if (isMobileMatch || isIdMatch || isRowMatch) {
        // DETECT STATUS WITH 100% BULLETPROOF ACCURACY:
        var status = "";
        var passDate = "";

        // 1. Check all cells in the row before visit date / slot
        var maxStatusCheck = (slotIdx !== -1) ? slotIdx : Math.min(rowData.length, 6);
        for (var sc = 1; sc < maxStatusCheck; sc++) {
          var scRaw = String(rowData[sc] || '').replace(/[\u00A0\s]+/g, ' ').trim().toLowerCase();
          if (scRaw.includes("pass created") || scRaw.includes("approved") || scRaw.includes("बन गया") || scRaw.includes("स्वीकृत")) {
            status = "Pass Created";
          } else if (scRaw.includes("already") || scRaw.includes("अन्य काउंटर")) {
            status = "Already Created (अन्य काउंटर से)";
          } else if (scRaw.includes("rejected") || scRaw.includes("निरस्त") || scRaw.includes("अस्वीकृत")) {
            status = "Rejected";
          } else if (scRaw.includes("pending")) {
            if (!status) status = "Pending";
          }

          var testDate = formatSheetDateToDDMMYYYY(rowData[sc]);
          if (testDate && testDate.includes("/") && testDate !== vDate) {
            passDate = testDate;
          }
        }

        // 2. Cross-check against detected statusCol
        if (statusCol > 0 && statusCol <= rowData.length) {
          var colVal = String(rowData[statusCol - 1] || '').replace(/[\u00A0\s]+/g, ' ').trim().toLowerCase();
          if (colVal.includes("pass created") || colVal.includes("approved") || colVal.includes("बन गया") || colVal.includes("स्वीकृत")) {
            status = "Pass Created";
          } else if (colVal.includes("already") || colVal.includes("अन्य काउंटर")) {
            status = "Already Created (अन्य काउंटर से)";
          } else if (colVal.includes("rejected") || colVal.includes("निरस्त") || colVal.includes("अस्वीकृत")) {
            status = "Rejected";
          } else if (colVal.includes("pending") && !status) {
            status = "Pending";
          }
        }

        if (!status) status = "Pending";

        // 3. Extract Pass Created Date
        if (!passDate && dateCol > 0 && dateCol <= rowData.length) {
          passDate = formatSheetDateToDDMMYYYY(rowData[dateCol - 1]);
        }
        if (!passDate && status === "Pass Created") {
          passDate = formatSheetDateToDDMMYYYY(rowData[0]);
        }

        // Build consistent canonical token ID using submission date (Column A) and rowNumber
        var tokenDateStr = "";
        var tsVal = rowData[0];
        var tsMs = parseTimestampSafe(tsVal);
        if (tsMs > 0) {
          tokenDateStr = Utilities.formatDate(new Date(tsMs), "Asia/Kolkata", "yyyyMMdd");
        } else if (vDate && vDate.includes("/")) {
          var p = vDate.split("/");
          if (p.length === 3) tokenDateStr = p[2] + ('0' + p[1]).slice(-2) + ('0' + p[0]).slice(-2);
        } else {
          tokenDateStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyyMMdd");
        }
        var canonicalToken = "AYO-" + tokenDateStr + "-" + rowNum;

        match = {
          rowNumber: rowNum,
          token: canonicalToken,
          status: status,
          passCreatedDate: passDate,
          visitDate: vDate,
          visitSlot: vSlot,
          name: name,
          mobile: mob,
          referredBy: ref,
          totalDevotees: total
        };
        break;
      }
    }

    if (match) {
      return respondJson(e, {
        "result": "success",
        "data": match
      });
    } else {
      return respondJson(e, {
        "result": "not_found",
        "message": "कोई आवेदन नहीं मिला। कृपया विवरण जांचें।"
      });
    }
  }

  return respondJson(e, {
    "status": "online",
    "lastRow": lastRow,
    "message": "Darshan Pass Apps Script API is active."
  });
}

function formatSheetDateToDDMMYYYY(val) {
  if (!val) return '';
  if (val instanceof Date) {
    var day = ('0' + val.getDate()).slice(-2);
    var month = ('0' + (val.getMonth() + 1)).slice(-2);
    var year = val.getFullYear();
    return day + '/' + month + '/' + year;
  }
  var str = String(val).trim();
  if (str.includes('GMT') || str.includes('T00:')) {
    var d = new Date(str);
    if (!isNaN(d.getTime())) {
      var dd = ('0' + d.getDate()).slice(-2);
      var mm = ('0' + (d.getMonth() + 1)).slice(-2);
      var yyyy = d.getFullYear();
      return dd + '/' + mm + '/' + yyyy;
    }
  }
  return str;
}

function getTargetSpreadsheet() {
  try {
    return SpreadsheetApp.openById("1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo");
  } catch (err) {
    try {
      return SpreadsheetApp.getActiveSpreadsheet();
    } catch (err2) {
      return null;
    }
  }
}

function getMainDataSheet(ss) {
  if (!ss) return null;
  return ss.getSheetByName("Darshan Pass") ||
         ss.getSheetByName("Form Responses 1") ||
         ss.getSheetByName("Form Responses") ||
         ss.getSheets().filter(function (s) { return !s.getName().includes("Dashboard"); })[0] ||
         ss.getSheets()[0];
}

/**
 * 24-HOUR DUPLICATE SUBMISSION CHECK BEFORE INSERTION (आधार व मोबाइल नंबर चेक)
 * Scans up to 500 recent rows in the sheet.
 * If matching Aadhaar or Mobile was submitted in the last 24 hours OR has an active pending/approved status,
 * returns isDuplicate: true to prevent inserting duplicate rows.
 */
function checkDuplicateBeforeSubmission(sheet, idNumber, mobile) {
  try {
    if (!sheet) return { isDuplicate: false };
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { isDuplicate: false };

    var cleanId = String(idNumber || "").trim().toUpperCase().replace(/[\s\-]/g, '');
    var cleanMob = String(mobile || "").trim().replace(/\D/g, '');
    var mobLast10 = cleanMob.length >= 10 ? cleanMob.slice(-10) : "";

    // Ignore placeholder/generic values
    if (cleanId === "NA" || cleanId === "N/A" || cleanId === "NONE" || cleanId === "NULL" || cleanId.length < 6) {
      cleanId = "";
    }

    if (!cleanId && !mobLast10) return { isDuplicate: false };

    var nowTime = new Date().getTime();
    var oneDayMs = 24 * 60 * 60 * 1000; // 24 Hours

    var checkCount = Math.min(lastRow - 1, 500);
    var startRow = Math.max(2, lastRow - checkCount + 1);
    var data = sheet.getRange(startRow, 1, checkCount, 12).getValues();

    for (var i = data.length - 1; i >= 0; i--) {
      var row = data[i];
      var rNum = startRow + i;

      // Col 1: Timestamp
      var tsVal = row[0];
      var rowTime = parseTimestampSafe(tsVal);

      // Col 3: Pass Status (Index 2)
      var status = String(row[2] || "").trim().toLowerCase();
      // If previous entry was explicitly rejected, allow re-application
      if (status.includes("rejected") || status.includes("निरस्त") || status.includes("अस्वीकृत")) {
        continue;
      }

      // Col 9: Aadhaar / ID (Index 8)
      var rowId = String(row[8] || "").trim().toUpperCase().replace(/[\s\-]/g, '');
      // Col 11: Mobile (Index 10)
      var rowMob = String(row[10] || "").trim().replace(/\D/g, '');
      var rowMobLast10 = rowMob.length >= 10 ? rowMob.slice(-10) : "";

      var idMatch = (cleanId && rowId && cleanId === rowId);
      var mobMatch = (mobLast10 && rowMobLast10 && mobLast10 === rowMobLast10);

      if (idMatch || mobMatch) {
        // Block if submitted within the last 24 hours
        var isWithin24h = rowTime > 0 ? ((nowTime - rowTime) <= oneDayMs) : false;
        // Block if previous application is explicitly pending review, or if empty status was submitted within 24h
        var isPending = (status.includes("pending") || status.includes("लंबित") || (!status && isWithin24h));

        if (isWithin24h || isPending) {
          return {
            isDuplicate: true,
            matchedRow: rNum,
            matchedField: idMatch ? "आधार / पहचान पत्र" : "मोबाइल नंबर",
            matchedValue: idMatch ? cleanId : mobLast10,
            status: row[2] || "Pending"
          };
        }
      }
    }
    return { isDuplicate: false };
  } catch (err) {
    return { isDuplicate: false };
  }
}

// Backward compatibility alias
function checkFor24HourDuplicate(sheet, currentRowIndex, idNumber, mobile) {
  return checkDuplicateBeforeSubmission(sheet, idNumber, mobile);
}

/**
 * 🎖️ DYNAMIC REFERENCE OFFICERS MANAGEMENT
 */
var OFFICERS_SHEET_NAME = "Reference_Officers";

var DEFAULT_OFFICERS_LIST = [
  "Ref by SSP sir",
  "ADG Zone sir/ADG Zone Pro",
  "SP City Ayo",
  "SPRA Ayo",
  "SP Protocol Ayo",
  "CO Ayodhya Ayo",
  "CO City Ayo",
  "CO Bikapur Ayo",
  "CO Sadar Ayo",
  "CO Milkipur Ayo",
  "CO Rudauli Ayo",
  "CO Vigilance",
  "CO LIU Ayo",
  "CFO Ayodhya",
  "PRO SSP AYO",
  "STENO SSP Ayo",
  "ZO Intelligence",
  "DCIO IB Ayo",
  "STF Incharge Ayo",
  "Darshan Cell"
];

function getOrCreateReferenceOfficersSheet(ss) {
  if (!ss) ss = getTargetSpreadsheet();
  var sheet = ss.getSheetByName(OFFICERS_SHEET_NAME);
  var isNew = false;
  if (!sheet) {
    isNew = true;
    sheet = ss.insertSheet(OFFICERS_SHEET_NAME);
    // Header
    sheet.getRange(1, 1, 1, 2).setValues([["Officer Name / Designation", "Status"]]);
    sheet.getRange(1, 1, 1, 2).setBackground("#0F172A").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
    sheet.setRowHeight(1, 40);

    // Initial Officer List
    var rows = DEFAULT_OFFICERS_LIST.map(function(name) {
      return [name, "Active"];
    });
    sheet.getRange(2, 1, rows.length, 2).setValues(rows);
    sheet.getRange(2, 1, rows.length, 2).setHorizontalAlignment("center").setVerticalAlignment("middle").setFontFamily("Roboto");
    sheet.setColumnWidth(1, 280);
    sheet.setColumnWidth(2, 110);

    // Status Dropdown
    var statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Active", "Inactive"], true)
      .build();
    sheet.getRange(2, 2, rows.length + 50, 1).setDataValidation(statusRule);
    sheet.setFrozenRows(1);
  }

  try {
    var toastMsg = isNew 
      ? "✅ 'Reference_Officers' टैब सफलतापूर्वक बन गया है!" 
      : "ℹ️ 'Reference_Officers' टैब पहले से सक्रिय है।";
    SpreadsheetApp.getActiveSpreadsheet().toast(toastMsg, "Officers Tab Ready 🎖️", 5);
  } catch (e) {}

  return sheet;
}

function getReferenceOfficersList(ss) {
  try {
    if (!ss) ss = getTargetSpreadsheet();
    var sheet = ss.getSheetByName(OFFICERS_SHEET_NAME);
    if (!sheet) return DEFAULT_OFFICERS_LIST;

    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return DEFAULT_OFFICERS_LIST;

    var data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    var list = [];
    for (var i = 0; i < data.length; i++) {
      var name = String(data[i][0] || "").trim();
      var status = String(data[i][1] || "Active").trim().toLowerCase();
      if (name && (status === "active" || status === "")) {
        list.push(name);
      }
    }
    return list.length > 0 ? list : DEFAULT_OFFICERS_LIST;
  } catch (e) {
    return DEFAULT_OFFICERS_LIST;
  }
}

/**
 * DYNAMIC STATUS COLUMN FINDER
 * Automatically detects whether 'Pass Status' is in Column C, Column B, or elsewhere.
 * Checks: 1) Row 1 Headers for 'स्थिति'/'status', 2) Cell values in rows 2-15.
 */
function findStatusColumn(sheet) {
  var lastCol = sheet.getLastColumn() || 19;
  if (lastCol < 1) return 3;

  // 1. Check Row 1 Headers
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  for (var c = 0; c < headers.length; c++) {
    var h = String(headers[c] || '').toLowerCase().trim();
    if (h.includes("स्थिति") || h.includes("status")) {
      return c + 1; // 1-based index (e.g. 3 for Column C)
    }
  }

  // 2. Check actual values in top data rows
  var maxCheckRow = Math.min(sheet.getLastRow(), 15);
  if (maxCheckRow >= 2) {
    var sampleGrid = sheet.getRange(2, 1, maxCheckRow - 1, lastCol).getValues();
    for (var colIdx = 0; colIdx < lastCol; colIdx++) {
      for (var r = 0; r < sampleGrid.length; r++) {
        var v = String(sampleGrid[r][colIdx] || '').toLowerCase().trim();
        if (v === "pass created" || v === "pending" || v.includes("already created") || v === "rejected") {
          return colIdx + 1;
        }
      }
    }
  }

  return 3; // Default to Column C (Column 3)
}

/**
 * DYNAMIC PASS CREATED DATE COLUMN FINDER
 */
function findPassCreatedDateColumn(sheet) {
  var lastCol = sheet.getLastColumn() || 19;
  if (lastCol < 1) return -1;

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  for (var c = 0; c < headers.length; c++) {
    var h = String(headers[c] || '').toLowerCase().trim();
    if (h.includes("पास बनने") || h.includes("created date")) {
      return c + 1;
    }
  }
  return -1;
}

/**
 * DYNAMIC COLUMN FINDER BY KEYWORDS
 */
function findColumnByKeywords(sheet, keywords, defaultCol) {
  try {
    var lastCol = sheet.getLastColumn() || 19;
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    for (var c = 0; c < headers.length; c++) {
      var h = String(headers[c] || '').toLowerCase().trim();
      for (var k = 0; k < keywords.length; k++) {
        if (h.includes(keywords[k])) {
          return c + 1;
        }
      }
    }
  } catch (err) {}
  return defaultCol;
}

/**
 * PARSE GENDER COUNTS FROM TEXT (उदा: 'Male: 1, Female: 0', '2 Male, 1 Female', या '5')
 */
function parseGenderCounts(val) {
  var str = String(val || '').trim();
  if (!str) return { total: 0, male: 0, female: 0 };

  var mMatch = str.match(/male\s*[:\-=\s]*(\d+)/i) || str.match(/पुरुष\s*[:\-=\s]*(\d+)/i) || str.match(/(\d+)\s*(?:male|पुरुष|m)\b/i);
  var fMatch = str.match(/female\s*[:\-=\s]*(\d+)/i) || str.match(/महिला\s*[:\-=\s]*(\d+)/i) || str.match(/(\d+)\s*(?:female|महिला|f)\b/i);

  var m = mMatch ? parseInt(mMatch[1], 10) : null;
  var f = fMatch ? parseInt(fMatch[1], 10) : null;

  if (m === null && f === null) {
    var numMatch = str.match(/^\d+$/);
    if (numMatch) {
      var num = parseInt(numMatch[0], 10);
      return { total: num, male: num, female: 0 };
    }
    return { total: 0, male: 0, female: 0 };
  }

  m = m || 0;
  f = f || 0;
  return { total: (m + f), male: m, female: f };
}

/**
 * CONVERT COLUMN INDEX TO LETTER (e.g. 1->A, 2->B, 3->C)
 */
function getColumnLetter(colIndex) {
  var temp = "";
  var letter = "";
  while (colIndex > 0) {
    temp = (colIndex - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colIndex = Math.floor((colIndex - temp - 1) / 26);
  }
  return letter || "C";
}

/**
 * DYNAMIC CONDITIONAL FORMATTING (Works on Column B, Column C, and all rows)
 */
function setupDynamicConditionalFormatting(sheet, optStatusCol) {
  try {
    var statusCol = optStatusCol || findStatusColumn(sheet);
    var colLetter = getColumnLetter(statusCol);
    var maxFormatRows = Math.max(sheet.getMaxRows(), 1000);
    var formatRange = sheet.getRange("A2:S" + maxFormatRows);

    // Retrieve existing rules so user-defined rules are NOT erased
    var existingRules = sheet.getConditionalFormatRules() || [];
    var preservedRules = existingRules.filter(function (r) {
      try {
        var cond = r.getBooleanCondition();
        if (!cond) return true;
        var vals = cond.getCriteriaValues() || [];
        var fStr = vals.join(" ").toLowerCase();
        return fStr.indexOf("pass created") === -1 && fStr.indexOf("approved") === -1 && fStr.indexOf("बन गया") === -1;
      } catch (e) {
        return true;
      }
    });

    // Check dynamic column letter (e.g. $C2) AND fallbacks ($B2, $C2)
    var passCreatedRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=OR(ISNUMBER(SEARCH("pass created", $' + colLetter + '2)), ISNUMBER(SEARCH("approved", $' + colLetter + '2)), ISNUMBER(SEARCH("बन गया", $' + colLetter + '2)), ISNUMBER(SEARCH("pass created", $C2)), ISNUMBER(SEARCH("pass created", $B2)))')
      .setBackground("#9fc48a")
      .setFontColor("#000000")
      .setRanges([formatRange])
      .build();

    var alreadyCreatedRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=OR(ISNUMBER(SEARCH("already", $' + colLetter + '2)), ISNUMBER(SEARCH("अन्य काउंटर", $' + colLetter + '2)), ISNUMBER(SEARCH("already", $C2)), ISNUMBER(SEARCH("already", $B2)))')
      .setBackground("#fef08a")
      .setFontColor("#854d0e")
      .setRanges([formatRange])
      .build();

    var rejectedRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=OR(ISNUMBER(SEARCH("rejected", $' + colLetter + '2)), ISNUMBER(SEARCH("निरस्त", $' + colLetter + '2)), ISNUMBER(SEARCH("rejected", $C2)), ISNUMBER(SEARCH("rejected", $B2)))')
      .setBackground("#fee2e2")
      .setFontColor("#991b1b")
      .setRanges([formatRange])
      .build();

    var pendingRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=OR(ISNUMBER(SEARCH("pending", $' + colLetter + '2)), ISNUMBER(SEARCH("pending", $C2)), ISNUMBER(SEARCH("pending", $B2)))')
      .setBackground("#ffffff")
      .setFontColor("#000000")
      .setRanges([formatRange])
      .build();

    var allRules = [passCreatedRule, alreadyCreatedRule, rejectedRule, pendingRule].concat(preservedRules);
    sheet.setConditionalFormatRules(allRules);
  } catch (cfErr) {
    console.warn("Conditional formatting setup notice:", cfErr);
  }
}

/**
 * AUTOMATIC EDIT TRIGGER (onEdit) - ULTRA-FAST, DYNAMIC & DUAL-SYNC
 * 1. Highlights row in Custom Sage Green (#9fc48a) & fills Pass Created Date
 * 2. Real-time Devotee Count Calculation: If Column J, R, S, or Q is edited, all counts sync automatically
 * 3. Keeps Column M (साथ में आने वाले सदस्यों के नाम व उम्र) left-aligned
 */
function onEdit(e) {
  if (!e || !e.range) return;

  try {
    var sheet = e.range.getSheet();
    if (!sheet || sheet.getName().includes("Dashboard")) return;

    var startCol = e.range.getColumn();
    var numCols = e.range.getNumColumns();
    var endCol = startCol + numCols - 1;
    var startRow = e.range.getRow();
    var numRows = e.range.getNumRows();
    if (startRow === 1) {
      // STRICT ANTI-TAMPER GUARD: Instantly restore official standard headers
      var stdHeadersList = [
        "Timestamp",
        "पास बनने की तिथि (Pass Created Date)",
        "पास स्थिति (Pass Status)",
        "दर्शन तिथि",
        "दर्शन समय स्लॉट",
        "नाम व उम्र",
        "राज्य",
        "जिला",
        "आधार नं0/पासपोर्ट नं0",
        "पुरूषो व महिलाओं की संख्या",
        "मो0नं0",
        "गाडी नं0",
        "साथ में आने वाले सदस्यों के नाम व उम्र",
        "Referred by",
        "आवेदनकर्ता गूगल नाम",
        "आवेदनकर्ता ईमेल ID",
        "कुल दर्शनार्थी संख्या",
        "पुरुष संख्या",
        "महिला संख्या"
      ];
      for (var hc = 0; hc < numCols; hc++) {
        var hCol = startCol + hc;
        if (hCol >= 1 && hCol <= stdHeadersList.length) {
          sheet.getRange(1, hCol).setValue(stdHeadersList[hCol - 1]);
        }
      }
      try {
        SpreadsheetApp.getActiveSpreadsheet().toast("🚫 पहली रो पूर्णतः लॉक है! कोई भी बदलाव स्वीकार्य नहीं है।", "STRICT LOCK 🔒", 4);
      } catch (tErr) {}
      SpreadsheetApp.flush();
      return;
    }

    var statusCol = findStatusColumn(sheet);
    if (!statusCol || statusCol === -1) statusCol = 3; // Column 3 (C): पास स्थिति (Pass Status)
    var dateCol = findPassCreatedDateColumn(sheet);
    if (!dateCol || dateCol === -1) dateCol = 2; // Column 2 (B): पास बनने की तिथि (Pass Created Date)
    var colJ = findColumnByKeywords(sheet, ["पुरूषो व महिलाओं", "gender"], 10);
    var colM = findColumnByKeywords(sheet, ["साथ में आने वाले", "सदस्यों", "accompanying"], 13);
    var colQ = findColumnByKeywords(sheet, ["कुल दर्शनार्थी", "total"], 17);
    var colR = findColumnByKeywords(sheet, ["पुरुष संख्या", "male count"], 18);
    var colS = findColumnByKeywords(sheet, ["महिला संख्या", "female count"], 19);

    var maxCols = sheet.getMaxColumns();
    var lastCol = Math.min(Math.max(sheet.getLastColumn() || 19, 19), maxCols || 19);

    var timeZone = "GMT+5:30";
    try {
      timeZone = Session.getScriptTimeZone() || "GMT+5:30";
    } catch (tzErr) {
      timeZone = "GMT+5:30";
    }

    var isStatusCol = (startCol <= statusCol && endCol >= statusCol);
    var isGenderCol = (startCol <= colJ && endCol >= colJ);
    var isMaleCol = (startCol <= colR && endCol >= colR);
    var isFemaleCol = (startCol <= colS && endCol >= colS);
    var isTotalCol = (startCol <= colQ && endCol >= colQ);

    for (var r = 0; r < numRows; r++) {
      var currentRow = startRow + r;
      if (currentRow <= 1) continue;

      // 1. Column M (साथी विवरण): Always ensure Left-alignment for easy reading
      try {
        sheet.getRange(currentRow, colM).setHorizontalAlignment("left");
      } catch (mErr) {}

      // 2. Real-time Devotee Count Calculation & Sync
      if (isGenderCol) {
        // User manually edited Column J (पुरूषो व महिलाओं की संख्या)
        var rawJ = sheet.getRange(currentRow, colJ).getValue();
        var parsed = parseGenderCounts(rawJ);
        sheet.getRange(currentRow, colQ).setValue(parsed.total);
        sheet.getRange(currentRow, colR).setValue(parsed.male);
        sheet.getRange(currentRow, colS).setValue(parsed.female);
      } else if (isMaleCol || isFemaleCol) {
        // User manually edited Column R (पुरुष संख्या) or Column S (महिला संख्या)
        var mVal = parseInt(sheet.getRange(currentRow, colR).getValue(), 10) || 0;
        var fVal = parseInt(sheet.getRange(currentRow, colS).getValue(), 10) || 0;
        var totalVal = mVal + fVal;
        sheet.getRange(currentRow, colQ).setValue(totalVal);
        sheet.getRange(currentRow, colJ).setValue("Male: " + mVal + ", Female: " + fVal);
      } else if (isTotalCol) {
        // User manually edited Column Q (कुल दर्शनार्थी संख्या)
        var qVal = parseInt(sheet.getRange(currentRow, colQ).getValue(), 10) || 0;
        var curM = parseInt(sheet.getRange(currentRow, colR).getValue(), 10) || 0;
        var curF = parseInt(sheet.getRange(currentRow, colS).getValue(), 10) || 0;
        if (curM + curF !== qVal) {
          sheet.getRange(currentRow, colR).setValue(qVal);
          sheet.getRange(currentRow, colS).setValue(0);
          sheet.getRange(currentRow, colJ).setValue("Male: " + qVal + ", Female: 0");
        }
      }

      // 3. Status Highlight & Date Fill
      var rawVal = isStatusCol ? sheet.getRange(currentRow, statusCol).getValue() : e.range.getValue();
      var statusVal = String(rawVal || '').replace(/[\u00A0\s]+/g, ' ').trim().toLowerCase();

      var isKnownStatus = (
        statusVal.indexOf("pass created") !== -1 ||
        statusVal.indexOf("approved") !== -1 ||
        statusVal.indexOf("बन गया") !== -1 ||
        statusVal.indexOf("स्वीकृत") !== -1 ||
        statusVal.indexOf("already") !== -1 ||
        statusVal.indexOf("अन्य काउंटर") !== -1 ||
        statusVal.indexOf("rejected") !== -1 ||
        statusVal.indexOf("निरस्त") !== -1 ||
        statusVal.indexOf("pending") !== -1
      );

      if (isStatusCol || isKnownStatus) {
        var rowRange = sheet.getRange(currentRow, 1, 1, lastCol);

        if (statusVal.indexOf("pass created") !== -1 || statusVal.indexOf("approved") !== -1 || statusVal.indexOf("बन गया") !== -1 || statusVal.indexOf("स्वीकृत") !== -1) {
          rowRange.setBackground("#9fc48a");
          rowRange.setFontColor("#000000");

          if (dateCol !== -1) {
            try {
              var dateCell = sheet.getRange(currentRow, dateCol);
              if (!dateCell.getValue()) {
                try {
                  if (dateCell.getDataValidation()) {
                    dateCell.clearDataValidations();
                  }
                } catch (dvClrErr) {}
                dateCell.setValue(Utilities.formatDate(new Date(), timeZone, "dd/MM/yyyy"));
              }
            } catch (dErr) {
              console.warn("Date autofill notice:", dErr);
            }
          }

        } else if (statusVal.indexOf("already") !== -1 || statusVal.indexOf("अन्य काउंटर") !== -1) {
          rowRange.setBackground("#fef08a");
          rowRange.setFontColor("#854d0e");

          if (dateCol !== -1) {
            try {
              var dateCell = sheet.getRange(currentRow, dateCol);
              if (!dateCell.getValue()) {
                try {
                  if (dateCell.getDataValidation()) {
                    dateCell.clearDataValidations();
                  }
                } catch (dvClrErr2) {}
                dateCell.setValue(Utilities.formatDate(new Date(), timeZone, "dd/MM/yyyy"));
              }
            } catch (dErr2) {}
          }

        } else if (statusVal.indexOf("rejected") !== -1 || statusVal.indexOf("निरस्त") !== -1 || statusVal.indexOf("अस्वीकृत") !== -1) {
          rowRange.setBackground("#fee2e2");
          rowRange.setFontColor("#991b1b");

        } else if (statusVal.indexOf("pending") !== -1 || !statusVal) {
          rowRange.setBackground("#ffffff");
          rowRange.setFontColor("#000000");
        }
      }
    }

    SpreadsheetApp.flush(); // Commit updates immediately to sheet UI
  } catch (err) {
    console.error("onEdit error:", err);
  }
}

/**
 * BATCH SYNC DEVOTEE COUNTS & LEFT-ALIGN COLUMN M (सभी पंक्तियों में संख्या सिंक व कॉलम M लेफ्ट करें)
 * Parses Column J (पुरूषो व महिलाओं की संख्या) and synchronizes Column Q (कुल), R (पुरुष), S (महिला).
 * Also left-aligns Column M (साथ में आने वाले सदस्यों के नाम व उम्र) across all rows.
 */
function syncAllDevoteeCounts(optSheet, bypassAuth) {
  if (!bypassAuth && !isAuthorizedAdmin()) {
    try {
      SpreadsheetApp.getUi().alert("⛔ अनधिकृत पहुंच (Unauthorized Access)!\n\nकेवल मुख्य एडमिन (smartcellayd@gmail.com) ही इन VIP टूल्स को चलाने के लिए अधिकृत हैं।");
    } catch (e) {}
    return;
  }

  var ss = getTargetSpreadsheet();
  var sheet = optSheet || getMainDataSheet(ss);
  if (!sheet) return;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  var numDataRows = lastRow - 1;
  var colJ = findColumnByKeywords(sheet, ["पुरूषो व महिलाओं", "gender"], 10);
  var colM = findColumnByKeywords(sheet, ["साथ में आने वाले", "सदस्यों", "accompanying"], 13);
  var colQ = findColumnByKeywords(sheet, ["कुल दर्शनार्थी", "total"], 17);
  var colR = findColumnByKeywords(sheet, ["पुरुष संख्या", "male count"], 18);
  var colS = findColumnByKeywords(sheet, ["महिला संख्या", "female count"], 19);

  var jVals = sheet.getRange(2, colJ, numDataRows, 1).getValues();
  var qVals = sheet.getRange(2, colQ, numDataRows, 1).getValues();
  var rVals = sheet.getRange(2, colR, numDataRows, 1).getValues();
  var sVals = sheet.getRange(2, colS, numDataRows, 1).getValues();

  var needUpdate = false;

  for (var i = 0; i < numDataRows; i++) {
    var rawJ = String(jVals[i][0] || '').trim();
    var curQ = parseInt(qVals[i][0], 10) || 0;
    var curR = parseInt(rVals[i][0], 10) || 0;
    var curS = parseInt(sVals[i][0], 10) || 0;

    if (rawJ) {
      var parsed = parseGenderCounts(rawJ);
      if (parsed.total !== curQ || parsed.male !== curR || parsed.female !== curS) {
        qVals[i][0] = parsed.total;
        rVals[i][0] = parsed.male;
        sVals[i][0] = parsed.female;
        needUpdate = true;
      }
    } else if (curR > 0 || curS > 0) {
      var calcTotal = curR + curS;
      if (curQ !== calcTotal) {
        qVals[i][0] = calcTotal;
        needUpdate = true;
      }
      jVals[i][0] = "Male: " + curR + ", Female: " + curS;
      sheet.getRange(i + 2, colJ).setValue(jVals[i][0]);
    }
  }

  if (needUpdate) {
    sheet.getRange(2, colQ, numDataRows, 1).setValues(qVals);
    sheet.getRange(2, colR, numDataRows, 1).setValues(rVals);
    sheet.getRange(2, colS, numDataRows, 1).setValues(sVals);
  }

  // Left-align Column M (साथ में आने वाले सदस्यों के नाम व उम्र) across entire data range
  try {
    sheet.getRange(2, colM, numDataRows, 1).setHorizontalAlignment("left");
  } catch (alignErr) {
    console.warn("Column M alignment notice:", alignErr);
  }

  SpreadsheetApp.flush();
}

/**
 * UNLOCK ROW 1 HEADERS (पहली रो से लॉक हटाएं)
 * Removes strict data validation reject rules and range protections on Row 1.
 */
function unlockRow1Headers(optSheet) {
  if (!isAuthorizedAdmin()) {
    try {
      SpreadsheetApp.getUi().alert("⛔ अनधिकृत पहुंच (Unauthorized Access)!\n\nकेवल मुख्य एडमिन (smartcellayd@gmail.com) ही इन VIP टूल्स को चलाने के लिए अधिकृत हैं।");
    } catch (e) {}
    return { success: false, message: "Unauthorized" };
  }

  var ss = getTargetSpreadsheet();
  var sheet = optSheet || getMainDataSheet(ss);
  if (!sheet) return { success: false, message: "Sheet not found" };

  try {
    var maxCols = Math.max(sheet.getLastColumn() || 19, sheet.getMaxColumns() || 19);
    var headerRange = sheet.getRange(1, 1, 1, maxCols);

    // 1. Remove all reject data validations on Row 1
    try {
      headerRange.clearDataValidations();
    } catch (dvErr) {}

    // 2. Remove all range protections on Row 1
    var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    var removedCount = 0;
    for (var i = 0; i < protections.length; i++) {
      var p = protections[i];
      var r = p.getRange();
      if (r && r.getRow() === 1) {
        p.remove();
        removedCount++;
      }
    }

    try {
      SpreadsheetApp.getActiveSpreadsheet().toast("🔓 पहली रो का लॉक सफलतापूर्वक हटा दिया गया है!", "Row 1 Unlocked", 5);
    } catch (tErr) {}

    SpreadsheetApp.flush();
    return {
      success: true,
      removed: removedCount,
      message: "Row 1 successfully unlocked!"
    };
  } catch (err) {
    console.warn("Unlock notice:", err);
    return {
      success: false,
      error: err.toString()
    };
  }
}

/**
 * 100% STRICT LOCK ROW 1 (पहली हेडिंग रो को पूरी तरह सील/लॉक करें - न टाइप होगा, न बदलेगा)
 * 1. Freezes Row 1 so it stays permanently pinned at the top
 * 2. Writes the 19 standard headers cleanly
 * 3. Applies Strict Data Validation Reject (=FALSE, AllowInvalid: false) so Google Sheets REJECTS any keystroke/typing!
 * 4. Applies Strict Range Protection removing all editors
 */
function lockAndProtectHeaderRow(optSheet) {
  if (!isAuthorizedAdmin()) {
    try {
      SpreadsheetApp.getUi().alert("⛔ अनधिकृत पहुंच (Unauthorized Access)!\n\nकेवल मुख्य एडमिन (smartcellayd@gmail.com) ही इन VIP टूल्स को चलाने के लिए अधिकृत हैं।");
    } catch (e) {}
    return { success: false, message: "Unauthorized" };
  }

  var ss = getTargetSpreadsheet();
  var sheet = optSheet || getMainDataSheet(ss);
  if (!sheet) return { success: false, message: "Sheet not found" };

  var standardHeadersList = [
    "Timestamp",
    "पास बनने की तिथि (Pass Created Date)",
    "पास स्थिति (Pass Status)",
    "दर्शन तिथि",
    "दर्शन समय स्लॉट",
    "नाम व उम्र",
    "राज्य",
    "जिला",
    "आधार नं0/पासपोर्ट नं0",
    "पुरूषो व महिलाओं की संख्या",
    "मो0नं0",
    "गाडी नं0",
    "साथ में आने वाले सदस्यों के नाम व उम्र",
    "Referred by",
    "आवेदनकर्ता गूगल नाम",
    "आवेदनकर्ता ईमेल ID",
    "कुल दर्शनार्थी संख्या",
    "पुरुष संख्या",
    "महिला संख्या"
  ];

  try {
    // 1. Freeze Row 1 only and strictly UNFREEZE Column B / any columns
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(0);

    var maxCols = Math.max(sheet.getLastColumn() || 19, sheet.getMaxColumns() || 19);
    var headerRange = sheet.getRange(1, 1, 1, maxCols);

    // 2. Clear old protections & validations on Row 1
    try {
      headerRange.clearDataValidations();
    } catch (dvErr) {}

    var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    for (var i = 0; i < protections.length; i++) {
      var p = protections[i];
      var r = p.getRange();
      if (r && r.getRow() === 1) {
        p.remove();
      }
    }

    // 3. Ensure official standard headers are written correctly
    sheet.getRange(1, 1, 1, standardHeadersList.length).setValues([standardHeadersList]);

    // 4. LAYER 1: STRICT DATA VALIDATION HARD REJECT (Any typing is immediately rejected by Google Sheets!)
    var strictRejectRule = SpreadsheetApp.newDataValidation()
      .requireFormulaSatisfied('=FALSE')
      .setAllowInvalid(false)
      .setHelpText("🚫 पहली रो (हेडर्स) पूर्णतः लॉक है! इसमें किसी भी प्रकार का टाइपिंग या बदलाव पूर्णतः प्रतिबंधित है।")
      .build();
    headerRange.setDataValidation(strictRejectRule);

    // 5. LAYER 2: STRICT RANGE PROTECTION (Blocks editors from editing)
    try {
      var protection = headerRange.protect().setDescription("🔒 STRICT 100% LOCKED HEADERS (Do Not Edit)");
      var me = Session.getEffectiveUser();
      protection.addEditor(me);
      protection.removeEditors(protection.getEditors());
      if (protection.canDomainEdit()) {
        protection.setDomainEdit(false);
      }
    } catch (permErr) {
      console.warn("Range protection notice:", permErr);
    }

    try {
      SpreadsheetApp.getActiveSpreadsheet().toast("🔒 पहली रो 100% स्ट्रिक्ट लॉक हो चुकी है! अब इसमें कोई बदलाव संभव नहीं है।", "Strict Lock Active 🔒", 6);
    } catch (tErr) {}

    SpreadsheetApp.flush();
    return {
      success: true,
      message: "Row 1 is now 100% strictly locked!"
    };
  } catch (err) {
    console.warn("Strict lock error:", err);
    return {
      success: false,
      error: err.toString()
    };
  }
}

/**
 * INSTANT ROW COLOR RE-APPLY (सभी पंक्तियों में स्थिति अनुसार रंग भरें)
 * 1. Syncs all Devotee Counts & Left-aligns Column M
 * 2. Highlights row in Custom Sage Green (#9fc48a) for Pass Created
 * 3. Applies sheet-wide dynamic conditional formatting
 * 4. Permanently locks and protects Row 1 headers
 */
function refreshAllRowColors(optSheet) {
  if (!isAuthorizedAdmin()) {
    try {
      SpreadsheetApp.getUi().alert("⛔ अनधिकृत पहुंच (Unauthorized Access)!\n\nकेवल मुख्य एडमिन (smartcellayd@gmail.com) ही इन VIP टूल्स को चलाने के लिए अधिकृत हैं।");
    } catch (e) {}
    return;
  }

  var ss = getTargetSpreadsheet();
  var sheet = optSheet || getMainDataSheet(ss);
  if (!sheet) return;

  var lastRow = sheet.getLastRow();
  var maxCols = sheet.getMaxColumns();
  var lastCol = Math.min(Math.max(sheet.getLastColumn() || 19, 19), maxCols || 19);
  if (lastRow < 2) return;

  // 1. Sync Devotee Counts & Left-align Column M (bypassAuth=true since already verified)
  try {
    syncAllDevoteeCounts(sheet, true);
  } catch (syncErr) {
    console.warn("Devotee sync notice:", syncErr);
  }

  var statusCol = findStatusColumn(sheet);
  if (!statusCol || statusCol === -1) statusCol = 3; // Column 3 (C): पास स्थिति (Pass Status)
  var dateCol = findPassCreatedDateColumn(sheet);
  if (!dateCol || dateCol === -1) dateCol = 2; // Column 2 (B): पास बनने की तिथि (Pass Created Date)
  var numDataRows = lastRow - 1;

  // Read status values directly from detected status column
  var statusVals = sheet.getRange(2, statusCol, numDataRows, 1).getValues();
  var dateVals = (dateCol > 0 && dateCol <= lastCol) ? sheet.getRange(2, dateCol, numDataRows, 1).getValues() : null;
  var backgrounds = sheet.getRange(2, 1, numDataRows, lastCol).getBackgrounds();
  var fontColors = sheet.getRange(2, 1, numDataRows, lastCol).getFontColors();
  var dateUpdated = false;

  var scriptTz = "GMT+5:30";
  try { scriptTz = Session.getScriptTimeZone() || "GMT+5:30"; } catch (e) {}

  for (var i = 0; i < numDataRows; i++) {
    var raw = String(statusVals[i][0] || '').replace(/[\u00A0\s]+/g, ' ').trim().toLowerCase();
    var bg = "#ffffff";
    var fc = "#000000";

    if (raw.indexOf("pass created") !== -1 || raw.indexOf("approved") !== -1 || raw.indexOf("बन गया") !== -1 || raw.indexOf("स्वीकृत") !== -1) {
      bg = "#9fc48a"; // Sage Green
      fc = "#000000";

      // Auto-fill Pass Created Date in Column B if empty
      if (dateVals && !dateVals[i][0]) {
        var rowTs = sheet.getRange(i + 2, 1).getValue();
        dateVals[i][0] = formatSheetDateToDDMMYYYY(rowTs) || Utilities.formatDate(new Date(), scriptTz, "dd/MM/yyyy");
        dateUpdated = true;
      }
    } else if (raw.indexOf("already") !== -1 || raw.indexOf("अन्य काउंटर") !== -1) {
      bg = "#fef08a"; // Amber Yellow
      fc = "#854d0e";

      if (dateVals && !dateVals[i][0]) {
        var rowTs2 = sheet.getRange(i + 2, 1).getValue();
        dateVals[i][0] = formatSheetDateToDDMMYYYY(rowTs2) || Utilities.formatDate(new Date(), scriptTz, "dd/MM/yyyy");
        dateUpdated = true;
      }
    } else if (raw.indexOf("rejected") !== -1 || raw.indexOf("निरस्त") !== -1 || raw.indexOf("अस्वीकृत") !== -1) {
      bg = "#fee2e2"; // Red
      fc = "#991b1b";
    } else if (raw.indexOf("pending") !== -1 || raw === "") {
      bg = "#ffffff";
      fc = "#000000";
    }

    for (var c = 0; c < lastCol; c++) {
      backgrounds[i][c] = bg;
      fontColors[i][c] = fc;
    }
  }

  if (dateUpdated && dateVals) {
    try {
      if (dateCol > 0) {
        sheet.getRange(2, dateCol, numDataRows, 1).clearDataValidations();
      }
    } catch (cdvErr) {}
    sheet.getRange(2, dateCol, numDataRows, 1).setValues(dateVals);
  }

  sheet.getRange(2, 1, numDataRows, lastCol).setBackgrounds(backgrounds);
  sheet.getRange(2, 1, numDataRows, lastCol).setFontColors(fontColors);

  // Also sync dynamic conditional formatting across entire sheet
  setupDynamicConditionalFormatting(sheet, statusCol);

  // 4. Ensure Row 1 is pinned at top and Columns are strictly UNFROZEN
  try {
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(0);
  } catch (fzErr) {}

  SpreadsheetApp.flush();
}

/**
 * AUTOMATIC CUSTOM MENU IN GOOGLE SHEETS
 * Adds a "⚙️ VIP Tools" menu to Google Sheet top bar ONLY when opened by an authorized admin.
 */
function onOpen() {
  try {
    // 1. ALWAYS UNFREEZE COLUMN B / ALL COLUMNS ON OPEN (Row 1 stays frozen)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) {
      var allSheets = ss.getSheets();
      for (var s = 0; s < allSheets.length; s++) {
        try {
          allSheets[s].setFrozenColumns(0);
        } catch (fErr) {}
      }
    }
  } catch (openErr) {}

  try {
    // 🔐 SECURITY GUARD: Only create VIP Tools menu for authorized admin (smartcellayd@gmail.com)
    if (!isAuthorizedAdmin()) {
      return; // Do NOT show VIP menu to unauthorized editors/viewers!
    }

    var ui = SpreadsheetApp.getUi();
    ui.createMenu('⚙️ VIP Tools')
      .addItem('🛠️ 1-Click All-in-One Sheet Repair (मास्टर रिपेयर - कॉलम व क्रम ठीक करें)', 'fixAndRealignAllSheetColumns')
      .addItem('🎨 Re-apply Status Colors (स्टेटस अनुसार सभी पंक्तियों में रंग भरें)', 'refreshAllRowColors')
      .addItem('🔄 Sync Devotee Counts & Left-Align M (संख्या सिंक व कॉलम M लेफ्ट करें)', 'syncAllDevoteeCounts')
      .addItem('🛡️ Restore Pass Status Dropdowns (कॉलम C ड्रॉपडाउन रीस्टोर करें)', 'restoreStatusDropdowns')
      .addSeparator()
      .addItem('🎖️ Setup Reference Officers Tab (रेफरेंस अधिकारी टैब बनाएं / लोड करें)', 'getOrCreateReferenceOfficersSheet')
      .addItem('📊 Generate VIP Dashboard (डैशबोर्ड व दैनिक रिपोर्ट बनाएं)', 'setupVipDashboard')
      .addSeparator()
      .addItem('🔒 Safe-Lock Row 1 (पहली हेडिंग रो को लॉक व सुरक्षित करें)', 'lockAndProtectHeaderRow')
      .addItem('🔓 Unlock Row 1 Headers (कठोर लॉक हटाएं / अनलॉक करें)', 'unlockRow1Headers')
      .addToUi();
  } catch (err) {
    console.warn("onOpen UI creation warning:", err);
  }
}

/**
 * 🔧 1-CLICK FIX: UNFREEZE COLUMN B & FIX CELL B3 DROPDOWN ERROR
 * 1. Strictly unfreezes Column B (setFrozenColumns(0))
 * 2. Removes any dropdown/validation from Column B (Pass Created Date)
 * 3. Detects if Column B and Column C data are inverted (Status in B and Date in C) and swaps them
 * 4. Puts Dropdown validation ONLY on Column C (Pass Status)
 * 5. Pinned/Freezes only Row 1
 */
function repairColumnsAndUnfreeze(optSheet) {
  if (!isAuthorizedAdmin()) {
    try {
      SpreadsheetApp.getUi().alert("⛔ अनधिकृत पहुंच (Unauthorized Access)!\n\nकेवल मुख्य एडमिन (smartcellayd@gmail.com) ही इन VIP टूल्स को चलाने के लिए अधिकृत हैं।");
    } catch (e) {}
    return { success: false, message: "Unauthorized" };
  }

  var ss = getTargetSpreadsheet();
  var sheet = optSheet || getMainDataSheet(ss);
  if (!sheet) return;

  // 1. UNFREEZE COLUMN B (All columns strictly unfrozen!)
  try {
    sheet.setFrozenColumns(0);
    sheet.setFrozenRows(1);
  } catch (fzErr) {}

  var maxRows = Math.max(sheet.getLastRow(), sheet.getMaxRows(), 50);
  var numDataRows = sheet.getLastRow() - 1;

  // 2. Clear any conflicting validation rules on Column B (Col B = Date, never Status!)
  try {
    sheet.getRange(2, 2, maxRows - 1, 1).clearDataValidations();
    sheet.getRange(2, 2, maxRows - 1, 1).setNumberFormat("@");
  } catch (bValErr) {
    console.warn("Clear Col B validation notice:", bValErr);
  }

  // 3. Detect if data in Column B and Column C is reversed (e.g. B has 'Pass Created' and C has Date)
  if (numDataRows > 0) {
    var bVals = sheet.getRange(2, 2, numDataRows, 1).getValues();
    var cVals = sheet.getRange(2, 3, numDataRows, 1).getValues();
    var needsSwap = false;

    for (var i = 0; i < numDataRows; i++) {
      var bStr = String(bVals[i][0] || '').trim().toLowerCase();
      var cStr = String(cVals[i][0] || '').trim();

      // If cell B contains status text like 'pass created', 'pending', etc.
      var bIsStatus = bStr.includes("pass created") || bStr.includes("pending") || bStr.includes("rejected") || bStr.includes("already") || bStr.includes("approved");
      var cIsDate = /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(cStr) || cVals[i][0] instanceof Date;

      if (bIsStatus) {
        // Swap so Col B gets Date and Col C gets Status!
        var dateVal = cIsDate ? cVals[i][0] : "";
        var statusVal = bVals[i][0] || "Pass Created";

        bVals[i][0] = dateVal;
        cVals[i][0] = statusVal;
        needsSwap = true;
      }
    }

    if (needsSwap) {
      sheet.getRange(2, 2, numDataRows, 1).setValues(bVals);
      sheet.getRange(2, 3, numDataRows, 1).setValues(cVals);
    }
  }

  // 4. Set Dropdown Validation strictly on Column C (Pass Status)
  var statusRange = sheet.getRange(2, 3, maxRows - 1, 1);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Pending", "Pass Created", "Already Created (अन्य काउंटर से)", "Rejected"], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(rule);

  // 5. Ensure Row 1 Headers are strictly correct
  sheet.getRange(1, 2).setValue("पास बनने की तिथि (Pass Created Date)");
  sheet.getRange(1, 3).setValue("पास स्थिति (Pass Status)");

  // 6. Refresh Row Colors
  try {
    refreshAllRowColors(sheet);
  } catch (rErr) {}

  try {
    SpreadsheetApp.getActiveSpreadsheet().toast("✅ कॉलम B अनफ्रीज हो गया, सेल B3 का एरर ठीक हुआ, और ड्रॉपडाउन कॉलम C में सेट हो गया!", "All Fixed 🎯", 6);
  } catch (tErr) {}
}

/**
 * RESTORE PASS STATUS DROPDOWNS ON COLUMN C (कॉलम C ड्रॉपडाउन सुरक्षित रीस्टोर करें)
 * Re-applies the dropdown list to Column C (Pass Status) for all data rows without touching any other validations or data.
 */
function restoreStatusDropdowns(optSheet) {
  if (!isAuthorizedAdmin()) {
    try {
      SpreadsheetApp.getUi().alert("⛔ अनधिकृत पहुंच (Unauthorized Access)!\n\nकेवल मुख्य एडमिन (smartcellayd@gmail.com) ही इन VIP टूल्स को चलाने के लिए अधिकृत हैं।");
    } catch (e) {}
    return;
  }

  var ss = getTargetSpreadsheet();
  var sheet = optSheet || getMainDataSheet(ss);
  if (!sheet) return;

  var maxRows = Math.max(sheet.getMaxRows(), 1000);
  var statusCol = findStatusColumn(sheet) || 3;

  var statusRange = sheet.getRange(2, statusCol, maxRows - 1, 1);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Pending", "Pass Created", "Already Created (अन्य काउंटर से)", "Rejected"], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(rule);

  try {
    SpreadsheetApp.getActiveSpreadsheet().toast("🛡️ कॉलम C (Pass Status) के सभी ड्रॉपडाउन रूल्स सफलतापूर्वक रीस्टोर कर दिए गए हैं!", "Dropdowns Restored", 5);
  } catch (e) {}
}

/**
 * 1-CLICK COLUMN REPAIR & DATA REALIGNMENT
 * Automatically unhides hidden columns, detects shifted cells (e.g. +2 column shift),
 * realigns all data under the proper 19 headers, preserves existing pass statuses,
 * deletes duplicate/empty shift columns, sets dropdowns & sage green highlighting.
 */
function fixAndRealignAllSheetColumns() {
  if (!isAuthorizedAdmin()) {
    try {
      SpreadsheetApp.getUi().alert("⛔ अनधिकृत पहुंच (Unauthorized Access)!\n\nकेवल मुख्य एडमिन (smartcellayd@gmail.com) ही इन VIP टूल्स को चलाने के लिए अधिकृत हैं।");
    } catch (e) {}
    return { success: false, message: "Unauthorized" };
  }

  var ss = getTargetSpreadsheet();
  if (!ss) {
    throw new Error("Spreadsheet could not be opened. Check ID or active sheet permissions.");
  }

  var sheets = ss.getSheets();
  var fixedSheetsCount = 0;
  var totalRowsRepaired = 0;

  var standardHeaders = [
    "Timestamp",
    "पास बनने की तिथि (Pass Created Date)",
    "पास स्थिति (Pass Status)",
    "दर्शन तिथि",
    "दर्शन समय स्लॉट",
    "नाम व उम्र",
    "राज्य",
    "जिला",
    "आधार नं0/पासपोर्ट नं0",
    "पुरूषो व महिलाओं की संख्या",
    "मो0नं0",
    "गाडी नं0",
    "साथ में आने वाले सदस्यों के नाम व उम्र",
    "Referred by",
    "आवेदनकर्ता गूगल नाम",
    "आवेदनकर्ता ईमेल ID",
    "कुल दर्शनार्थी संख्या",
    "पुरुष संख्या",
    "महिला संख्या"
  ];

  function isStatusVal(v) {
    if (!v) return false;
    var s = String(v).trim().toLowerCase();
    return s.includes("pending") || s.includes("pass created") || s.includes("already") || s.includes("अन्य काउंटर") || s.includes("rejected") || s.includes("approved");
  }

  function isDatePattern(v) {
    if (!v) return false;
    if (v instanceof Date) return true;
    var s = String(v).trim();
    return /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(s) || /^\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/.test(s);
  }

  function isSlotPattern(v) {
    if (!v) return false;
    var s = String(v).toUpperCase().trim();
    return (s.includes("AM") || s.includes("PM") || s.includes("SLOT") || s.includes("स्लॉट")) &&
           /\d{1,2}[:.]\d{2}/.test(s);
  }

  function formatDateVal(v) {
    if (!v) return "";
    if (v instanceof Date) {
      return Utilities.formatDate(v, Session.getScriptTimeZone() || "GMT+5:30", "dd/MM/yyyy");
    }
    var s = String(v).trim();
    if (!isDatePattern(s)) return "";
    if (s.includes("-")) {
      var parts = s.split("-");
      if (parts.length === 3 && parts[0].length === 4) {
        return parts[2] + "/" + parts[1] + "/" + parts[0];
      }
    }
    return s;
  }

  function cleanStatusVal(s) {
    if (!s) return "Pending";
    var str = String(s).trim();
    var low = str.toLowerCase();
    if (low.includes("pass created") || low === "approved") return "Pass Created";
    if (low.includes("already") || low.includes("अन्य काउंटर")) return "Already Created (अन्य काउंटर से)";
    if (low.includes("rejected")) return "Rejected";
    return "Pending";
  }

  sheets.forEach(function (sheet) {
    if (!sheet || sheet.getName().includes("Dashboard")) return;

    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow < 1) return;

    // 1. Strictly unfreeze Column B and all columns
    try {
      sheet.setFrozenColumns(0);
    } catch (e) {}

    // 2. Read entire existing data grid
    var readCols = Math.max(lastCol, 25);
    var allData = sheet.getRange(1, 1, lastRow, readCols).getValues();
    if (!allData || allData.length === 0) return;

    var cleanedRows = [];

    for (var r = 1; r < allData.length; r++) {
      var row = allData[r];
      // Skip empty blank rows
      var hasData = row.some(function (cell) { return cell !== "" && cell !== null && cell !== undefined; });
      if (!hasData) continue;

      var timestamp = row[0] || "";
      var createdDate = "";
      var status = "Pending";
      var visitDate = "";
      var visitSlot = "";
      var nameAge = "";
      var state = "";
      var district = "";
      var idNumber = "";
      var genderCounts = "";
      var mobile = "";
      var vehicleNo = "";
      var accompanying = "";
      var referredBy = "";
      var submitterName = "";
      var submitterEmail = "";
      var totalDevotees = 0;
      var maleCount = 0;
      var femaleCount = 0;

      // DYNAMIC SLOT ANCHOR: Locate where Visit Time Slot resides in the row
      var slotIdx = -1;
      for (var c = 1; c < row.length; c++) {
        if (isSlotPattern(row[c])) {
          slotIdx = c;
          break;
        }
      }

      if (slotIdx !== -1) {
        visitSlot = String(row[slotIdx]).trim();

        // 1. Look for Visit Date before slotIdx
        for (var b = slotIdx - 1; b >= 1; b--) {
          if (isDatePattern(row[b])) {
            visitDate = formatDateVal(row[b]);
            break;
          }
        }
        // If no explicit visit date found before slot, use date from timestamp
        if (!visitDate && timestamp) {
          visitDate = formatDateVal(timestamp);
        }

        // 2. Devotee details always follow the slot sequentially
        nameAge = String(row[slotIdx + 1] || '').trim();
        state = String(row[slotIdx + 2] || '').trim();
        district = String(row[slotIdx + 3] || '').trim();
        idNumber = String(row[slotIdx + 4] || '').trim();
        genderCounts = String(row[slotIdx + 5] || '').trim();
        mobile = String(row[slotIdx + 6] || '').trim();
        vehicleNo = String(row[slotIdx + 7] || '').trim();
        accompanying = String(row[slotIdx + 8] || '').trim();
        referredBy = String(row[slotIdx + 9] || '').trim();
        submitterName = String(row[slotIdx + 10] || '').trim();
        submitterEmail = String(row[slotIdx + 11] || '').trim();
        totalDevotees = row[slotIdx + 12] || '';
        maleCount = row[slotIdx + 13] || '';
        femaleCount = row[slotIdx + 14] || '';

        // 3. Extract Status and Created Date from cells before the slot
        for (var sIdx = 1; sIdx < slotIdx; sIdx++) {
          var val = row[sIdx];
          if (isStatusVal(val)) {
            status = cleanStatusVal(val);
          } else if (isDatePattern(val) && formatDateVal(val) !== visitDate) {
            createdDate = formatDateVal(val);
          }
        }

      } else {
        // Fallback: If no slot string found, check standard 19-column layout
        // Col A (0): Timestamp
        // Col B (1): Pass Created Date
        // Col C (2): Pass Status
        createdDate = formatDateVal(row[1] || "");
        status = isStatusVal(row[2]) ? cleanStatusVal(row[2]) : "Pending";
        visitDate = formatDateVal(row[3] || "");
        visitSlot = String(row[4] || "").trim();
        nameAge = String(row[5] || "").trim();
        state = String(row[6] || "").trim();
        district = String(row[7] || "").trim();
        idNumber = String(row[8] || "").trim();
        genderCounts = String(row[9] || "").trim();
        mobile = String(row[10] || "").trim();
        vehicleNo = String(row[11] || "").trim();
        accompanying = String(row[12] || "").trim();
        referredBy = String(row[13] || "").trim();
        submitterName = String(row[14] || "").trim();
        submitterEmail = String(row[15] || "").trim();
        totalDevotees = row[16] || "";
        maleCount = row[17] || "";
        femaleCount = row[18] || "";
      }

      // Filter ghost rows that have no name, no visit date, and no mobile
      var cleanMob = String(mobile || '').replace(/\D/g, '');
      var isGenuineRow = (nameAge && nameAge.trim().length > 1) || 
                         (visitDate && String(visitDate).trim().length > 5) || 
                         (cleanMob.length >= 8);
      if (!isGenuineRow) {
        continue;
      }

      // If status is Pass Created and createdDate is empty, fill with row's timestamp date or today
      if (status === "Pass Created" && !createdDate) {
        createdDate = formatDateVal(timestamp) || Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "GMT+5:30", "dd/MM/yyyy");
      }

      cleanedRows.push([
        timestamp,
        createdDate,
        status,
        visitDate,
        visitSlot,
        nameAge,
        state,
        district,
        idNumber,
        genderCounts,
        mobile,
        vehicleNo,
        accompanying,
        referredBy,
        submitterName,
        submitterEmail,
        totalDevotees,
        maleCount,
        femaleCount
      ]);
    }

    // Safety Check: If no rows with data were found, do not overwrite anything!
    if (cleanedRows.length === 0) {
      console.warn("No data rows found in sheet: " + sheet.getName());
      return;
    }

    // 3. Reset backgrounds and font colors (DO NOT wipe data validations!)
    var maxR = sheet.getMaxRows();
    var maxC = sheet.getMaxColumns();
    if (maxR > 1) {
      var allDataRange = sheet.getRange(2, 1, maxR - 1, maxC);
      allDataRange.setBackground(null);
      allDataRange.setFontColor(null);
      // NOTE: We do NOT call clearDataValidations() so all existing validation rules remain preserved!
    }

    // 4. Write standard Row 1 Headers
    sheet.getRange(1, 1, 1, standardHeaders.length).setValues([standardHeaders]);

    // 5. Write realigned clean data rows directly
    sheet.getRange(2, 1, cleanedRows.length, standardHeaders.length).setValues(cleanedRows);
    totalRowsRepaired += cleanedRows.length;

    // 6. Clear any leftover text from old rows below the genuine data
    if (maxR > cleanedRows.length + 1) {
      var trailingRange = sheet.getRange(cleanedRows.length + 2, 1, maxR - (cleanedRows.length + 1), maxC);
      trailingRange.clearContent();
    }

    // 7. Delete extra columns beyond Column 19
    if (sheet.getMaxColumns() > 19) {
      try {
        sheet.deleteColumns(20, sheet.getMaxColumns() - 19);
      } catch (colDelErr) {
        console.warn("Column trimming notice:", colDelErr);
      }
    }

    // 8. Delete excess empty rows below genuine data (keep only 5 clean blank rows)
    if (sheet.getMaxRows() > cleanedRows.length + 5) {
      try {
        sheet.deleteRows(cleanedRows.length + 6, sheet.getMaxRows() - (cleanedRows.length + 5));
      } catch (delRowErr) {
        console.warn("Row trimming notice:", delRowErr);
      }
    }

    // 9. Styling: Row 1 Header Banner (Navy Blue)
    var headerRange = sheet.getRange(1, 1, 1, 19);
    headerRange.setBackground("#1e3a8a"); // Navy Blue
    headerRange.setFontColor("#ffffff"); // White
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(11);
    sheet.setRowHeight(1, 45);

    // 10. Grid Formatting for Data Rows
    var totalRows = Math.max(sheet.getLastRow(), 50);
    var dataRange = sheet.getRange(1, 1, totalRows, 19);
    dataRange.setHorizontalAlignment("center");
    dataRange.setVerticalAlignment("middle");
    dataRange.setWrap(true);
    dataRange.setFontFamily("Roboto");

    // Column M (Col 13 - Accompanying Devotees): Left-align for superior readability
    if (totalRows > 1) {
      sheet.getRange(2, 13, totalRows - 1, 1).setHorizontalAlignment("left");
    }

    // Format Timestamp Column A
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");
    }

    // 11. Dropdown Validation on Column C (Pass Status - Column 3)
    var statusRowsCount = Math.max(cleanedRows.length + 5, 50);
    var statusRange = sheet.getRange(2, 3, statusRowsCount, 1);
    var statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending", "Pass Created", "Already Created (अन्य काउंटर से)", "Rejected"], true)
      .setAllowInvalid(false)
      .build();
    statusRange.setDataValidation(statusRule);

    // 12. Apply Batch Colors to All Data Rows directly
    try {
      refreshAllRowColors(sheet);
    } catch (colErr) {
      console.warn("Direct row coloring notice:", colErr);
    }

    // 13. Dynamic Sheet-Wide Conditional Formatting (Resilient SEARCH on Column C, B, etc.)
    setupDynamicConditionalFormatting(sheet);

    // 13. Column Widths
    var colWidths = [
      150, // 1. Timestamp (A)
      165, // 2. Pass Created Date (B)
      165, // 3. Pass Status (C)
      130, // 4. Visit Date (D)
      170, // 5. Visit Time Slot (E)
      160, // 6. Name Age (F)
      130, // 7. State (G)
      130, // 8. District (H)
      160, // 9. ID (I)
      180, // 10. Gender Count (J)
      130, // 11. Mobile (K)
      130, // 12. Vehicle (L)
      240, // 13. Accompanying (M)
      160, // 14. Referred By (N)
      150, // 15. Submitter Name (O)
      200, // 16. Submitter Email (P)
      130, // 17. Total Devotees (Q)
      110, // 18. Male Count (R)
      110  // 19. Female Count (S)
    ];

    for (var c = 0; c < colWidths.length; c++) {
      sheet.setColumnWidth(c + 1, colWidths[c]);
    }

    // 14. Freeze Row 1 Headers only and unfreeze columns
    try {
      sheet.setFrozenRows(1);
      sheet.setFrozenColumns(0);
    } catch (protErr) {}

    fixedSheetsCount++;
  });

  // Re-generate VIP Dashboard so it connects to repaired columns
  try {
    setupVipDashboard();
  } catch (dashErr) {
    console.warn("VIP Dashboard refresh warning:", dashErr);
  }

  SpreadsheetApp.flush();

  return {
    success: true,
    sheetsFixed: fixedSheetsCount,
    rowsRepaired: totalRowsRepaired,
    message: "Google Sheet columns and rows successfully repaired and 100% realigned!"
  };
}

/**
 * UTILITY 1: SAFELY SETUP HEADERS, DROPDOWNS & CONDITIONAL GREEN HIGHLIGHTING
 * (Now safely calls fixAndRealignAllSheetColumns so it NEVER duplicates or shifts columns!)
 */
function formatEntireSheet() {
  if (!isAuthorizedAdmin()) {
    try {
      SpreadsheetApp.getUi().alert("⛔ अनधिकृत पहुंच (Unauthorized Access)!\n\nकेवल मुख्य एडमिन (smartcellayd@gmail.com) ही इन VIP टूल्स को चलाने के लिए अधिकृत हैं।");
    } catch (e) {}
    return { success: false, message: "Unauthorized" };
  }
  return fixAndRealignAllSheetColumns();
}

/**
 * UTILITY 2: CREATE ADVANCED VIP DASHBOARD & DAILY PASS REPORT (📊 VIP Dashboard)
 */
function setupVipDashboard() {
  if (!isAuthorizedAdmin()) {
    try {
      SpreadsheetApp.getUi().alert("⛔ अनधिकृत पहुंच (Unauthorized Access)!\n\nकेवल मुख्य एडमिन (smartcellayd@gmail.com) ही इन VIP टूल्स को चलाने के लिए अधिकृत हैं।");
    } catch (e) {}
    return;
  }

  var ss = getTargetSpreadsheet();
  if (!ss) return;

  var dataSheet = getMainDataSheet(ss);
  var dashSheet = ss.getSheetByName("📊 VIP Dashboard");

  if (!dashSheet) {
    dashSheet = ss.insertSheet("📊 VIP Dashboard");
  } else {
    dashSheet.clear();
  }

  var dataSheetName = "'" + dataSheet.getName() + "'";

  // 1. Create Title Header Banner
  dashSheet.getRange("A1:K2").merge();
  var titleCell = dashSheet.getRange("A1");
  titleCell.setValue("श्रीरामजन्मभूमि दर्शन पास पोर्टल - दैनिक पास निर्माण व विश्लेषिकी डैशबोर्ड");
  titleCell.setBackground("#0f172a"); // Dark Slate Navy
  titleCell.setFontColor("#ffffff");
  titleCell.setFontSize(16);
  titleCell.setFontWeight("bold");
  titleCell.setHorizontalAlignment("center");
  titleCell.setVerticalAlignment("middle");

  // 2. Add KPI Summary Cards (Row 4 & 5)
  // Card 1: Total Form Submissions
  dashSheet.getRange("A4:B4").merge();
  dashSheet.getRange("A4").setValue("कुल आए आवेदन (Total)");
  dashSheet.getRange("A4").setBackground("#3b82f6").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("A5:B5").merge();
  dashSheet.getRange("A5").setFormula("=COUNTA(" + dataSheetName + "!A2:A)");
  dashSheet.getRange("A5").setFontSize(18).setFontWeight("bold").setHorizontalAlignment("center");

  // Card 2: Total Passes Created (Sage Green - Column C: Pass Status)
  dashSheet.getRange("D4:E4").merge();
  dashSheet.getRange("D4").setValue("कुल बने पास (Pass Created)");
  dashSheet.getRange("D4").setBackground("#9fc48a").setFontColor("#000000").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("D5:E5").merge();
  dashSheet.getRange("D5").setFormula("=COUNTIF(" + dataSheetName + "!C2:C, \"Pass Created\")");
  dashSheet.getRange("D5").setFontSize(18).setFontWeight("bold").setFontColor("#064e3b").setHorizontalAlignment("center");

  // Card 3: Pending Applications (Yellow/Orange - Column C: Pass Status)
  dashSheet.getRange("G4:H4").merge();
  dashSheet.getRange("G4").setValue("कुल लंबित (Pending)");
  dashSheet.getRange("G4").setBackground("#f59e0b").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("G5:H5").merge();
  dashSheet.getRange("G5").setFormula("=COUNTIF(" + dataSheetName + "!C2:C, \"Pending\")");
  dashSheet.getRange("G5").setFontSize(18).setFontWeight("bold").setFontColor("#b45309").setHorizontalAlignment("center");

  // Card 4: Rejected (Red - Column C: Pass Status)
  dashSheet.getRange("J4:K4").merge();
  dashSheet.getRange("J4").setValue("निरस्त आवेदन (Rejected)");
  dashSheet.getRange("J4").setBackground("#ef4444").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("J5:K5").merge();
  dashSheet.getRange("J5").setFormula("=COUNTIF(" + dataSheetName + "!C2:C, \"Rejected\")");
  dashSheet.getRange("J5").setFontSize(18).setFontWeight("bold").setFontColor("#b91c1c").setHorizontalAlignment("center");

  // 3. TABLE 1: पास बनने की तिथि वार रिपोर्ट (PASS CREATED DATE REPORT - Column B)
  dashSheet.getRange("A7:C7").merge();
  dashSheet.getRange("A7").setValue("📅 पास बनने की तारीख वार रिपोर्ट (Passes Made)");
  dashSheet.getRange("A7").setBackground("#065f46").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  dashSheet.getRange("A8").setValue("पास बनने की तिथि").setFontWeight("bold").setBackground("#9fc48a").setFontColor("#000000").setHorizontalAlignment("center");
  dashSheet.getRange("B8").setValue("बने पास").setFontWeight("bold").setBackground("#9fc48a").setFontColor("#000000").setHorizontalAlignment("center");
  dashSheet.getRange("C8").setValue("कुल दर्शनार्थी").setFontWeight("bold").setBackground("#9fc48a").setFontColor("#000000").setHorizontalAlignment("center");

  dashSheet.getRange("A9").setFormula("=IFERROR(UNIQUE(FILTER(" + dataSheetName + "!B2:B, " + dataSheetName + "!B2:B <> \"\")), \"(अभी कोई डेटा नहीं)\")");
  dashSheet.getRange("B9:B28").setFormula("=IF(OR(A9=\"\", A9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIF(" + dataSheetName + "!B$2:B, A9))");
  dashSheet.getRange("C9:C28").setFormula("=IF(OR(A9=\"\", A9=\"(अभी कोई डेटा नहीं)\"), 0, SUMIFS(" + dataSheetName + "!Q$2:Q, " + dataSheetName + "!B$2:B, A9))");

  // 4. TABLE 2: दर्शन तिथि वार रिपोर्ट (VISIT DATE REPORT - Column D)
  dashSheet.getRange("E7:H7").merge();
  dashSheet.getRange("E7").setValue("🛕 दर्शन तिथि वार रिपोर्ट (Visit Date Summary)");
  dashSheet.getRange("E7").setBackground("#1e3a8a").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  dashSheet.getRange("E8").setValue("दर्शन तिथि").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");
  dashSheet.getRange("F8").setValue("कुल आवेदन").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");
  dashSheet.getRange("G8").setValue("स्वीकृत/बने पास").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");
  dashSheet.getRange("H8").setValue("लंबित (Pending)").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");

  dashSheet.getRange("E9").setFormula("=IFERROR(UNIQUE(FILTER(" + dataSheetName + "!D2:D, " + dataSheetName + "!D2:D <> \"\")), \"(अभी कोई डेटा नहीं)\")");
  dashSheet.getRange("F9:F28").setFormula("=IF(OR(E9=\"\", E9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIF(" + dataSheetName + "!D$2:D, E9))");
  dashSheet.getRange("G9:G28").setFormula("=IF(OR(E9=\"\", E9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIFS(" + dataSheetName + "!D$2:D, E9, " + dataSheetName + "!C$2:C, \"Pass Created\"))");
  dashSheet.getRange("H9:H28").setFormula("=IF(OR(E9=\"\", E9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIFS(" + dataSheetName + "!D$2:D, E9, " + dataSheetName + "!C$2:C, \"Pending\"))");

  // 5. TABLE 3: REFERRED BY REPORT (Column N)
  dashSheet.getRange("J7:K7").merge();
  dashSheet.getRange("J7").setValue("🎖️ रेफरेंस अधिकारी वार रिपोर्ट");
  dashSheet.getRange("J7").setBackground("#475569").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  dashSheet.getRange("J8").setValue("Referred By").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");
  dashSheet.getRange("K8").setValue("बने पास").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");

  dashSheet.getRange("J9").setFormula("=IFERROR(UNIQUE(FILTER(" + dataSheetName + "!N2:N, " + dataSheetName + "!N2:N <> \"\")), \"(अभी कोई डेटा नहीं)\")");
  dashSheet.getRange("K9:K28").setFormula("=IF(OR(J9=\"\", J9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIFS(" + dataSheetName + "!N$2:N, J9, " + dataSheetName + "!C$2:C, \"Pass Created\"))");

  // Format Dashboard Cells
  dashSheet.getRange("A1:K35").setHorizontalAlignment("center").setVerticalAlignment("middle").setFontFamily("Roboto");
  dashSheet.setColumnWidth(1, 150);
  dashSheet.setColumnWidth(2, 120);
  dashSheet.setColumnWidth(3, 130);
  dashSheet.setColumnWidth(4, 30);
  dashSheet.setColumnWidth(5, 140);
  dashSheet.setColumnWidth(6, 120);
  dashSheet.setColumnWidth(7, 140);
  dashSheet.setColumnWidth(8, 130);
  dashSheet.setColumnWidth(9, 30);
  dashSheet.setColumnWidth(10, 180);
  dashSheet.setColumnWidth(11, 120);

  // Add Column Chart for Date-wise Passes Created
  var chartBuilder = dashSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(dashSheet.getRange("A8:B28"))
    .setPosition(30, 1, 0, 0)
    .setOption('title', 'प्रतिदिन कुल बने पास (Date-wise Passes Created)')
    .setOption('colors', ['#9fc48a'])
    .setOption('width', 600)
    .setOption('height', 380);

  dashSheet.insertChart(chartBuilder.build());

  SpreadsheetApp.flush();
}
