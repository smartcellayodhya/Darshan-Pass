/**
 * DARSHAN PASS PUBLIC FORM - GOOGLE APPS SCRIPT
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit
 * 
 * Column Mapping (Clean 17-Column Order):
 * 1. Timestamp (dd/mm/yyyy hh:mm:ss)
 * 2. दर्शन तिथि (Visit Date - DD/MM/YYYY)
 * 3. दर्शन समय स्लॉट (Visit Time Slot - 07:00 AM - 09:00 AM)
 * 4. नाम व उम्र (Name & Age)
 * 5. राज्य (State)
 * 6. जिला (District)
 * 7. आधार नं0/पासपोर्ट नं0 (ID Number)
 * 8. पुरूषो व महिलाओं की संख्या (Gender Count Text)
 * 9. मो0नं0 (Mobile Number)
 * 10. गाडी नं0 (Vehicle Number)
 * 11. साथ में आने वाले सदस्यों के नाम व उम्र (Accompanying Devotees)
 * 12. Referred by (Reference Officer)
 * 13. आवेदनकर्ता गूगल नाम (Submitter Name)
 * 14. आवेदनकर्ता ईमेल ID (Submitter Email)
 * 15. कुल दर्शनार्थी संख्या (Total Devotees Numeric SUM)
 * 16. पुरुष संख्या (Male Count Numeric)
 * 17. महिला संख्या (Female Count Numeric)
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
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

    // If visitDate is missing or YYYY-MM-DD, clean and format to DD/MM/YYYY
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

    // 3. Append row in exact 17-column order (Separated Date & Time Slot)
    sheet.appendRow([
      new Date(),                                    // 1. Timestamp
      visitDate,                                     // 2. दर्शन तिथि (Visit Date - DD/MM/YYYY)
      visitSlot,                                     // 3. दर्शन समय स्लॉट (Visit Time Slot)
      nameAge,                                       // 4. नाम व उम्र
      state,                                         // 5. राज्य
      district,                                      // 6. जिला
      idNumber,                                      // 7. आधार नं0/पासपोर्ट नं0
      genderCountsStr,                               // 8. पुरूषो व महिलाओं की संख्या
      mobile,                                        // 9. मो0नं0
      vehicleNo,                                     // 10. गाडी नं0
      accompanying,                                  // 11. साथ में आने वाले सदस्यों के नाम व उम्र
      referredBy,                                    // 12. Referred by
      submitterName,                                 // 13. Submitter Name
      submitterEmail,                                // 14. Submitter Email
      totalDevotees,                                 // 15. कुल दर्शनार्थी संख्या (Numeric SUM)
      mVal,                                          // 16. पुरुष संख्या (Numeric)
      fVal                                           // 17. महिला संख्या (Numeric)
    ]);

    // 4. AUTOMATIC CENTER ALIGNMENT & CLEAN FORMATTING FOR NEW ROW
    var lastRow = sheet.getLastRow();
    var lastCol = Math.max(sheet.getLastColumn(), 17);
    
    if (lastRow > 1) {
      var newRowRange = sheet.getRange(lastRow, 1, 1, lastCol);
      
      // Vertical Middle & Horizontal Center Alignment
      newRowRange.setHorizontalAlignment("center");
      newRowRange.setVerticalAlignment("middle");
      newRowRange.setWrap(true); // Wrap text so accompanying names are line-by-line
      newRowRange.setFontFamily("Roboto");
      newRowRange.setFontSize(10);

      // Format Timestamp Column
      sheet.getRange(lastRow, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");
    }

    SpreadsheetApp.flush(); // Force immediate repaint on Google Sheets UI

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "Darshan Pass entry saved & auto-formatted successfully!"
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
  return ContentService.createTextOutput(JSON.stringify({
    "status": "online",
    "message": "Darshan Pass Apps Script API is active."
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * AUTOMATIC CUSTOM MENU IN GOOGLE SHEETS
 * Adds a "⚙️ VIP Tools" menu to Google Sheet top bar when opened.
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('⚙️ VIP Tools')
      .addItem('🎯 Auto-Align & Clean Sheet (डेटा सेंटर करें)', 'formatEntireSheet')
      .addItem('📊 Generate VIP Dashboard (डैशबोर्ड बनाएं)', 'setupVipDashboard')
      .addToUi();
  } catch (err) {
    console.warn("onOpen UI creation warning:", err);
  }
}

/**
 * UTILITY 1: FORMAT & FIX ALL EXISTING ROWS IN GOOGLE SHEET
 * Run this function from Apps Script or from "⚙️ VIP Tools" menu to clean, split dates & center-align all sheets.
 */
function formatEntireSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();

  sheets.forEach(function(sheet) {
    if (sheet.getName().includes("Dashboard")) return; // Skip dashboard tab

    var lastRow = sheet.getLastRow();
    var lastCol = Math.max(sheet.getLastColumn(), 17);

    if (lastRow < 1) return;

    // 1. Clean and Fix Past Combined Date Rows (e.g. "2026-07-25 (07:00 AM - 09:00 AM)")
    if (lastRow > 1) {
      var col2Values = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var r = 0; r < col2Values.length; r++) {
        var val = String(col2Values[r][0] || '');
        if (val.includes("(")) {
          var match = val.match(/^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\s*\((.*)\)$/);
          if (match) {
            var rawDate = match[1];
            var slotStr = match[2];
            if (rawDate.includes("-")) {
              var p = rawDate.split("-");
              rawDate = p[2] + "/" + p[1] + "/" + p[0];
            }
            sheet.getRange(r + 2, 2).setValue(rawDate); // Column 2 = DD/MM/YYYY Date
            sheet.getRange(r + 2, 3).setValue(slotStr); // Column 3 = Time Slot
          }
        }
      }
    }

    // 2. Format Header (Row 1)
    var headerRange = sheet.getRange(1, 1, 1, lastCol);
    headerRange.setBackground("#1e3a8a"); // Navy Blue
    headerRange.setFontColor("#ffffff"); // White
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    headerRange.setWrap(true);
    headerRange.setFontFamily("Roboto");
    headerRange.setFontSize(11);
    sheet.setRowHeight(1, 40);

    // 3. Format Data Rows (Row 2 to lastRow)
    if (lastRow > 1) {
      var dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
      dataRange.setHorizontalAlignment("center");
      dataRange.setVerticalAlignment("middle");
      dataRange.setWrap(true); // Line-by-line wrapping
      dataRange.setFontFamily("Roboto");
      dataRange.setFontSize(10);
      
      // Set Timestamp Column Format
      sheet.getRange(2, 1, lastRow - 1, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");
    }

    // 4. Adjust Column Widths
    sheet.setColumnWidth(1, 150); // Timestamp
    sheet.setColumnWidth(2, 130); // Visit Date (DD/MM/YYYY)
    sheet.setColumnWidth(3, 170); // Visit Time Slot
    sheet.setColumnWidth(4, 160); // Name Age
    sheet.setColumnWidth(5, 130); // State
    sheet.setColumnWidth(6, 130); // District
    sheet.setColumnWidth(7, 160); // ID
    sheet.setColumnWidth(8, 180); // Gender Count
    sheet.setColumnWidth(9, 130); // Mobile
    sheet.setColumnWidth(10, 130); // Vehicle
    sheet.setColumnWidth(11, 240); // Accompanying
    sheet.setColumnWidth(12, 160); // Referred By
    sheet.setColumnWidth(13, 150); // Submitter Name
    sheet.setColumnWidth(14, 200); // Submitter Email
    sheet.setColumnWidth(15, 130); // Total Devotees
    sheet.setColumnWidth(16, 110); // Male Count
    sheet.setColumnWidth(17, 110); // Female Count
  });

  SpreadsheetApp.flush(); // Instantly apply and repaint formatting on Google Sheets UI
}

/**
 * UTILITY 2: CREATE DASHBOARD TAB (📊 VIP Dashboard)
 * Run this function from Apps Script or from "⚙️ VIP Tools" menu.
 */
function setupVipDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("Form Responses") || ss.getSheetByName("Form Responses 1") || ss.getSheets()[0];
  var dashSheet = ss.getSheetByName("📊 VIP Dashboard");

  if (!dashSheet) {
    dashSheet = ss.insertSheet("📊 VIP Dashboard");
  } else {
    dashSheet.clear();
  }

  // 1. Create Title Header Banner
  dashSheet.getRange("A1:H2").merge();
  var titleCell = dashSheet.getRange("A1");
  titleCell.setValue("श्रीरामजन्मभूमि दर्शन पास पोर्टल - VIP डैशबोर्ड & विश्लेषिकी");
  titleCell.setBackground("#0f172a"); // Dark Slate Navy
  titleCell.setFontColor("#ffffff");
  titleCell.setFontSize(16);
  titleCell.setFontWeight("bold");
  titleCell.setHorizontalAlignment("center");
  titleCell.setVerticalAlignment("middle");

  // 2. Add KPI Summary Cards
  // Total Applications
  dashSheet.getRange("A4:B4").merge();
  dashSheet.getRange("A4").setValue("कुल दर्शन पास आवेदन (Total)");
  dashSheet.getRange("A4").setBackground("#3b82f6").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("A5:B5").merge();
  dashSheet.getRange("A5").setFormula("=COUNTA('" + dataSheet.getName() + "'!A2:A)");
  dashSheet.getRange("A5").setFontSize(18).setFontWeight("bold").setHorizontalAlignment("center");

  // Referred By Counts Summary Table
  dashSheet.getRange("D4:F4").merge();
  dashSheet.getRange("D4").setValue("Referred By (रेफरेंस वार पास रिपोर्ट)");
  dashSheet.getRange("D4").setBackground("#1e3a8a").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  dashSheet.getRange("D5").setValue("रेफरेंस अधिकारी (Referred By)").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");
  dashSheet.getRange("E5").setValue("कुल आवेदन (Passes)").setFontWeight("bold").setBackground("#e2e8f0").setHorizontalAlignment("center");

  dashSheet.getRange("D6").setFormula("=IFERROR(UNIQUE(FILTER('" + dataSheet.getName() + "'!L2:L, '" + dataSheet.getName() + "'!L2:L <> \"\")), \"(अभी कोई डेटा नहीं)\")");
  dashSheet.getRange("E6:E25").setFormula("=IF(OR(D6=\"\", D6=\"(अभी कोई डेटा नहीं)\"), 0, COUNTIF('" + dataSheet.getName() + "'!L$2:L, D6))");

  // Add Chart for Referred By Analytics
  var chartBuilder = dashSheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(dashSheet.getRange("D5:E25"))
    .setPosition(4, 7, 0, 0)
    .setOption('title', 'रेफरेंस अधिकारी वार कुल पास (Referred By Summary)')
    .setOption('width', 600)
    .setOption('height', 400);
    
  dashSheet.insertChart(chartBuilder.build());

  SpreadsheetApp.flush();
}
