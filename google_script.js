/**
 * DARSHAN PASS PUBLIC FORM - GOOGLE APPS SCRIPT
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit
 * 
 * Clean 19-Column Structure (Pass Status & Created Date placed right after Timestamp):
 * 1. Timestamp (dd/mm/yyyy hh:mm:ss)
 * 2. पास स्थिति (Pass Status - Pending / Pass Created / Rejected)
 * 3. पास बनने की तिथि (Pass Created Date - DD/MM/YYYY)
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

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var ss = getTargetSpreadsheet();
    var sheet = getMainDataSheet(ss);
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
      return ContentService.createTextOutput(JSON.stringify({
        "result": "ignored",
        "message": "Empty submission ignored."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Initial Status is always 'Pending' when form is filled
    var passStatus = "Pending";
    var passCreatedDate = ""; // Empty until pass is generated

    // 3. Append row in 19-column order (Status & Created Date right after Timestamp)
    sheet.appendRow([
      new Date(),                                    // 1. Timestamp
      passStatus,                                    // 2. पास स्थिति (Pass Status - Column B)
      passCreatedDate,                               // 3. पास बनने की तिथि (Pass Created Date - Column C)
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

    // 4. AUTOMATIC CENTER ALIGNMENT & DROPDOWN VALIDATION FOR NEW ROW
    var lastRow = sheet.getLastRow();
    var lastCol = Math.max(sheet.getLastColumn(), 19);

    if (lastRow > 1) {
      var newRowRange = sheet.getRange(lastRow, 1, 1, lastCol);

      newRowRange.setHorizontalAlignment("center");
      newRowRange.setVerticalAlignment("middle");
      newRowRange.setWrap(true);
      newRowRange.setFontFamily("Roboto");
      newRowRange.setFontSize(10);

      // Column M (Col 13 - Accompanying Devotees): Left align for clean multi-line readability
      sheet.getRange(lastRow, 13).setHorizontalAlignment("left");

      sheet.getRange(lastRow, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");

      // Add Dropdown to Pass Status cell (Column 2 / B)
      var statusCell = sheet.getRange(lastRow, 2);
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Pending", "Pass Created", "Already Created (अन्य काउंटर से)", "Rejected"], true)
        .setAllowInvalid(false)
        .build();
      statusCell.setDataValidation(rule);
    }

    SpreadsheetApp.flush();

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "rowNumber": lastRow,
      "row": lastRow,
      "name": nameAge,
      "message": "Darshan Pass entry saved successfully with Status = Pending in Column B!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "error": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var ss = getTargetSpreadsheet();
  var sheet = getMainDataSheet(ss);
  var lastRow = sheet ? sheet.getLastRow() : 0;

  // 1-CLICK AUTO REPAIR & FORMAT SHEET HANDLER
  if (e && e.parameter && (e.parameter.action === 'format' || e.parameter.action === 'fix' || e.parameter.action === 'realign')) {
    try {
      var result = fixAndRealignAllSheetColumns();
      return ContentService.createTextOutput(JSON.stringify({
        "status": "success",
        "result": result,
        "message": "Google Sheet columns and rows successfully repaired and 100% realigned!"
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({
        "status": "error",
        "message": err.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // INSTANT COLOR REFRESH HANDLER
  if (e && e.parameter && (e.parameter.action === 'recolor' || e.parameter.action === 'color')) {
    try {
      refreshAllRowColors();
      return ContentService.createTextOutput(JSON.stringify({
        "status": "success",
        "message": "All row colors successfully refreshed according to status!"
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (cErr) {
      return ContentService.createTextOutput(JSON.stringify({
        "status": "error",
        "message": cErr.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // 1-CLICK LOCK & PROTECT ROW 1 HEADERS
  if (e && e.parameter && (e.parameter.action === 'lock' || e.parameter.action === 'protect')) {
    try {
      var lockResult = lockAndProtectHeaderRow();
      return ContentService.createTextOutput(JSON.stringify({
        "status": "success",
        "result": lockResult,
        "message": "Row 1 headers successfully locked and protected!"
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (lErr) {
      return ContentService.createTextOutput(JSON.stringify({
        "status": "error",
        "message": lErr.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // PASS APPLICATION TRACKING HANDLER
  if (e && e.parameter && e.parameter.action === 'track') {
    var rawQuery = String(e.parameter.query || e.parameter.token || e.parameter.mobile || '').trim();
    if (!rawQuery || !sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        "result": "not_found",
        "message": "कृपया टोकन या मोबाइल नंबर दर्ज करें"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var query = rawQuery.toLowerCase();

    // Extract exact target row if searching by Token (e.g. AYO-20260830-1140 -> "1140")
    var targetTokenRow = "";
    var cleanTokenStr = query.replace(/^ayo-/i, "");
    var lastDash = cleanTokenStr.lastIndexOf("-");
    if (lastDash !== -1) {
      targetTokenRow = cleanTokenStr.substring(lastDash + 1).trim();
    } else if (/^\d+$/.test(query) && query.length < 10) {
      targetTokenRow = query;
    }

    var data = sheet.getDataRange().getValues();
    var match = null;

    var statusCol = findStatusColumn(sheet);
    var dateCol = findPassCreatedDateColumn(sheet);
    var colSlot = findColumnByKeywords(sheet, ["स्लॉट", "slot"], 5);
    var colName = findColumnByKeywords(sheet, ["नाम", "name"], 6);
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
      var mob = "";
      var ref = "";
      var total = "";

      if (slotIdx !== -1) {
        vSlot = String(rowData[slotIdx] || '').trim();
        vDate = formatSheetDateToDDMMYYYY(rowData[slotIdx - 1]);
        name = String(rowData[slotIdx + 1] || '').trim();
        mob = String(rowData[slotIdx + 6] || '').trim();
        ref = String(rowData[slotIdx + 9] || '').trim();
        total = String(rowData[slotIdx + 12] || '').trim();
      } else {
        vDate = formatSheetDateToDDMMYYYY(rowData[colSlot - 2] || rowData[3]);
        vSlot = String(rowData[colSlot - 1] || rowData[4] || '').trim();
        name = String(rowData[colName - 1] || rowData[5] || '').trim();
        mob = String(rowData[colMob - 1] || rowData[10] || '').trim();
        ref = String(rowData[colRef - 1] || rowData[13] || '').trim();
        total = String(rowData[colTotal - 1] || rowData[16] || '').trim();
      }

      // Skip ghost or blank rows
      if (!name && !mob && !vDate) continue;

      var cleanMob = String(mob).replace(/\D/g, '');
      var cleanQuery = query.replace(/\D/g, '');
      var isMobileMatch = (cleanQuery.length >= 10 && (cleanMob === cleanQuery || cleanMob.includes(cleanQuery) || cleanQuery.includes(cleanMob)));
      var isRowMatch = (targetTokenRow !== "" && String(rowNum) === targetTokenRow);

      // Also check all cells in row for 10-digit mobile match if not matched
      if (!isMobileMatch && !isRowMatch && cleanQuery.length >= 10) {
        for (var mc = 0; mc < rowData.length; mc++) {
          var cellDigits = String(rowData[mc] || '').replace(/\D/g, '');
          if (cellDigits === cleanQuery || (cellDigits.length >= 10 && cellDigits.includes(cleanQuery))) {
            isMobileMatch = true;
            break;
          }
        }
      }

      if (isMobileMatch || isRowMatch) {
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

        match = {
          rowNumber: rowNum,
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
      return ContentService.createTextOutput(JSON.stringify({
        "result": "success",
        "data": match
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        "result": "not_found",
        "message": "कोई आवेदन नहीं मिला। कृपया विवरण जांचें।"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    "status": "online",
    "lastRow": lastRow,
    "message": "Darshan Pass Apps Script API is active."
  })).setMimeType(ContentService.MimeType.JSON);
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

    sheet.clearConditionalFormatRules();

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

    sheet.setConditionalFormatRules([passCreatedRule, alreadyCreatedRule, rejectedRule, pendingRule]);
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
    if (startRow <= 1) return;

    var statusCol = findStatusColumn(sheet);
    var dateCol = findPassCreatedDateColumn(sheet);
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
function syncAllDevoteeCounts(optSheet) {
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
 * LOCK & PROTECT HEADER ROW (ROW 1) (पहली हेडिंग रो को हमेशा के लिए सुरक्षित / लॉक करें)
 * 1. Freezes Row 1 so it stays permanently pinned at the top when scrolling
 * 2. Applies Google Sheets Range Protection on Row 1 (A1:S1) so no user can edit or delete headers accidentally
 * 3. Removes other editors from the range so only owner/admin can edit, or sets warning-only fallback
 */
