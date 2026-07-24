/**
 * DARSHAN PASS & SECURITY REGISTRATION - GOOGLE APPS SCRIPT
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit
 * 
 * Column Mapping:
 * 1. Timestamp
 * 2. दर्शन हेतु आने का दिनाँक व समय
 * 3. नाम व उम्र
 * 4. ईमेल (Email Address)
 * 5. राज्य
 * 6. जिला
 * 7. आधार नं0/पासपोर्ट नं0
 * 8. दर्शन हेतु पुरूषो (M) व महिलाओं (F) की अलग - अलग संख्या
 * 9. मो0नं0
 * 10. गाडी नं0
 * 11. साथ में आने वाले सभी दर्शनार्थियों के नाम व उम्र
 * 12. Referred by
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};

    // Safely extract payload from JSON or Form Parameters
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var mVal = parseInt(data.maleCount) || 0;
    var fVal = parseInt(data.femaleCount) || 0;
    var genderCountsStr = "Male: " + mVal + ", Female: " + fVal;

    // Append new row in exact column order
    sheet.appendRow([
      new Date(),                                    // 1. Timestamp
      data.visitDateTime || '',                      // 2. दर्शन हेतु आने का दिनाँक व समय
      data.nameAge || '',                            // 3. नाम व उम्र
      data.email || '',                              // 4. ईमेल ID
      data.state || '',                              // 5. राज्य
      data.district || '',                           // 6. जिला
      data.idNumber || '',                           // 7. आधार नं0/पासपोर्ट नं0
      genderCountsStr,                               // 8. दर्शन हेतु पुरूषो (M) व महिलाओं (F) की अलग - अलग संख्या
      data.mobile || '',                             // 9. मो0नं0
      data.vehicleNo || '',                          // 10. गाडी नं0
      data.accompanying || '',                       // 11. साथ में आने वाले सभी दर्शनार्थियों के नाम व उम्र
      data.referredBy || ''                          // 12. Referred by
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "Darshan Pass Security Entry saved successfully!"
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "error": error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    "status": "online",
    "message": "Darshan Pass Security Apps Script API is running."
  }))
  .setMimeType(ContentService.MimeType.JSON);
}
