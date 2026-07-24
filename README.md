# 🛕 दर्शन पास पंजीकरण पोर्टल (Darshan Pass Public Form)

Aapki Google Sheet link: [https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit](https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit)

---

## 📊 Exact Google Sheet Columns (Row 1 Headers)

Apni Google Sheet ke **Row 1** me exact in 11 columns ko set karein:

| Col # | Exact Column Header |
| :--- | :--- |
| **A1** | `Timestamp` |
| **B1** | `दर्शन हेतु आने का दिनाँक व समय` |
| **C1** | `नाम व उम्र` |
| **D1** | `राज्य` |
| **E1** | `जिला` |
| **F1** | `आधार नं0/पासपोर्ट नं0` |
| **G1** | `दर्शन हेतु पुरूषो (M) व महिलाओं (F) की अलग - अलग संख्या` |
| **H1** | `मो0नं0` |
| **I1** | `गाडी नं0` |
| **J1** | `साथ में आने वाले सभी दर्शनार्थियों के नाम व उम्र` |
| **K1** | `Referred by` |

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Google Sheet Apps Script Deploy Karein
1. Apni [Google Sheet](https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit) kholein.
2. Upar menu me **Extensions** -> **Apps Script** par click karein.
3. [google_script.js](file:///d:/antigravity/Darshan%20pass/google_script.js) ka poora code copy karke editor me paste karein aur **Save (Ctrl + S)** karein.
4. Top right corner par **Deploy** -> **New Deployment**:
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone** *(⚠️ Bohat zaroori hai)*
5. **Deploy** button dabayein, Google account permissions allow karein, aur **Web App URL** copy kar lein.

### Step 2: `script.js` Update Karein
- [script.js](file:///d:/antigravity/Darshan%20pass/script.js) kholein aur Line 7 par `GOOGLE_APPS_SCRIPT_URL` ki jagah copied URL paste kar dein.

### Step 3: Custom Domain Deploy Karein
- [Vercel](https://vercel.com) ya [Netlify](https://netlify.com) par free account banayein.
- Apne project folder (`d:\antigravity\Darshan pass`) ko upload karke Custom Domain (A Record / CNAME) add kar dein!
