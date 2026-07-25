# 🛕 दर्शन पास पंजीकरण पोर्टल (Darshan Pass Public Form)

Aapki Google Sheet link: [https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit](https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit)

---

## 📊 Google Sheet 19-Column Structure (Timestamp ke Just Baad Status System)

| Col # | Column Header | Descriptions & Automatic Behaviors |
| :--- | :--- | :--- |
| **A1** | `Timestamp` | Form submit hone ka samay (dd/mm/yyyy hh:mm:ss) |
| **B1** | `पास स्थिति (Pass Status)` | **Dropdown (Column B):** `Pending` / `Pass Created` / `Rejected` |
| **C1** | `पास बनने की तिथि (Pass Created Date)` | **Auto-filled (Column C):** Status `Pass Created` hote hi aaj ki Date apne-aap fill hogi |
| **D1** | `दर्शन तिथि` | Visit Date (DD/MM/YYYY) |
| **E1** | `दर्शन समय स्लॉट` | Visit Time Slot (07:00 AM - 09:00 AM) |
| **F1** | `नाम व उम्र` | Devotee Name & Age |
| **G1** | `राज्य` | State |
| **H1** | `जिला` | District |
| **I1** | `आधार नं0/पासपोर्ट नं0` | Govt ID Number |
| **J1** | `पुरूषो व महिलाओं की संख्या` | Gender Counts (Text) |
| **K1** | `मो0नं0` | Mobile Number |
| **L1** | `गाडी नं0` | Vehicle Number |
| **M1** | `साथ में आने वाले सदस्यों के नाम व उम्र` | Accompanying Devotees |
| **N1** | `Referred by` | Reference Officer Name |
| **O1** | `आवेदनकर्ता गूगल नाम` | Google Submitter Name |
| **P1** | `आवेदनकर्ता ईमेल ID` | Google Submitter Email |
| **Q1** | `कुल दर्शनार्थी संख्या` | Total Devotees (Numeric SUM) |
| **R1** | `पुरुष संख्या` | Male Count |
| **S1** | `महिला संख्या` | Female Count |

---

## 🟢 Column B Status & Light Green Highlight System

1. **Timestamp ke turant baad Column B (Pass Status):**
   - Naye aavedan ka status hamesha **`Pending`** rahega.
   - Jab aap Column B me status badalkar **`Pass Created`** karenge:
     - **Poori Row Light Green (`#dcfce7`) ho jayegi.**
     - **Column C (`पास बनने की तिथि`)** me aaj ki तारीख (Date) auto-fill ho jayegi.
2. **Rejected Status:**
   - Column B me status **`Rejected`** karne par row Light Red (`#fee2e2`) ho jayegi.

---

## 🚀 How to Run in Google Sheet (1-Click Run)

1. Apni [Google Sheet](https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit) me **Extensions -> Apps Script** kholein.
2. [google_script.js](file:///d:/antigravity/Darshan%20pass/google_script.js) ka poora code copy karke Apps Script editor me paste karein aur **Save (Ctrl + S)** karein.
3. Top toolbar me function dropdown se **`formatEntireSheet`** select karke **▶ Run** click karein.
4. Top toolbar me function dropdown se **`setupVipDashboard`** select karke **▶ Run** click karein.
