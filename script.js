/**
 * DARSHAN PASS PUBLIC FORM - FRONTEND CONNECTOR
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit
 */

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCRSyNuq_QvPcURMaaXVhqFIcxX5Bdxrf-nDvjhVLGw7wyuB1D-oM6lSVdeG-g7ZiCBQ/exec";

// -------------------------------------------------------------
// 1. DATA DICTIONARY: INDIAN STATES & DISTRICTS
// -------------------------------------------------------------
const indiaLocationData = {
    "Uttar Pradesh": ["Ayodhya", "Mathura", "Varanasi", "Lucknow", "Kanpur Nagar", "Agra", "Prayagraj", "Gorakhpur", "Ghaziabad", "Gautam Buddha Nagar (Noida)", "Aligarh", "Jhansi", "Meerut", "Bareilly", "Moradabad", "Saharanpur", "Muzaffarnagar", "Bijnor", "Rampur", "Shahjahanpur", "Firozabad", "Mainpuri", "Etah", "Hathras", "Kasganj", "Bulandshahr", "Sambhal", "Amroha", "Budaun", "Pilibhit", "Lakhimpur Kheri", "Sitapur", "Hardoi", "Unnao", "Rae Bareli", "Amethi", "Sultanpur", "Pratapgarh", "Fatehpur", "Kaushambi", "Chitrakoot", "Banda", "Hamirpur", "Mahoba", "Jalaun", "Lalitpur", "Farrukhabad", "Kannauj", "Etawah", "Auraiya", "Kanpur Dehat", "Barabanki", "Ambedkar Nagar", "Gonda", "Bahraich", "Shravasti", "Balrampur", "Basti", "Sant Kabir Nagar", "Siddharthnagar", "Maharajganj", "Deoria", "Kushinagar", "Azamgarh", "Mau", "Ballia", "Jaunpur", "Ghazipur", "Chandauli", "Bhadohi", "Mirzapur", "Sonbhadra"],
    "Delhi (NCT)": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
    "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Rohtas", "Saran", "Nalanda", "Begusarai", "Samastipur", "Madhubani", "Vaishali", "East Champaran", "West Champaran", "Sitamarhi", "Gopalganj", "Siwan", "Bhojpur", "Buxar", "Kaimur", "Jehanabad", "Arwal", "Nawada", "Aurangabad", "Jamui", "Banka", "Munger", "Lakhisarai", "Sheikhpura", "Khagaria", "Saharsa", "Madhepura", "Supaul", "Araria", "Kishanganj", "Katihar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Bhilwara", "Sikar", "Pali", "Sri Ganganagar", "Jaisalmer", "Barmer", "Jhunjhunu", "Churu", "Chittorgarh", "Nagaur", "Tonk", "Sawai Madhopur", "Dholpur", "Bundi", "Jhalawar", "Banswara", "Dungarpur", "Rajsamand", "Sirohi", "Pratapgarh", "Hanumangarh", "Karauli", "Dausa"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Satna", "Rewa", "Ratlam", "Chhindwara", "Burhanpur", "Khandwa", "Dewas", "Dhar", "Khargone", "Katni", "Singrauli", "Morena", "Bhind", "Shivpuri", "Vidisha", "Chhatarpur", "Damoh", "Mandsaur", "Neemuch", "Sehore", "Hoshangabad", "Betul", "Balaghat", "Seoni", "Narsinghpur", "Raisen", "Rajgarh"],
    "Maharashtra": ["Mumbai City", "Mumbai Suburban", "Thane", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Navi Mumbai", "Sangli", "Jalgaon", "Akola", "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Nanded", "Satara", "Ratnagiri", "Sindhudurg", "Raigad", "Palghar", "Beed", "Jalna", "Yavatmal", "Buldhana", "Bhandara", "Gondia", "Gadchiroli", "Wardha", "Hingoli", "Washim"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Nadiad", "Morbi", "Mehsana", "Bharuch", "Navsari", "Valsad", "Porbandar", "Amreli", "Surendranagar", "Patan", "Banaskantha", "Sabarkantha", "Panchmahal", "Dahod", "Kheda", "Botad", "Gir Somnath", "Chhota Udaipur", "Devbhumi Dwarka", "Kutch"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Jind", "Jhajjar", "Rewari", "Palwal", "Kaithal", "Kurukshetra", "Fatehabad", "Nuh", "Charkhi Dadri", "Mahendragarh"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Pathankot", "Moga", "Firozpur", "Phagwara", "Kapurthala", "Sangrur", "Barnala", "Faridkot", "Muktsar", "Gurdaspur", "Ropar", "Fatehgarh Sahib", "Mansa", "Fazilka", "Tarn Taran", "Malerkotla"],
    "West Bengal": ["Kolkata", "Howrah", "North 24 Parganas", "South 24 Parganas", "Hooghly", "Darjeeling", "Siliguri", "Asansol", "Durgapur", "Bardhaman", "Murshidabad", "Nadia", "Malda", "Paschim Medinipur", "Purba Medinipur", "Bankura", "Birbhum", "Purulia", "Jalpaiguri", "Cooch Behar", "Kalimpong", "Alipurduar", "Jhargram"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Udham Singh Nagar", "Roorkee", "Rishikesh", "Haldwani", "Almora", "Pauri Garhwal", "Tehri Garhwal", "Pithoragarh", "Chamoli", "Uttarkashi", "Rudraprayag", "Champawat"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Manali", "Kullu", "Mandi", "Solan", "Kangra", "Hamirpur", "Una", "Bilaspur", "Sirmaur", "Chamba", "Lahaul & Spiti", "Kinnaur"],
    "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Rajouri", "Kathua", "Pulwama", "Kupwara", "Budgam", "Ganderbal", "Kulgam", "Bandipora", "Shopian", "Samba", "Reasi", "Poonch", "Doda", "Ramban", "Kishtwar"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh", "Phusro", "Chirkunda", "Medininagar", "Chaibasa", "Dumka"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Durg", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari", "Mahasamund"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur", "Berhampur", "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Bargarh"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Rajamahendravaram", "Tirupati", "Kadapa", "Anantapur", "Eluru", "Vizianagaram", "Machilipatnam", "Chittoor"],
    "Karnataka": ["Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Vijayapura", "Shivamogga", "Tumakuru", "Hassan", "Udupi"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Tirunelveli", "Thoothukudi", "Nagercoil", "Thanjavur", "Dindigul", "Kanchipuram"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur", "Alappuzha", "Kottayam", "Palakkad", "Malappuram", "Pathanamthitta", "Idukki", "Wayanad", "Kasaragod"],
    "Goa": ["North Goa", "South Goa", "Panaji", "Margao", "Vasco da Gama"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
    "Chandigarh": ["Chandigarh"],
    "Ladakh": ["Leh", "Kargil"],
    "Tripura": ["Agartala", "West Tripura", "South Tripura", "North Tripura"],
    "Meghalaya": ["Shillong", "East Khasi Hills", "West Khasi Hills", "Garo Hills"],
    "Manipur": ["Imphal East", "Imphal West", "Churachandpur", "Thoubal"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "East Siang", "West Kameng"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
    "Andaman & Nicobar Islands": ["Port Blair", "South Andaman", "North & Middle Andaman", "Nicobar"],
    "Dadra & Nagar Haveli and Daman & Diu": ["Daman", "Diu", "Silvassa"],
    "Lakshadweep": ["Kavaratti", "Agatti", "Amini"]
};

// -------------------------------------------------------------
// 2. WORLD COUNTRIES LIST
// -------------------------------------------------------------
const worldCountries = [
    "Nepal", "United States", "United Kingdom", "Canada", "Australia", "Mauritius", 
    "Singapore", "Malaysia", "United Arab Emirates", "Sri Lanka", "Fiji", "New Zealand", 
    "Germany", "France", "Japan", "South Africa", "Thailand", "Netherlands", "Switzerland", 
    "Italy", "Spain", "Russia", "Indonesia", "Myanmar", "Bhutan", "Bangladesh", "Kenya", 
    "Tanzania", "Oman", "Qatar", "Kuwait", "Bahrain", "Saudi Arabia", "Guyana", 
    "Trinidad and Tobago", "Suriname", "South Korea", "Vietnam", "Philippines", "Brazil", 
    "Argentina", "Mexico", "Egypt", "Nigeria", "Sweden", "Norway", "Denmark", "Finland", 
    "Austria", "Belgium", "Greece", "Ireland", "Portugal", "Poland", "Czech Republic", 
    "Hungary", "Romania", "Israel", "Jordan", "Turkey", "Ukraine", "Kazakhstan", "Other"
];

// SAFE ELEMENT GETTER HELPER
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

// -------------------------------------------------------------
// SAFE JWT DECODER & GLOBAL GOOGLE GIS CREDENTIAL CALLBACK
// -------------------------------------------------------------
function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.warn("UTF-8 URI decode fallback...", err);
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64));
        } catch (e2) {
            console.error("JWT parse error completely:", e2);
            return null;
        }
    }
}

