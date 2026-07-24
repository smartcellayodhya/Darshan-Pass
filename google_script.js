/**
 * DARSHAN PASS PUBLIC FORM - GOOGLE APPS SCRIPT
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit
 * 
 * Column Mapping (Row 1 Headers):
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
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    // Formatted Gender Count String (e.g., "Male: 2, Female: 1 (Total: 3)")
    var genderCountsStr = "Male: " + (data.maleCount || 0) + ", Female: " + (data.femaleCount || 0);

    // Append new row in exact column order
    sheet.appendRow([
      new Date(),                                    // 1. Timestamp
      data.visitDateTime || '',                      // 2. दर्शन हेतु आने का दिनाँक व समय
      data.nameAge || '',                            // 3. नाम व उम्र
      data.state || '',                              // 4. राज्य
      data.district || '',                           // 5. जिला
      data.idNumber || '',                           // 6. आधार नं0/पासपोर्ट नं0
      genderCountsStr,                               // 7. दर्शन हेतु पुरूषो (M) व महिलाओं (F) की अलग - अलग संख्या
      data.mobile || '',                             // 8. मो0नं0
      data.vehicleNo || '',                          // 9. गाडी नं0
      data.accompanying || '',                       // 10. साथ में आने वाले सभी दर्शनार्थियों के नाम व उम्र
      data.referredBy || ''                          // 11. Referred by
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "Darshan Pass entry saved successfully!"
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
    "message": "Darshan Pass Apps Script API is running."
  }))
  .setMimeType(ContentService.MimeType.JSON);
}
