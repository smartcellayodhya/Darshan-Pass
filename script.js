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
    const displayUserName = document.getElementById("display-user-name");
    const displayUserEmail = document.getElementById("display-user-email");
    const changeAccountBtn = document.getElementById("change-account-btn");

    function checkAuthLock() {
        const savedName = localStorage.getItem("darshan_submitter_name");
        const savedEmail = localStorage.getItem("darshan_submitter_email");

        if (savedName && savedEmail) {
            if (googleAuthLock) {
                googleAuthLock.style.display = "none";
                googleAuthLock.classList.add("hidden");
            }
        } else {
            if (googleAuthLock) {
                googleAuthLock.style.display = "flex";
                googleAuthLock.classList.remove("hidden");
            }
        }
    }

    window.updateGoogleAccountUI = function() {
        const savedName = localStorage.getItem("darshan_submitter_name");
        const savedEmail = localStorage.getItem("darshan_submitter_email");

        if (savedName && savedEmail) {
            if (displayUserName) displayUserName.textContent = savedName;
            if (displayUserEmail) displayUserEmail.textContent = savedEmail;
            if (googleSignedIn) googleSignedIn.classList.remove("hidden");
            if (googleAuthLock) {
                googleAuthLock.style.display = "none";
                googleAuthLock.classList.add("hidden");
            }
        } else {
            if (googleSignedIn) googleSignedIn.classList.add("hidden");
            if (googleAuthLock) {
                googleAuthLock.style.display = "flex";
                googleAuthLock.classList.remove("hidden");
            }
        }
    };
    const updateGoogleAccountUI = window.updateGoogleAccountUI;

    if (changeAccountBtn) {
        changeAccountBtn.addEventListener("click", () => {
            localStorage.removeItem("darshan_submitter_name");
            localStorage.removeItem("darshan_submitter_email");
            if (googleSignedIn) googleSignedIn.classList.add("hidden");
            if (googleAuthLock) {
                googleAuthLock.style.display = "flex";
                googleAuthLock.classList.remove("hidden");
            }
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

            // Dispatch change event to update custom searchable dropdown
            districtSelect.dispatchEvent(new Event("change"));
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
    // VALIDATION HELPERS & LIVE INPUT SANITIZERS
    // -------------------------------------------------------------
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

    // 1. Mobile Number: Strictly 10 Digits
    if (mobileInput) {
        const cleanMobile = () => {
            mobileInput.value = mobileInput.value.replace(/\D/g, '').slice(0, 10);
        };
        mobileInput.addEventListener("input", cleanMobile);
        mobileInput.addEventListener("paste", () => setTimeout(cleanMobile, 10));
    }

    // 2. Vehicle Number: No symbols at all, Automatic Uppercase
    if (vehicleNoInput) {
        const cleanVehicle = () => {
            vehicleNoInput.value = vehicleNoInput.value.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
        };
        vehicleNoInput.addEventListener("input", cleanVehicle);
        vehicleNoInput.addEventListener("paste", () => setTimeout(cleanVehicle, 10));
    }

    // 3. Name, Accompanying & Other Ref Name: NO SYMBOLS EXCEPT DOT (.)
    const dotOnlyInputs = [nameAgeInput, accompanyingInput, otherRefNameInput];
    dotOnlyInputs.forEach(inputEl => {
        if (!inputEl) return;
        const cleanDotOnly = () => {
            inputEl.value = inputEl.value.replace(/[^a-zA-Z0-9\u0900-\u097F\u0966-\u096F\s.\r\n]/g, '');
        };
        inputEl.addEventListener("input", cleanDotOnly);
        inputEl.addEventListener("paste", () => setTimeout(cleanDotOnly, 10));
    });

    // 4. ID Number (Aadhaar / Passport): Alphanumeric Uppercase, Max 12 chars
    if (idNumberInput) {
        const cleanId = () => {
            let val = idNumberInput.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            idNumberInput.value = val.slice(0, 12);
        };
        idNumberInput.addEventListener("input", cleanId);
        idNumberInput.addEventListener("paste", () => setTimeout(cleanId, 10));
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
            
            // Primary Devotee Name & Age validation (Must contain at least 1 number/digit for Age)
            let isNameAgeValid = false;
            if (nameAgeInput) {
                const nVal = nameAgeInput.value.trim();
                const hasAgeDigit = /\d/.test(nVal);
                const nameErrorEl = document.getElementById("nameAge-error");

                if (nVal.length < 2) {
                    isNameAgeValid = false;
                    if (nameErrorEl) nameErrorEl.textContent = "कृपया अपना नाम एवं उम्र दर्ज करें (उदा: Rahul 35 Yrs)";
                } else if (!hasAgeDigit) {
                    isNameAgeValid = false;
                    if (nameErrorEl) nameErrorEl.textContent = "कृपया नाम के साथ उम्र (संख्या) भी लिखें (उदा: Rahul 35 Yrs)";
                } else {
                    isNameAgeValid = true;
                }
                markGroup(nameAgeInput, isNameAgeValid);
            } else {
                isNameAgeValid = true;
            }
            
            // ID Number validation (12 digits Aadhaar OR valid Passport number)
            let isIdValid = false;
            if (idNumberInput) {
                const idVal = idNumberInput.value.trim().toUpperCase();
                const idErrorEl = document.getElementById("idNumber-error");

                if (isIndia) {
                    if (/^\d+$/.test(idVal)) {
                        // Pure numeric: MUST BE STRICTLY 12 DIGITS FOR AADHAAR
                        isIdValid = idVal.length === 12;
                        if (idErrorEl && !isIdValid) {
                            idErrorEl.textContent = "आधार नंबर strictly 12 अंकों का होना अनिवार्य है";
                        }
                    } else if (idVal.length >= 6 && idVal.length <= 12) {
                        // Passport number (Alphanumeric)
                        isIdValid = /^[A-Z0-9]{6,12}$/.test(idVal);
                        if (idErrorEl && !isIdValid) {
                            idErrorEl.textContent = "मान्य 12-अंकों का आधार नंबर या पासपोर्ट नंबर दर्ज करें";
                        }
                    } else {
                        isIdValid = false;
                        if (idErrorEl) {
                            idErrorEl.textContent = "आधार नंबर 12 अंकों का या मान्य पासपोर्ट नंबर दर्ज करें";
                        }
                    }
                } else {
                    // International Passport
                    isIdValid = /^[A-Z0-9]{6,12}$/.test(idVal);
                    if (idErrorEl && !isIdValid) {
                        idErrorEl.textContent = "Please enter a valid Passport Number (6-12 alphanumeric)";
                    }
                }
                markGroup(idNumberInput, isIdValid);
            } else {
                isIdValid = true;
            }

            // Mobile validation: Must be strictly 10 digits
            const mobVal = mobileInput ? mobileInput.value.trim() : "";
            const isMobileValid = mobileInput ? markGroup(mobileInput, /^\d{10}$/.test(mobVal)) : true;

            // Accompanying devotees validation (Must contain at least 1 number/digit for Age)
            let isAccompanyingValid = false;
            if (accompanyingInput) {
                const accVal = accompanyingInput.value.trim();
                const hasAccAgeDigit = /\d/.test(accVal);
                const accErrorEl = document.getElementById("accompanying-error");

                if (accVal.length < 2) {
                    isAccompanyingValid = false;
                    if (accErrorEl) accErrorEl.textContent = "कृपया साथ में आने वाले सदस्यों के नाम एवं उम्र दर्ज करें";
                } else if (!hasAccAgeDigit) {
                    isAccompanyingValid = false;
                    if (accErrorEl) accErrorEl.textContent = "कृपया सभी सदस्यों की उम्र (संख्या) जरूर दर्ज करें (उदा: 1. Rahul 32 Yrs)";
                } else {
                    isAccompanyingValid = true;
                }
                markGroup(accompanyingInput, isAccompanyingValid);
            } else {
                isAccompanyingValid = true;
            }

            // Vehicle No validation (Optional, but no symbols allowed)
            let isVehicleValid = true;
            if (vehicleNoInput && vehicleNoInput.value.trim()) {
                isVehicleValid = markGroup(vehicleNoInput, /^[A-Z0-9\s]+$/.test(vehicleNoInput.value.trim()));
            }

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
                if (googleAuthLock) {
                    googleAuthLock.style.display = "flex";
                    googleAuthLock.classList.remove("hidden");
                }
                return;
            }

            if (!isDateValid || !isSlotValid || !isNameAgeValid || !isIdValid || !isMobileValid || !isVehicleValid || !isAccompanyingValid || !isLocationValid || !isCountValid || !isRefValid || !isOtherRefValid) {
                const firstInvalid = form.querySelector(".input-group.invalid input, .input-group.invalid select, .input-group.invalid textarea");
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            setSubmittingState(true);

            // Format Visit DateTime string (DD/MM/YYYY format)
            const dateVal = getVal("visitDate");
            let formattedDateStr = dateVal;
            if (dateVal && dateVal.includes("-")) {
                const parts = dateVal.split("-");
                if (parts.length === 3) {
                    formattedDateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
                }
            }
            const slotVal = getVal("visitSlot");
            const formattedVisitDateTime = `${formattedDateStr} (${slotVal})`;

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
                    targetInput.dispatchEvent(new Event("input"));
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
    // CUSTOM SEARCHABLE DROPDOWN MENU HANDLER
    // -------------------------------------------------------------
    function initCustomSearchableSelects() {
        const searchableIds = ["stateSelect", "districtSelect", "referredBySelect", "countrySelect"];

        searchableIds.forEach(id => {
            const selectEl = document.getElementById(id);
            if (!selectEl) return;

            // Hide native select element
            selectEl.style.display = "none";

            const parentWrapper = selectEl.parentElement;
            if (parentWrapper && parentWrapper.classList.contains("select-wrapper")) {
                const arrow = parentWrapper.querySelector(".select-arrow");
                if (arrow) arrow.style.display = "none";
            }

            // Create custom container
            let customContainer = parentWrapper.querySelector(`.custom-select-container[data-target="${id}"]`);
            if (!customContainer) {
                customContainer = document.createElement("div");
                customContainer.className = "custom-select-container" + (selectEl.disabled ? " disabled" : "");
                customContainer.setAttribute("data-target", id);

                const defaultText = selectEl.options[selectEl.selectedIndex] ? selectEl.options[selectEl.selectedIndex].textContent : "-- Select --";

                customContainer.innerHTML = `
                    <div class="custom-select-trigger" tabindex="0">
                        <span class="trigger-text">${defaultText}</span>
                        <i class="fa-solid fa-chevron-down trigger-arrow"></i>
                    </div>
                    <div class="custom-select-dropdown hidden">
                        <div class="custom-search-wrapper">
                            <i class="fa-solid fa-magnifying-glass search-icon"></i>
                            <input type="text" class="custom-search-input" placeholder="🔍 टाइप करके खोजें (Search)..." autocomplete="off">
                        </div>
                        <div class="custom-options-list"></div>
                    </div>
                `;

                parentWrapper.appendChild(customContainer);
            }

            const trigger = customContainer.querySelector(".custom-select-trigger");
            const dropdown = customContainer.querySelector(".custom-select-dropdown");
            const searchInput = customContainer.querySelector(".custom-search-input");
            const optionsList = customContainer.querySelector(".custom-options-list");
            const triggerText = customContainer.querySelector(".trigger-text");

            function populateOptions(filterText = "") {
                optionsList.innerHTML = "";
                const query = filterText.toLowerCase().trim();
                let matchCount = 0;

                Array.from(selectEl.options).forEach((opt) => {
                    const text = opt.textContent;
                    if (query === "" || text.toLowerCase().includes(query)) {
                        matchCount++;
                        const item = document.createElement("div");
                        item.className = "custom-option-item" + (opt.value === selectEl.value && opt.value !== "" ? " selected" : "");
                        item.textContent = text;

                        item.addEventListener("click", (e) => {
                            e.stopPropagation();
                            selectEl.value = opt.value;
                            triggerText.textContent = text;
                            selectEl.dispatchEvent(new Event("change"));
                            if (typeof markGroup === "function") markGroup(selectEl, opt.value !== "");
                            closeAllDropdowns();
                        });

                        optionsList.appendChild(item);
                    }
                });

                if (matchCount === 0) {
                    const noResult = document.createElement("div");
                    noResult.className = "custom-option-empty";
                    noResult.textContent = "कोई परिणाम नहीं मिला (No match found)";
                    optionsList.appendChild(noResult);
                }
            }

            selectEl.addEventListener("change", () => {
                const selectedOpt = selectEl.options[selectEl.selectedIndex];
                triggerText.textContent = selectedOpt ? selectedOpt.textContent : "-- Select --";
                if (selectEl.disabled) {
                    customContainer.classList.add("disabled");
                } else {
                    customContainer.classList.remove("disabled");
                }
            });

            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                if (selectEl.disabled) {
                    customContainer.classList.add("disabled");
                    return;
                } else {
                    customContainer.classList.remove("disabled");
                }

                const isOpen = !dropdown.classList.contains("hidden");
                closeAllDropdowns();

                if (!isOpen) {
                    dropdown.classList.remove("hidden");
                    trigger.classList.add("active");
                    searchInput.value = "";
                    populateOptions("");
                    setTimeout(() => searchInput.focus(), 60);
                }
            });

            searchInput.addEventListener("input", (e) => {
                e.stopPropagation();
                populateOptions(searchInput.value);
            });

            dropdown.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        });
    }

    function closeAllDropdowns() {
        document.querySelectorAll(".custom-select-dropdown").forEach(dd => dd.classList.add("hidden"));
        document.querySelectorAll(".custom-select-trigger").forEach(tr => tr.classList.remove("active"));
    }

    document.addEventListener("click", closeAllDropdowns);

    // -------------------------------------------------------------
    // REAL-TIME DEVOTEE COUNT MAX 8 CLAMP HANDLER
    // -------------------------------------------------------------
    function enforceDevoteeCountLimit() {
        if (!maleCountInput || !femaleCountInput) return;

        function handleMaleInput() {
            let mVal = parseInt(maleCountInput.value) || 0;
            let fVal = parseInt(femaleCountInput.value) || 0;

            if (mVal < 0) {
                mVal = 0;
                maleCountInput.value = 0;
            }

            if (mVal + fVal > 8) {
                mVal = Math.max(0, 8 - fVal);
                maleCountInput.value = mVal;
            }

            const isCountValid = (mVal + fVal) > 0 && (mVal + fVal) <= 8;
            markGroup(maleCountInput, isCountValid);
        }

        function handleFemaleInput() {
            let mVal = parseInt(maleCountInput.value) || 0;
            let fVal = parseInt(femaleCountInput.value) || 0;

            if (fVal < 0) {
                fVal = 0;
                femaleCountInput.value = 0;
            }

            if (mVal + fVal > 8) {
                fVal = Math.max(0, 8 - mVal);
                femaleCountInput.value = fVal;
            }

            const isCountValid = (mVal + fVal) > 0 && (mVal + fVal) <= 8;
            markGroup(maleCountInput, isCountValid);
        }

        maleCountInput.addEventListener("input", handleMaleInput);
        maleCountInput.addEventListener("change", handleMaleInput);
        femaleCountInput.addEventListener("input", handleFemaleInput);
        femaleCountInput.addEventListener("change", handleFemaleInput);
    }

    // Initialize Voice Typing, Devotee Count Limit & Searchable Dropdowns
    setupVoiceTyping();
    enforceDevoteeCountLimit();
    initCustomSearchableSelects();
});
