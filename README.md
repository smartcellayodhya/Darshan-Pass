# 🛕 दर्शन पास पंजीकरण पोर्टल (Darshan Pass Public Form)

Aapki Google Sheet link: [https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit](https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit)

---

## 📊 Google Sheet 19-Column Structure (Row 1 Headers & Status System)

| Col # | Column Header | Descriptions & Automatic Behaviors |
| :--- | :--- | :--- |
| **A1** | `Timestamp` | Form submit hone ka samay (dd/mm/yyyy hh:mm:ss) |
| **B1** | `दर्शन तिथि` | Visit Date (DD/MM/YYYY) |
| **C1** | `दर्शन समय स्लॉट` | Visit Time Slot (07:00 AM - 09:00 AM) |
| **D1** | `नाम व उम्र` | Devotee Name & Age |
| **E1** | `राज्य` | State |
| **F1** | `जिला` | District |
| **G1** | `आधार नं0/पासपोर्ट नं0` | Govt ID Number |
| **H1** | `पुरूषो व महिलाओं की संख्या` | Gender Counts (Text) |
| **I1** | `मो0नं0` | Mobile Number |
| **J1** | `गाडी नं0` | Vehicle Number |
| **K1** | `साथ में आने वाले सदस्यों के नाम व उम्र` | Accompanying Devotees |
| **L1** | `Referred by` | Reference Officer Name |
| **M1** | `आवेदनकर्ता गूगल नाम` | Google Submitter Name |
| **N1** | `आवेदनकर्ता ईमेल ID` | Google Submitter Email |
| **O1** | `कुल दर्शनार्थी संख्या` | Total Devotees (Numeric SUM) |
| **P1** | `पुरुष संख्या` | Male Count |
| **Q1** | `महिला संख्या` | Female Count |
| **R1** | `पास स्थिति (Pass Status)` | **Dropdown:** `Pending` / `Pass Created` / `Rejected` |
| **S1** | `पास बनने की तिथि (Pass Created Date)` | **Auto-filled:** Jise din status `Pass Created` set hoga, us din ki date automatic fill ho jayegi. |

---

## 🟢 Automatic Light Green Highlight & Pass Created Date System

1. **Light Green Row Highlight:**
   - Jab aap ya aapki team Google Sheet me Column R (`पास स्थिति`) ko **`Pass Created`** select karegi:
     - Poori Row **Light Green** (`#dcfce7`) se fill ho jayegi.
     - Column S (`पास बनने की तिथि`) me aaj ki तारीख (Date) apne-aap fill ho jayegi!
2. **Rejected Status:**
   - Status **`Rejected`** karne par poori Row Light Red (`#fee2e2`) ho jayegi.
3. **Pending Status:**
   - Naye aavedan hamesha **`Pending`** status ke saath aayenge aur row normal rahegi.

---

## 🚀 How to Apply / Update in Google Sheet

1. Apni [Google Sheet](https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit) kholein.
2. Menu me **Extensions** -> **Apps Script** par click karein.
3. [google_script.js](file:///d:/antigravity/Darshan%20pass/google_script.js) ka poora code copy karke Editor me paste karein aur **Save (Ctrl + S)** karein.
4. Top Right corner me **Deploy** -> **New Deployment** (ya Manage Deployments -> Edit -> New Version) karke Deploy karein.
5. Google Sheet kholein aur top menu bar me **⚙️ VIP Tools** menu dikhega:
   - **`🎯 Setup Status, Format & Apply Highlighting`** par click karein -> Ye 19 columns, Dropdown aur Conditional Light Green highlighting set kar dega.
   - **`📊 Generate VIP Dashboard`** par click karein -> Ye **`📊 VIP Dashboard`** tab me Date-wise **Pass Created vs Form Submitted** report & chart ready kar dega!
