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
    var sheet = ss.getSheetByName("Form Responses") || ss.getSheetByName("Form Responses 1") || ss.getSheets()[0];
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

      sheet.getRange(lastRow, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");

      // Add Dropdown to Pass Status cell (Column 2 / B)
      var statusCell = sheet.getRange(lastRow, 2);
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Pending", "Pass Created", "Rejected"], true)
        .setAllowInvalid(false)
        .build();
      statusCell.setDataValidation(rule);
    }

    SpreadsheetApp.flush();

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
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
  if (e && e.parameter && e.parameter.action === 'format') {
    try {
      formatEntireSheet();
      return ContentService.createTextOutput(JSON.stringify({
        "status": "success",
        "message": "Google Sheet Formatted! Pass Status is now in Column B right after Timestamp!"
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({
        "status": "error",
        "message": err.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    "status": "online",
    "message": "Darshan Pass Apps Script API is active."
  })).setMimeType(ContentService.MimeType.JSON);
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

/**
 * AUTOMATIC EDIT TRIGGER (onEdit)
 * When status in Column 2 (B) is changed to "Pass Created":
 * 1. Highlights the whole row in Custom Sage Green (#9fc48a)
 * 2. Auto-fills Column 3 (C - Pass Created Date) with Today's Date (DD/MM/YYYY) if empty
 */
function onEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  if (!sheet || sheet.getName().includes("Dashboard")) return;

  var col = e.range.getColumn();
  var row = e.range.getRow();

  // Column 2 = Pass Status (Column B)
  if (col === 2 && row > 1) {
    var statusVal = String(e.value || e.range.getValue() || '').trim();
    var lastCol = Math.max(sheet.getLastColumn(), 19);
    var rowRange = sheet.getRange(row, 1, 1, lastCol);
    var dateCell = sheet.getRange(row, 3); // Column 3 (C - Pass Created Date)

    if (statusVal.toLowerCase() === "pass created" || statusVal.toLowerCase() === "approved") {
      // 1. Custom Sage Green Row Background (#9fc48a - matching user's requested color)
      rowRange.setBackground("#9fc48a");
      rowRange.setFontColor("#000000");

      // 2. Auto-fill Pass Created Date in Col C if empty
      if (!dateCell.getValue()) {
        var todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");
        dateCell.setValue(todayStr);
      }

    } else if (statusVal.toLowerCase() === "rejected") {
      // Light Red Row Background (#fee2e2)
      rowRange.setBackground("#fee2e2");
      rowRange.setFontColor("#991b1b");

    } else if (statusVal.toLowerCase() === "pending" || !statusVal) {
      // Reset row background to White (#ffffff)
      rowRange.setBackground("#ffffff");
      rowRange.setFontColor("#000000");
    }
  }
}

/**
 * AUTOMATIC CUSTOM MENU IN GOOGLE SHEETS
 * Adds a "⚙️ VIP Tools" menu to Google Sheet top bar when opened.
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('⚙️ VIP Tools')
      .addItem('🎯 Setup Status in Column B & Apply Highlighting (कॉलम B में स्टेटस सेट करें)', 'formatEntireSheet')
      .addItem('📊 Generate VIP Dashboard (डैशबोर्ड व दैनिक रिपोर्ट बनाएं)', 'setupVipDashboard')
      .addToUi();
  } catch (err) {
    console.warn("onOpen UI creation warning:", err);
  }
}

/**
 * UTILITY 1: SAFELY SETUP HEADERS, DROPDOWNS & CONDITIONAL GREEN HIGHLIGHTING
 * Inserts Pass Status & Pass Created Date as Column B & C right after Timestamp (Col A)
 */
function formatEntireSheet() {
  var ss = getTargetSpreadsheet();
  if (!ss) return;

  var sheets = ss.getSheets();

  sheets.forEach(function(sheet) {
    if (!sheet || sheet.getName().includes("Dashboard")) return;

    var lastRow = sheet.getLastRow();
    if (lastRow < 1) return;

    // 1. Check if Column 2 is already "पास स्थिति"
    var col2Header = String(sheet.getRange(1, 2).getValue() || '');
    if (!col2Header.includes("स्थिति") && !col2Header.includes("Status")) {
      // Safely insert 2 new columns after Timestamp (Col A)
      sheet.insertColumnsAfter(1, 2);
    }

    // 2. Set Row 1 Headers explicitly
    var headers = [
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

    for (var h = 0; h < headers.length; h++) {
      sheet.getRange(1, h + 1).setValue(headers[h]);
    }

    var lastCol = Math.max(sheet.getLastColumn(), 19);

    // 3. Format grid alignment & fonts
    var maxR = Math.max(lastRow, 100);
    var fullRange = sheet.getRange(1, 1, maxR, lastCol);
    fullRange.setHorizontalAlignment("center");
    fullRange.setVerticalAlignment("middle");
    fullRange.setWrap(true);
    fullRange.setFontFamily("Roboto");

    // Header Styling (Row 1)
    var headerRange = sheet.getRange(1, 1, 1, lastCol);
    headerRange.setBackground("#1e3a8a"); // Navy Blue
    headerRange.setFontColor("#ffffff"); // White
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(11);
    sheet.setRowHeight(1, 45);

    // Data Rows Styling
    if (maxR > 1) {
      var dataRange = sheet.getRange(2, 1, maxR - 1, lastCol);
      dataRange.setFontSize(10);
      sheet.getRange(2, 1, maxR - 1, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");

      // Add Dropdown to Column 2 (B2:B1000)
      var statusRange = sheet.getRange(2, 2, maxR - 1, 1);
      var rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Pending", "Pass Created", "Rejected"], true)
        .setAllowInvalid(false)
        .build();
      statusRange.setDataValidation(rule);

      // Fill default "Pending" for empty status cells
      var statusValues = statusRange.getValues();
      for (var i = 0; i < statusValues.length; i++) {
        if (i < lastRow - 1 && !statusValues[i][0]) {
          sheet.getRange(i + 2, 2).setValue("Pending");
        }
      }
    }

    // 4. Setup Dynamic Conditional Formatting Rules (Auto Custom Sage Green #9fc48a for Pass Created)
    sheet.clearConditionalFormatRules();
    
    var rangeToApply = sheet.getRange(2, 1, maxR - 1, lastCol);

    // Rule 1: Pass Created -> Custom Sage Green (#9fc48a)
    var passCreatedRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$B2="Pass Created"')
      .setBackground("#9fc48a")
      .setFontColor("#000000")
      .setRanges([rangeToApply])
      .build();

    // Rule 2: Rejected -> Light Red (#fee2e2)
    var rejectedRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$B2="Rejected"')
      .setBackground("#fee2e2")
      .setFontColor("#991b1b")
      .setRanges([rangeToApply])
      .build();

    // Rule 3: Pending -> Clean White (#ffffff)
    var pendingRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$B2="Pending"')
      .setBackground("#ffffff")
      .setFontColor("#000000")
      .setRanges([rangeToApply])
      .build();

    sheet.setConditionalFormatRules([passCreatedRule, rejectedRule, pendingRule]);

    // Set Column Widths
    sheet.setColumnWidth(1, 150); // 1. Timestamp
    sheet.setColumnWidth(2, 160); // 2. Pass Status (B)
    sheet.setColumnWidth(3, 170); // 3. Pass Created Date (C)
    sheet.setColumnWidth(4, 130); // 4. Visit Date (D)
    sheet.setColumnWidth(5, 170); // 5. Visit Time Slot (E)
    sheet.setColumnWidth(6, 160); // 6. Name Age (F)
    sheet.setColumnWidth(7, 130); // 7. State (G)
    sheet.setColumnWidth(8, 130); // 8. District (H)
    sheet.setColumnWidth(9, 160); // 9. ID (I)
    sheet.setColumnWidth(10, 180); // 10. Gender Count (J)
    sheet.setColumnWidth(11, 130); // 11. Mobile (K)
    sheet.setColumnWidth(12, 130); // 12. Vehicle (L)
    sheet.setColumnWidth(13, 240); // 13. Accompanying (M)
    sheet.setColumnWidth(14, 160); // 14. Referred By (N)
    sheet.setColumnWidth(15, 150); // 15. Submitter Name (O)
    sheet.setColumnWidth(16, 200); // 16. Submitter Email (P)
    sheet.setColumnWidth(17, 130); // 17. Total Devotees (Q)
    sheet.setColumnWidth(18, 110); // 18. Male Count (R)
    sheet.setColumnWidth(19, 110); // 19. Female Count (S)
  });

  SpreadsheetApp.flush();
}

/**
 * UTILITY 2: CREATE ADVANCED VIP DASHBOARD & DAILY PASS REPORT (📊 VIP Dashboard)
 */
function setupVipDashboard() {
  var ss = getTargetSpreadsheet();
  if (!ss) return;

  var dataSheet = ss.getSheetByName("Form Responses") || ss.getSheetByName("Form Responses 1") || ss.getSheets()[0];
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

  // Card 2: Total Passes Created (Sage Green - Column B)
  dashSheet.getRange("D4:E4").merge();
  dashSheet.getRange("D4").setValue("कुल बने पास (Pass Created)");
  dashSheet.getRange("D4").setBackground("#9fc48a").setFontColor("#000000").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("D5:E5").merge();
  dashSheet.getRange("D5").setFormula("=COUNTIF(" + dataSheetName + "!B2:B, \"Pass Created\")");
  dashSheet.getRange("D5").setFontSize(18).setFontWeight("bold").setFontColor("#064e3b").setHorizontalAlignment("center");

  // Card 3: Pending Applications (Yellow/Orange - Column B)
  dashSheet.getRange("G4:H4").merge();
  dashSheet.getRange("G4").setValue("कुल लंबित (Pending)");
  dashSheet.getRange("G4").setBackground("#f59e0b").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("G5:H5").merge();
  dashSheet.getRange("G5").setFormula("=COUNTIF(" + dataSheetName + "!B2:B, \"Pending\")");
  dashSheet.getRange("G5").setFontSize(18).setFontWeight("bold").setFontColor("#b45309").setHorizontalAlignment("center");

  // Card 4: Rejected (Red - Column B)
  dashSheet.getRange("J4:K4").merge();
  dashSheet.getRange("J4").setValue("निरस्त आवेदन (Rejected)");
  dashSheet.getRange("J4").setBackground("#ef4444").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("J5:K5").merge();
  dashSheet.getRange("J5").setFormula("=COUNTIF(" + dataSheetName + "!B2:B, \"Rejected\")");
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
  dashSheet.getRange("G9:G28").setFormula("=IF(OR(E9=\"\", E9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIFS(" + dataSheetName + "!D$2:D, E9, " + dataSheetName + "!B$2:B, \"Pass Created\"))");
  dashSheet.getRange("H9:H28").setFormula("=IF(OR(E9=\"\", E9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIFS(" + dataSheetName + "!D$2:D, E9, " + dataSheetName + "!B$2:B, \"Pending\"))");

  // 5. TABLE 3: REFERRED BY REPORT (Column N)
  dashSheet.getRange("J7:K7").merge();
  dashSheet.getRange("J7").setValue("🎖️ रेफरेंस अधिकारी वार रिपोर्ट");
  dashSheet.getRange("J7").setBackground("#475569").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  dashSheet.getRange("J8").setValue("Referred By").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");
  dashSheet.getRange("K8").setValue("बने पास").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");

  dashSheet.getRange("J9").setFormula("=IFERROR(UNIQUE(FILTER(" + dataSheetName + "!N2:N, " + dataSheetName + "!N2:N <> \"\")), \"(अभी कोई डेटा नहीं)\")");
  dashSheet.getRange("K9:K28").setFormula("=IF(OR(J9=\"\", J9=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIFS(" + dataSheetName + "!N$2:N, J9, " + dataSheetName + "!B$2:B, \"Pass Created\"))");

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