function unlockFormScreen(name, email) {
    const googleAuthLock = document.getElementById("google-auth-lock");
    if (googleAuthLock) googleAuthLock.classList.add("hidden");

    const displayUserName = document.getElementById("display-user-name");
    const displayUserEmail = document.getElementById("display-user-email");
    const googleSignedIn = document.getElementById("google-signed-in");
    const googleLoginPrompt = document.getElementById("google-login-prompt");

    if (displayUserName) displayUserName.textContent = name || "Google User";
    if (displayUserEmail) displayUserEmail.textContent = email || "";
    if (googleSignedIn) googleSignedIn.classList.remove("hidden");
    if (googleLoginPrompt) googleLoginPrompt.classList.add("hidden");
}

window.handleCredentialResponse = function(response) {
    if (response && response.credential) {
        const payload = parseJwt(response.credential);
        if (payload) {
            const name = payload.name || payload.given_name || "Google Devotee";
            const email = payload.email || (name.toLowerCase().replace(/\s+/g, '') + "@gmail.com");

            localStorage.setItem("darshan_submitter_name", name);
            localStorage.setItem("darshan_submitter_email", email);

            unlockFormScreen(name, email);
        } else {
            console.warn("Could not parse credential payload, using default login.");
            localStorage.setItem("darshan_submitter_name", "Google User");
            localStorage.setItem("darshan_submitter_email", "user@gmail.com");
            unlockFormScreen("Google User", "user@gmail.com");
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // DOM ELEMENTS
    // -------------------------------------------------------------
    const form = document.getElementById("darshan-form");
    const visitDateInput = document.getElementById("visitDate");
    const visitSlotSelect = document.getElementById("visitSlot");
    const nationalitySelect = document.getElementById("nationality");
    const countryGroup = document.getElementById("country-group");
    const countrySelect = document.getElementById("countrySelect");
    const indiaLocationGrid = document.getElementById("india-location-grid");
    const stateSelect = document.getElementById("stateSelect");
    const districtSelect = document.getElementById("districtSelect");
    const idLabelText = document.getElementById("id-label-text");
    const idNumberInput = document.getElementById("idNumber");

    const nameAgeInput = document.getElementById("nameAge");
    const maleCountInput = document.getElementById("maleCount");
    const femaleCountInput = document.getElementById("femaleCount");
    const mobileInput = document.getElementById("mobile");
    const vehicleNoInput = document.getElementById("vehicleNo");
    const accompanyingInput = document.getElementById("accompanying");

    const referredBySelect = document.getElementById("referredBySelect");
    const otherRefGroup = document.getElementById("other-ref-group");
    const otherRefNameInput = document.getElementById("otherRefName");

    const submitBtn = document.getElementById("submit-btn");
    const btnText = submitBtn ? submitBtn.querySelector(".btn-text") : null;
    const btnLoader = submitBtn ? submitBtn.querySelector(".btn-loader") : null;

    const successModal = document.getElementById("success-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const submitAnotherBtn = document.getElementById("submit-another-btn");

    // GOOGLE ACCOUNT & LOCK OVERLAY ELEMENTS
    const googleAuthLock = document.getElementById("google-auth-lock");
    const googleSignedIn = document.getElementById("google-signed-in");
    const googleLoginPrompt = document.getElementById("google-login-prompt");
    const displayUserName = document.getElementById("display-user-name");
    const displayUserEmail = document.getElementById("display-user-email");
    const submitterNameInput = document.getElementById("submitterNameInput");
    const submitterEmailInput = document.getElementById("submitterEmailInput");
    const saveAccountBtn = document.getElementById("save-account-btn");
    const changeAccountBtn = document.getElementById("change-account-btn");

    function checkAuthLock() {
        const savedName = localStorage.getItem("darshan_submitter_name");
        const savedEmail = localStorage.getItem("darshan_submitter_email");

        if (savedName && savedEmail) {
            if (googleAuthLock) googleAuthLock.classList.add("hidden");
        } else {
            if (googleAuthLock) googleAuthLock.classList.remove("hidden");
        }
    }

    window.updateGoogleAccountUI = function() {
        const savedName = localStorage.getItem("darshan_submitter_name");
        const savedEmail = localStorage.getItem("darshan_submitter_email");

        if (savedName && savedEmail) {
            if (displayUserName) displayUserName.textContent = savedName;
            if (displayUserEmail) displayUserEmail.textContent = savedEmail;
            if (googleSignedIn) googleSignedIn.classList.remove("hidden");
            if (googleLoginPrompt) googleLoginPrompt.classList.add("hidden");
            if (googleAuthLock) {
                googleAuthLock.style.display = "none";
                googleAuthLock.classList.add("hidden");
            }
        } else {
            if (googleSignedIn) googleSignedIn.classList.add("hidden");
            if (googleLoginPrompt) googleLoginPrompt.classList.remove("hidden");
            if (googleAuthLock) {
                googleAuthLock.style.display = "flex";
                googleAuthLock.classList.remove("hidden");
            }
        }
    };
    const updateGoogleAccountUI = window.updateGoogleAccountUI;

    if (saveAccountBtn) {
        saveAccountBtn.addEventListener("click", () => {
            const nameVal = getVal("submitterNameInput");
            const emailVal = getVal("submitterEmailInput");

            const isNameValid = nameVal && nameVal.trim().length >= 2;
            const isEmailValid = emailVal && emailVal.includes("@") && emailVal.includes(".");

            markGroup(submitterNameInput, isNameValid);
            markGroup(submitterEmailInput, isEmailValid);

            if (isNameValid && isEmailValid) {
                localStorage.setItem("darshan_submitter_name", nameVal.trim());
                localStorage.setItem("darshan_submitter_email", emailVal.trim());
                updateGoogleAccountUI();
            }
        });
    }

    if (changeAccountBtn) {
        changeAccountBtn.addEventListener("click", () => {
            if (googleSignedIn) googleSignedIn.classList.add("hidden");
            if (googleLoginPrompt) googleLoginPrompt.classList.remove("hidden");
            if (googleAuthLock) googleAuthLock.classList.remove("hidden");
            if (lockNameInput) lockNameInput.value = localStorage.getItem("darshan_submitter_name") || "";
            if (lockEmailInput) lockEmailInput.value = localStorage.getItem("darshan_submitter_email") || "";
            if (lockNameInput) lockNameInput.focus();
        });
    }

    checkAuthLock();
    updateGoogleAccountUI();

    if (visitDateInput) {
        const todayStr = new Date().toISOString().split("T")[0];
        visitDateInput.setAttribute("min", todayStr);
    }

    // -------------------------------------------------------------
    // POPULATE INITIAL DROPDOWNS
    // -------------------------------------------------------------
    if (stateSelect) {
        Object.keys(indiaLocationData).sort().forEach(state => {
            const option = document.createElement("option");
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    }

    if (countrySelect) {
        worldCountries.forEach(country => {
            const option = document.createElement("option");
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
    }

    // -------------------------------------------------------------
    // DYNAMIC LOCATION LISTENERS
    // -------------------------------------------------------------
    if (stateSelect && districtSelect) {
        stateSelect.addEventListener("change", () => {
            const selectedState = stateSelect.value;
            districtSelect.innerHTML = '<option value="">-- Select District --</option>';

            if (selectedState && indiaLocationData[selectedState]) {
                districtSelect.disabled = false;
                indiaLocationData[selectedState].sort().forEach(district => {
                    const opt = document.createElement("option");
                    opt.value = district;
                    opt.textContent = district;
                    districtSelect.appendChild(opt);
                });
                const otherOpt = document.createElement("option");
                otherOpt.value = "Other District";
                otherOpt.textContent = "Other / Not Listed";
                districtSelect.appendChild(otherOpt);
            } else {
                districtSelect.disabled = true;
                districtSelect.innerHTML = '<option value="">-- Select State First --</option>';
            }
        });
    }

    if (nationalitySelect) {
        nationalitySelect.addEventListener("change", () => {
            const isIndia = nationalitySelect.value === "India";

            if (isIndia) {
                if (indiaLocationGrid) indiaLocationGrid.classList.remove("hidden");
                if (countryGroup) countryGroup.classList.add("hidden");
                
                if (stateSelect) stateSelect.required = true;
                if (districtSelect) districtSelect.required = true;
                if (countrySelect) countrySelect.required = false;

                if (idLabelText) idLabelText.textContent = "Aadhaar / Passport No / आधार नं0 / पासपोर्ट नं0";
                if (idNumberInput) idNumberInput.placeholder = "Enter 12-digit Aadhaar No. or Passport No.";
            } else {
                if (indiaLocationGrid) indiaLocationGrid.classList.add("hidden");
                if (countryGroup) countryGroup.classList.remove("hidden");

                if (stateSelect) stateSelect.required = false;
                if (districtSelect) districtSelect.required = false;
                if (countrySelect) countrySelect.required = true;

                if (idLabelText) idLabelText.textContent = "Passport Number (Mandatory for International)";
                if (idNumberInput) idNumberInput.placeholder = "Enter Passport Number (E.g. Z1234567)";
            }
        });
    }

    if (referredBySelect && otherRefGroup) {
        referredBySelect.addEventListener("change", () => {
            if (referredBySelect.value === "Other") {
                otherRefGroup.classList.remove("hidden");
                if (otherRefNameInput) {
                    otherRefNameInput.required = true;
                    otherRefNameInput.focus();
                }
            } else {
                otherRefGroup.classList.add("hidden");
                if (otherRefNameInput) {
                    otherRefNameInput.required = false;
                    otherRefNameInput.value = "";
                }
            }
        });
    }

    // -------------------------------------------------------------
    // VALIDATION HELPERS
    // -------------------------------------------------------------
    const mobileRegex = /^[0-9+\s-]{8,15}$/;

    function markGroup(input, isValid) {
        if (!input) return isValid;
        const group = input.closest(".input-group");
        if (group) {
            if (isValid) {
                group.classList.remove("invalid");
                group.classList.add("valid");
            } else {
                group.classList.remove("valid");
                group.classList.add("invalid");
            }
        }
        return isValid;
    }

    // -------------------------------------------------------------
    // UNSTOPPABLE TRANSMISSION PIPELINE
    // -------------------------------------------------------------
    async function sendDataUnstoppable(formData) {
        const payloadStr = JSON.stringify(formData);

        try {
            await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain" },
                body: payloadStr
            });
        } catch (fetchErr) {
            console.warn("Fetch failed, initiating Navigator Beacon fallback...", fetchErr);
            try {
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(GOOGLE_APPS_SCRIPT_URL, payloadStr);
                }
            } catch (beaconErr) {
                console.error("Beacon fallback also failed:", beaconErr);
            }
        }
    }

    function resetFormState() {
        if (form) form.reset();
        if (districtSelect) {
            districtSelect.disabled = true;
            districtSelect.innerHTML = '<option value="">-- Select State First --</option>';
        }
        if (nationalitySelect) {
            nationalitySelect.value = "India";
            nationalitySelect.dispatchEvent(new Event("change"));
        }
        if (referredBySelect) {
            referredBySelect.dispatchEvent(new Event("change"));
        }
        document.querySelectorAll(".input-group").forEach(g => g.classList.remove("valid", "invalid"));
    }

    // -------------------------------------------------------------
    // FORM SUBMIT HANDLER
    // -------------------------------------------------------------
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const natVal = getVal("nationality") || "India";
            const isIndia = natVal === "India";

            // Safe validation checks
            const isDateValid = visitDateInput ? markGroup(visitDateInput, visitDateInput.value !== "") : true;
            const isSlotValid = visitSlotSelect ? markGroup(visitSlotSelect, visitSlotSelect.value !== "") : true;
            const isNameAgeValid = nameAgeInput ? markGroup(nameAgeInput, nameAgeInput.value.trim().length >= 2) : true;
            const isIdValid = idNumberInput ? markGroup(idNumberInput, idNumberInput.value.trim().length >= 4) : true;
            const isMobileValid = mobileInput ? markGroup(mobileInput, mobileRegex.test(mobileInput.value.trim())) : true;
            const isAccompanyingValid = accompanyingInput ? markGroup(accompanyingInput, accompanyingInput.value.trim().length >= 2) : true;

            let isLocationValid = true;
            if (isIndia) {
                const isStateValid = stateSelect ? markGroup(stateSelect, stateSelect.value !== "") : true;
                const isDistrictValid = districtSelect ? markGroup(districtSelect, districtSelect.value !== "") : true;
                isLocationValid = isStateValid && isDistrictValid;
            } else {
                const isCountryValid = countrySelect ? markGroup(countrySelect, countrySelect.value !== "") : true;
                isLocationValid = isCountryValid;
            }

            const mVal = parseInt(getVal("maleCount")) || 0;
            const fVal = parseInt(getVal("femaleCount")) || 0;
            const totalCount = mVal + fVal;
            const isCountValid = totalCount > 0 && totalCount <= 8;
            if (maleCountInput) markGroup(maleCountInput, isCountValid);

            const isRefValid = referredBySelect ? markGroup(referredBySelect, referredBySelect.value !== "") : true;
            let isOtherRefValid = true;
            if (referredBySelect && referredBySelect.value === "Other" && otherRefNameInput) {
                isOtherRefValid = markGroup(otherRefNameInput, otherRefNameInput.value.trim().length >= 2);
            }

            // Validate and extract Submitter Account
            let subName = localStorage.getItem("darshan_submitter_name") || "";
            let subEmail = localStorage.getItem("darshan_submitter_email") || "";

            if (!subName || !subEmail) {
                const inputName = getVal("submitterNameInput");
                const inputEmail = getVal("submitterEmailInput");

                const isNameValid = inputName && inputName.length >= 2;
                const isEmailValid = inputEmail && inputEmail.includes("@") && inputEmail.includes(".");

                if (!isNameValid || !isEmailValid) {
                    if (googleLoginPrompt) googleLoginPrompt.classList.remove("hidden");
                    if (googleSignedIn) googleSignedIn.classList.add("hidden");

                    if (!isNameValid && submitterNameInput) {
                        markGroup(submitterNameInput, false);
                        submitterNameInput.focus();
                    } else if (!isEmailValid && submitterEmailInput) {
                        markGroup(submitterEmailInput, false);
                        submitterEmailInput.focus();
                    }
                    return;
                }

                subName = inputName;
                subEmail = inputEmail;
                localStorage.setItem("darshan_submitter_name", subName);
                localStorage.setItem("darshan_submitter_email", subEmail);
                updateGoogleAccountUI();
            }

            if (!isDateValid || !isSlotValid || !isNameAgeValid || !isIdValid || !isMobileValid || !isAccompanyingValid || !isLocationValid || !isCountValid || !isRefValid || !isOtherRefValid) {
                const firstInvalid = form.querySelector(".input-group.invalid input, .input-group.invalid select, .input-group.invalid textarea");
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            setSubmittingState(true);

            // Format Visit DateTime string
            const dateVal = getVal("visitDate");
            const slotVal = getVal("visitSlot");
            const formattedVisitDateTime = `${dateVal} (${slotVal})`;

            let finalState = "";
            let finalDistrict = "";

            if (isIndia) {
                finalState = getVal("stateSelect");
                finalDistrict = getVal("districtSelect");
            } else {
                finalState = (getVal("countrySelect") || "International");
                finalDistrict = "International";
            }

            let finalReferredBy = getVal("referredBySelect");
            if (finalReferredBy === "Other" && getVal("otherRefName")) {
                finalReferredBy = "Other: " + getVal("otherRefName");
            }

            // Construct Unstoppable 13-Column Payload
            const formData = {
                visitDateTime: formattedVisitDateTime,
                nameAge: getVal("nameAge"),
                state: finalState,
                district: finalDistrict,
                idNumber: getVal("idNumber"),
                maleCount: mVal,
                femaleCount: fVal,
                mobile: getVal("mobile"),
                vehicleNo: getVal("vehicleNo"),
                accompanying: getVal("accompanying"),
                referredBy: finalReferredBy,
                submitterName: subName,
                submitterEmail: subEmail
            };

            // Transmit Data via Unstoppable Pipeline
            await sendDataUnstoppable(formData);

            // Display Success Modal
            if (successModal) successModal.classList.remove("hidden");

            setSubmittingState(false);
        });
    }

    function setSubmittingState(isSubmitting) {
        if (!submitBtn) return;
        if (isSubmitting) {
            submitBtn.disabled = true;
            if (btnText) btnText.classList.add("hidden");
            if (btnLoader) btnLoader.classList.remove("hidden");
        } else {
            submitBtn.disabled = false;
            if (btnText) btnText.classList.remove("hidden");
            if (btnLoader) btnLoader.classList.add("hidden");
        }
    }

    const govFormCard = document.querySelector(".gov-form-card");
    const formClosedCard = document.getElementById("form-closed-card");
    const reopenFormBtn = document.getElementById("reopen-form-btn");

    function openNewForm() {
        if (successModal) successModal.classList.add("hidden");
        if (formClosedCard) formClosedCard.classList.add("hidden");
        if (govFormCard) govFormCard.classList.remove("hidden");
        resetFormState();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (visitDateInput) visitDateInput.focus();
    }

    function closeFormSession() {
        if (successModal) successModal.classList.add("hidden");
        if (govFormCard) govFormCard.classList.add("hidden");
        if (formClosedCard) formClosedCard.classList.remove("hidden");
        resetFormState();
    }

    // Modal Close Handler ("बंद करें")
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeFormSession);
    }

    if (successModal) {
        successModal.addEventListener("click", (e) => {
            if (e.target === successModal) {
                closeFormSession();
            }
        });
    }

    // Submit Another Form Handler
    if (submitAnotherBtn) {
        submitAnotherBtn.addEventListener("click", openNewForm);
    }

    // Reopen Form Handler from Closed Screen
    if (reopenFormBtn) {
        reopenFormBtn.addEventListener("click", openNewForm);
    }

    // -------------------------------------------------------------
    // VOICE TYPING (SPEECH TO TEXT) HANDLER
    // -------------------------------------------------------------
    function setupVoiceTyping() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported in this browser.");
            return;
        }

        document.querySelectorAll(".voice-mic-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute("data-target");
                const targetInput = document.getElementById(targetId);
                if (!targetInput) return;

                const recognition = new SpeechRecognition();
                recognition.lang = "hi-IN"; // Set Hindi speech recognition
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;

                btn.classList.add("listening");
                btn.innerHTML = '<i class="fa-solid fa-microphone-lines fa-beat" style="color: #ef4444;"></i>';

                recognition.start();

                recognition.onresult = (event) => {
                    const speechResult = event.results[0][0].transcript;
                    if (targetInput.tagName === "TEXTAREA") {
                        targetInput.value += (targetInput.value ? "\n" : "") + speechResult;
                    } else {
                        targetInput.value = speechResult;
                    }
                    btn.classList.remove("listening");
                    btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
                };

                recognition.onerror = (event) => {
                    console.error("Speech recognition error:", event.error);
                    btn.classList.remove("listening");
                    btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
                };

                recognition.onend = () => {
                    btn.classList.remove("listening");
                    btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
                };
            });
        });
    }

    // -------------------------------------------------------------
    // DROPDOWN SEARCH FILTER HANDLER
    // -------------------------------------------------------------
    function setupSelectSearch() {
        document.querySelectorAll(".select-search-box").forEach(searchInput => {
            searchInput.addEventListener("input", () => {
                const selectId = searchInput.getAttribute("data-select");
                const selectEl = document.getElementById(selectId);
                if (!selectEl) return;

                const query = searchInput.value.toLowerCase().trim();
                let matchedIndex = -1;

                Array.from(selectEl.options).forEach((opt, idx) => {
                    if (idx === 0) return; // Skip placeholder
                    const text = opt.textContent.toLowerCase();
    // -------------------------------------------------------------
    // SEARCHABLE DROPDOWN POPUP MODAL HANDLER
    // -------------------------------------------------------------
    function setupSelectSearchModal() {
        const searchModal = document.getElementById("search-select-modal");
        const searchTitle = document.getElementById("search-modal-title");
        const searchInput = document.getElementById("search-modal-input");
        const optionsList = document.getElementById("search-modal-options-list");
        const closeBtn = document.getElementById("close-search-modal-btn");

        if (!searchModal || !searchInput || !optionsList) return;

        let activeSelect = null;

        function closeSearchModal() {
            searchModal.classList.add("hidden");
            searchInput.value = "";
            activeSelect = null;
        }

        if (closeBtn) closeBtn.addEventListener("click", closeSearchModal);
        searchModal.addEventListener("click", (e) => {
            if (e.target === searchModal) closeSearchModal();
        });

        const searchableIds = ["stateSelect", "districtSelect", "referredBySelect", "countrySelect"];

        searchableIds.forEach(id => {
            const selectEl = document.getElementById(id);
            if (!selectEl) return;

            const wrapper = selectEl.closest(".searchable-select-wrapper") || selectEl.parentElement;

            function openSearchModalForSelect(e) {
                if (selectEl.disabled) return;
                e.preventDefault();
                e.stopPropagation();

                activeSelect = selectEl;
                const label = selectEl.closest(".input-group") ? selectEl.closest(".input-group").querySelector(".input-label") : null;
                const labelText = label ? label.textContent.split("/")[0].replace("*", "").trim() : "चयन करें";
                searchTitle.textContent = labelText + " (सर्च करें)";

                searchInput.value = "";
                renderOptions("");
                searchModal.classList.remove("hidden");
                setTimeout(() => searchInput.focus(), 100);
            }

            selectEl.addEventListener("mousedown", openSearchModalForSelect);
            if (wrapper) {
                wrapper.addEventListener("click", openSearchModalForSelect);
            }
        });

        function renderOptions(filterText) {
            if (!activeSelect || !optionsList) return;
            optionsList.innerHTML = "";

            const query = filterText.toLowerCase().trim();
            const options = Array.from(activeSelect.options);

            options.forEach(opt => {
                const val = opt.value;
                const text = opt.textContent;

                if (query !== "" && !text.toLowerCase().includes(query)) return;

                const item = document.createElement("div");
                item.className = "search-option-item" + (val === activeSelect.value && val !== "" ? " selected" : "");
                item.textContent = text;

                item.addEventListener("click", () => {
                    activeSelect.value = val;
                    activeSelect.dispatchEvent(new Event("change"));
                    markGroup(activeSelect, val !== "");
                    closeSearchModal();
                });

                optionsList.appendChild(item);
            });

            if (optionsList.children.length === 0) {
                const emptyItem = document.createElement("div");
                emptyItem.className = "search-option-item";
                emptyItem.style.color = "#94a3b8";
                emptyItem.style.cursor = "default";
                emptyItem.textContent = "कोई विकल्प नहीं मिला (No match found)";
                optionsList.appendChild(emptyItem);
            }
        }

        searchInput.addEventListener("input", () => {
            renderOptions(searchInput.value);
        });
    }

    // Initialize Voice Typing and Searchable Select Modal
    setupVoiceTyping();
    setupSelectSearchModal();
});
