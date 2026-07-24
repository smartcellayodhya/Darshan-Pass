/**
 * DARSHAN PASS PUBLIC FORM - GOOGLE APPS SCRIPT
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit
 * 
 * Column Mapping (Exact 13 Columns):
 * 1. Timestamp
 * 2. दर्शन हेतु आने का दिनाँक व समय
 * 3. नाम व उम्र
 * 4. राज्य
 * 5. जिला
 * 6. आधार नं0/पासपोर्ट नं0
 * 7. दर्शन हेतु पुरूषो (M) व महिलाओं (F) की अलग - अलग संख्या
 * 8. मो0नं0
 * 9. गाडी नं0
 * 10. साथ में आने वाले सभी दर्शनार्थियों के नाम व उम्र
 * 11. Referred by
 * 12. आवेदनकर्ता गूगल नाम (Submitter Name)
 * 13. आवेदनकर्ता ईमेल ID (Submitter Email)
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Form Responses") || ss.getSheets()[0];
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
    var visitDateTime = data.visitDateTime || data.visitdate || data.visit_date || '';
    var nameAge = data.nameAge || data.name_age || data.name || '';
    var state = data.state || '';
    var district = data.district || '';
    var idNumber = data.idNumber || data.id_number || data.id || '';
    
    var mVal = parseInt(data.maleCount || data.male_count || 0) || 0;
    var fVal = parseInt(data.femaleCount || data.female_count || 0) || 0;
    var genderCountsStr = "Male: " + mVal + ", Female: " + fVal;

    var mobile = data.mobile || data.phone || '';
    var vehicleNo = data.vehicleNo || data.vehicle_no || '';
    var accompanying = data.accompanying || data.members || '';
    var referredBy = data.referredBy || data.referred_by || '';
    var submitterName = data.submitterName || data.submitter_name || data.user_name || '';
    var submitterEmail = data.submitterEmail || data.submitter_email || data.user_email || '';

    // 3. Append row in exact 13 column order
    sheet.appendRow([
      new Date(),                                    // 1. Timestamp
      visitDateTime,                                 // 2. दर्शन हेतु आने का दिनाँक व समय
      nameAge,                                       // 3. नाम व उम्र
      state,                                         // 4. राज्य
      district,                                      // 5. जिला
      idNumber,                                      // 6. आधार नं0/पासपोर्ट नं0
      genderCountsStr,                               // 7. दर्शन हेतु पुरूषो (M) व महिलाओं (F) की अलग - अलग संख्या
      mobile,                                        // 8. मो0नं0
      vehicleNo,                                     // 9. गाडी नं0
      accompanying,                                  // 10. साथ में आने वाले सभी दर्शनार्थियों के नाम व उम्र
      referredBy,                                    // 11. Referred by
      submitterName,                                 // 12. आवेदनकर्ता गूगल नाम (Submitter Name)
      submitterEmail                                 // 13. आवेदनकर्ता ईमेल ID (Submitter Email)
    ]);

    // 4. AUTOMATIC CENTER ALIGNMENT & CLEAN FORMATTING FOR NEW ROW
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var newRowRange = sheet.getRange(lastRow, 1, 1, 13);
      
      // Vertical Middle & Horizontal Center Alignment
      newRowRange.setHorizontalAlignment("center");
      newRowRange.setVerticalAlignment("middle");
      newRowRange.setWrap(true); // Wrap text so accompanying names are line-by-line
      newRowRange.setFontFamily("Roboto");
      newRowRange.setFontSize(10);

      // Format Timestamp Column
      sheet.getRange(lastRow, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");
    }

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
 * UTILITY 1: FORMAT ALL EXISTING ROWS IN GOOGLE SHEET
 * Run this function once from Apps Script editor to clean & center-align all past data.
 */
function formatEntireSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var lastRow = sheet.getLastRow();
  var lastCol = 13;

  if (lastRow < 1) return;

  // Format Header (Row 1)
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

  // Format Data Rows (Row 2 to lastRow)
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

  // Adjust Column Widths
  sheet.setColumnWidth(1, 150); // Timestamp
  sheet.setColumnWidth(2, 180); // Visit Date
  sheet.setColumnWidth(3, 160); // Name Age
  sheet.setColumnWidth(4, 130); // State
  sheet.setColumnWidth(5, 130); // District
  sheet.setColumnWidth(6, 160); // ID
  sheet.setColumnWidth(7, 180); // Gender Count
  sheet.setColumnWidth(8, 130); // Mobile
  sheet.setColumnWidth(9, 130); // Vehicle
  sheet.setColumnWidth(10, 220); // Accompanying
  sheet.setColumnWidth(11, 160); // Referred By
  sheet.setColumnWidth(12, 150); // Submitter Name
  sheet.setColumnWidth(13, 200); // Submitter Email
}

/**
 * UTILITY 2: CREATE DASHBOARD TAB (📊 VIP Dashboard)
 * Run this function once from Apps Script editor to generate automatic Analytics Dashboard.
 */
function setupVipDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheets()[0];
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

  dashSheet.getRange("D6").setFormula("=UNIQUE('" + dataSheet.getName() + "'!K2:K)");
  dashSheet.getRange("E6:E25").setFormula("=IF(D6=\"\", \"\", COUNTIF('" + dataSheet.getName() + "'!K$2:K, D6))");

  // Add Chart for Referred By Analytics
  var chartBuilder = dashSheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(dashSheet.getRange("D5:E25"))
    .setPosition(4, 7, 0, 0)
    .setOption('title', 'रेफरेंस अधिकारी वार कुल पास (Referred By Summary)')
    .setOption('width', 600)
    .setOption('height', 400);
    
  dashSheet.insertChart(chartBuilder.build());
}