function lockAndProtectHeaderRow(optSheet) {
  var ss = getTargetSpreadsheet();
  var sheet = optSheet || getMainDataSheet(ss);
  if (!sheet) return { success: false, message: "Sheet not found" };

  try {
    // 1. Freeze Row 1 so it stays fixed during vertical scrolling
    sheet.setFrozenRows(1);

    var maxCols = Math.max(sheet.getLastColumn() || 19, sheet.getMaxColumns() || 19);
    var headerRange = sheet.getRange(1, 1, 1, maxCols);

    // 2. Remove existing protections on Row 1 to avoid duplicate protection rules
    var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    for (var i = 0; i < protections.length; i++) {
      var p = protections[i];
      var r = p.getRange();
      if (r && r.getRow() === 1 && r.getNumRows() === 1) {
        p.remove();
      }
    }

    // 3. Create fresh Range Protection on Row 1
    var protection = headerRange.protect().setDescription("🔒 सुरक्षित Row 1 हेडर्स (Protected Header Row - Do Not Edit)");

    // Restrict editing so only effective user / owner can edit, locking for all other editors
    try {
      var me = Session.getEffectiveUser();
      protection.addEditor(me);
      protection.removeEditors(protection.getEditors());
      if (protection.canDomainEdit()) {
        protection.setDomainEdit(false);
      }
    } catch (permErr) {
      // If workspace sharing settings prevent editor removal, enable strict warning popup on edit
      protection.setWarningOnly(true);
    }

    // Visual toast notification if run from spreadsheet UI
    try {
      SpreadsheetApp.getActiveSpreadsheet().toast("✅ पहली रो (हेडर्स) हमेशा के लिए लॉक व सुरक्षित कर दी गई है!", "Row 1 Locked 🔒", 5);
    } catch (tErr) {}

    SpreadsheetApp.flush();
    return {
      success: true,
      message: "Row 1 (Headers) is now permanently locked and protected!"
    };
  } catch (err) {
    console.warn("Row 1 lock notice:", err);
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
  var ss = getTargetSpreadsheet();
  var sheet = optSheet || getMainDataSheet(ss);
  if (!sheet) return;

  var lastRow = sheet.getLastRow();
  var maxCols = sheet.getMaxColumns();
  var lastCol = Math.min(Math.max(sheet.getLastColumn() || 19, 19), maxCols || 19);
  if (lastRow < 2) return;

  // 1. Sync Devotee Counts & Left-align Column M
  try {
    syncAllDevoteeCounts(sheet);
  } catch (syncErr) {
    console.warn("Devotee sync notice:", syncErr);
  }

  var statusCol = findStatusColumn(sheet);
  var numDataRows = lastRow - 1;

  // Read status values directly from detected status column (Column C / Col 3!)
  var statusVals = sheet.getRange(2, statusCol, numDataRows, 1).getValues();
  var backgrounds = sheet.getRange(2, 1, numDataRows, lastCol).getBackgrounds();
  var fontColors = sheet.getRange(2, 1, numDataRows, lastCol).getFontColors();

  for (var i = 0; i < numDataRows; i++) {
    var raw = String(statusVals[i][0] || '').replace(/[\u00A0\s]+/g, ' ').trim().toLowerCase();
    var bg = "#ffffff";
    var fc = "#000000";

    if (raw.indexOf("pass created") !== -1 || raw.indexOf("approved") !== -1 || raw.indexOf("बन गया") !== -1 || raw.indexOf("स्वीकृत") !== -1) {
      bg = "#9fc48a"; // Sage Green
      fc = "#000000";
    } else if (raw.indexOf("already") !== -1 || raw.indexOf("अन्य काउंटर") !== -1) {
      bg = "#fef08a"; // Amber Yellow
      fc = "#854d0e";
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

  sheet.getRange(2, 1, numDataRows, lastCol).setBackgrounds(backgrounds);
  sheet.getRange(2, 1, numDataRows, lastCol).setFontColors(fontColors);

  // Also sync dynamic conditional formatting across entire sheet
  setupDynamicConditionalFormatting(sheet, statusCol);

  // 4. Ensure Row 1 Header Protection is permanently active
  try {
    lockAndProtectHeaderRow(sheet);
  } catch (lockErr) {}

  SpreadsheetApp.flush();
}

/**
 * AUTOMATIC CUSTOM MENU IN GOOGLE SHEETS
 * Adds a "⚙️ VIP Tools" menu to Google Sheet top bar when opened.
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('⚙️ VIP Tools')
      .addItem('🎨 Re-apply Status Colors (सभी पंक्तियों में रंग भरें)', 'refreshAllRowColors')
      .addItem('🔄 Sync Devotee Counts & Left-Align M (संख्या सिंक व कॉलम M लेफ्ट करें)', 'syncAllDevoteeCounts')
      .addItem('🔒 Lock & Protect Row 1 Headers (हेडिंग रो को लॉक करें)', 'lockAndProtectHeaderRow')
      .addItem('🛠️ 1-Click Realign & Fix All Columns (कॉलम क्रम 1-क्लिक में ठीक करें)', 'fixAndRealignAllSheetColumns')
      .addItem('🎯 Format Entire Sheet (शीट फॉर्मेट करें)', 'formatEntireSheet')
      .addItem('📊 Generate VIP Dashboard (डैशबोर्ड व दैनिक रिपोर्ट बनाएं)', 'setupVipDashboard')
      .addToUi();
  } catch (err) {
    console.warn("onOpen UI creation warning:", err);
  }
}

/**
 * 1-CLICK COLUMN REPAIR & DATA REALIGNMENT
 * Automatically unhides hidden columns, detects shifted cells (e.g. +2 column shift),
 * realigns all data under the proper 19 headers, preserves existing pass statuses,
 * deletes duplicate/empty shift columns, sets dropdowns & sage green highlighting.
 */
function fixAndRealignAllSheetColumns() {
  var ss = getTargetSpreadsheet();
  if (!ss) {
    throw new Error("Spreadsheet could not be opened. Check ID or active sheet permissions.");
  }

  var sheets = ss.getSheets();
  var fixedSheetsCount = 0;
  var totalRowsRepaired = 0;

  var standardHeaders = [
    "Timestamp",
    "पास स्थिति (Pass Status)",
    "पास बनने की तिथि (Pass Created Date)",
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
    if (!isDatePattern(s)) return ""; // Strictly only return if it's a valid date!
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

    // 1. Unhide any hidden columns (e.g. Column E)
    try {
      sheet.showColumns(1, Math.max(lastCol, 25));
    } catch (e) {
      console.warn("Unhide columns notice:", e);
    }

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
      var status = "Pending";
      var createdDate = "";
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
        status = isStatusVal(row[1]) ? cleanStatusVal(row[1]) : "Pending";
        createdDate = formatDateVal(row[2] || "");
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
        // Skip ghost/empty submissions like "Male: 0, Female: 0"
        continue;
      }

      // If status is Pass Created and createdDate is empty, fill with row's timestamp date or today
      if (status === "Pass Created" && !createdDate) {
        createdDate = formatDateVal(timestamp) || Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "GMT+5:30", "dd/MM/yyyy");
      }

      cleanedRows.push([
        timestamp,
        status,
        createdDate,
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

    // 3. Reset all old backgrounds, text colors and validations across entire sheet
    var maxR = sheet.getMaxRows();
    var maxC = sheet.getMaxColumns();
    if (maxR > 1) {
      var allDataRange = sheet.getRange(2, 1, maxR - 1, maxC);
      allDataRange.setBackground(null);
      allDataRange.setFontColor(null);
      try {
        allDataRange.clearDataValidations();
      } catch (valErr) {
        console.warn("Validation clear notice:", valErr);
      }
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

    // 11. Dropdown Validation on Column B (Pass Status)
    var statusRowsCount = Math.max(cleanedRows.length + 5, 20);
    var statusRange = sheet.getRange(2, 2, statusRowsCount, 1);
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
      150, // 1. Timestamp
      165, // 2. Pass Status (B)
      165, // 3. Pass Created Date (C)
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

    // 14. Freeze & Lock Row 1 Headers from accidental edits
    try {
      lockAndProtectHeaderRow(sheet);
    } catch (protErr) {
      console.warn("Header lock notice:", protErr);
    }

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
  return fixAndRealignAllSheetColumns();
}

/**
 * UTILITY 2: CREATE ADVANCED VIP DASHBOARD & DAILY PASS REPORT (📊 VIP Dashboard)
 */
function setupVipDashboard() {
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

  // Card 2: Total Passes Created (Sage Green - Column B or C)
  dashSheet.getRange("D4:E4").merge();
  dashSheet.getRange("D4").setValue("कुल बने पास (Pass Created)");
  dashSheet.getRange("D4").setBackground("#9fc48a").setFontColor("#000000").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("D5:E5").merge();
  dashSheet.getRange("D5").setFormula("=COUNTIF(" + dataSheetName + "!B2:B, \"Pass Created\") + COUNTIF(" + dataSheetName + "!C2:C, \"Pass Created\")");
  dashSheet.getRange("D5").setFontSize(18).setFontWeight("bold").setFontColor("#064e3b").setHorizontalAlignment("center");

  // Card 3: Pending Applications (Yellow/Orange - Column B or C)
  dashSheet.getRange("G4:H4").merge();
  dashSheet.getRange("G4").setValue("कुल लंबित (Pending)");
  dashSheet.getRange("G4").setBackground("#f59e0b").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("G5:H5").merge();
  dashSheet.getRange("G5").setFormula("=COUNTIF(" + dataSheetName + "!B2:B, \"Pending\") + COUNTIF(" + dataSheetName + "!C2:C, \"Pending\")");
  dashSheet.getRange("G5").setFontSize(18).setFontWeight("bold").setFontColor("#b45309").setHorizontalAlignment("center");

  // Card 4: Rejected (Red - Column B or C)
  dashSheet.getRange("J4:K4").merge();
  dashSheet.getRange("J4").setValue("निरस्त आवेदन (Rejected)");
  dashSheet.getRange("J4").setBackground("#ef4444").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("J5:K5").merge();
  dashSheet.getRange("J5").setFormula("=COUNTIF(" + dataSheetName + "!B2:B, \"Rejected\") + COUNTIF(" + dataSheetName + "!C2:C, \"Rejected\")");
  dashSheet.getRange("J5").setFontSize(18).setFontWeight("bold").setFontColor("#b91c1c").setHorizontalAlignment("center");

  // 3. TABLE 1: पास बनने की तिथि वार रिपोर्ट (PASS CREATED DATE REPORT - Column C)
  dashSheet.getRange("A7:C7").merge();
  dashSheet.getRange("A7").setValue("📅 पास बनने की तारीख वार रिपोर्ट (Passes Made)");
  dashSheet.getRange("A7").setBackground("#065f46").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  dashSheet.getRange("A8").setValue("पास बनने की तिथि").setFontWeight("bold").setBackground("#9fc48a").setFontColor("#000000").setHorizontalAlignment("center");
  dashSheet.getRange("B8").setValue("बने पास").setFontWeight("bold").setBackground("#9fc48a").setFontColor("#000000").setHorizontalAlignment("center");
  dashSheet.getRange("C8").setValue("कुल दर्शनार्थी").setFontWeight("bold").setBackground("#9fc48a").setFontColor("#000000").setHorizontalAlignment("center");

  dashSheet.getRange("A9").setFormula("=IFERROR(UNIQUE(FILTER(" + dataSheetName + "!C2:C, " + dataSheetName + "!C2:C <> \"\")), \"(अभी कोई डेटा नहीं)\")");
  dashSheet.getRange("B9:B28").setFormula("=IF(OR(A9=\"\", A9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIF(" + dataSheetName + "!C$2:C, A9))");
  dashSheet.getRange("C9:C28").setFormula("=IF(OR(A9=\"\", A9=\"(अभी कोई डेटा नहीं)\"), 0, SUMIFS(" + dataSheetName + "!Q$2:Q, " + dataSheetName + "!C$2:C, A9))");

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
  dashSheet.getRange("G9:G28").setFormula("=IF(OR(E9=\"\", E9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIFS(" + dataSheetName + "!D$2:D, E9, " + dataSheetName + "!B$2:B, \"Pass Created\") + COUNTIFS(" + dataSheetName + "!D$2:D, E9, " + dataSheetName + "!C$2:C, \"Pass Created\"))");
  dashSheet.getRange("H9:H28").setFormula("=IF(OR(E9=\"\", E9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIFS(" + dataSheetName + "!D$2:D, E9, " + dataSheetName + "!B$2:B, \"Pending\") + COUNTIFS(" + dataSheetName + "!D$2:D, E9, " + dataSheetName + "!C$2:C, \"Pending\"))");

  // 5. TABLE 3: REFERRED BY REPORT (Column N)
  dashSheet.getRange("J7:K7").merge();
  dashSheet.getRange("J7").setValue("🎖️ रेफरेंस अधिकारी वार रिपोर्ट");
  dashSheet.getRange("J7").setBackground("#475569").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  dashSheet.getRange("J8").setValue("Referred By").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");
  dashSheet.getRange("K8").setValue("बने पास").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");

  dashSheet.getRange("J9").setFormula("=IFERROR(UNIQUE(FILTER(" + dataSheetName + "!N2:N, " + dataSheetName + "!N2:N <> \"\")), \"(अभी कोई डेटा नहीं)\")");
  dashSheet.getRange("K9:K28").setFormula("=IF(OR(J9=\"\", J9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIFS(" + dataSheetName + "!N$2:N, J9, " + dataSheetName + "!B$2:B, \"Pass Created\") + COUNTIFS(" + dataSheetName + "!N$2:N, J9, " + dataSheetName + "!C$2:C, \"Pass Created\"))");

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
