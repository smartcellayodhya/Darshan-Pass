/**
 * DARSHAN PASS PUBLIC FORM - TRIPLE-BULLETPROOF GOOGLE APPS SCRIPT
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
  lock.tryLock(15000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};

    // 1. Multi-source Payload Extraction (JSON, form-urlencoded, or e.parameter)
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 2. Flexible Multi-Key Fallbacks (Ensures data is captured even if key names vary)
    var visitDateTime = data.visitDateTime || data.visitdate || data.visit_date || '';
    var nameAge = data.nameAge || data.name_age || data.name || '';
    var email = data.email || '';
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

    // 3. Append row safely into Google Sheet
    sheet.appendRow([
      new Date(),                                    // 1. Timestamp
      visitDateTime,                                 // 2. दर्शन हेतु आने का दिनाँक व समय
      nameAge,                                       // 3. नाम व उम्र
      email,                                         // 4. ईमेल ID
      state,                                         // 5. राज्य
      district,                                      // 6. जिला
      idNumber,                                      // 7. आधार नं0/पासपोर्ट नं0
      genderCountsStr,                               // 8. दर्शन हेतु पुरूषो (M) व महिलाओं (F) की अलग - अलग संख्या
      mobile,                                        // 9. मो0नं0
      vehicleNo,                                     // 10. गाडी नं0
      accompanying,                                  // 11. साथ में आने वाले सभी दर्शनार्थियों के नाम व उम्र
      referredBy                                     // 12. Referred by
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "Darshan Pass entry saved successfully!"
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
    "message": "Darshan Pass Apps Script API is active and ready."
  })).setMimeType(ContentService.MimeType.JSON);
}
