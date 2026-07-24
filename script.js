/**
 * DARSHAN PASS PUBLIC FORM - FRONTEND CONNECTOR
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit
 */

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCRSyNuq_QvPcURMaaXVhqFIcxX5Bdxrf-nDvjhVLGw7wyuB1D-oM6lSVdeG-g7ZiCBQ/exec";

// -------------------------------------------------------------
// 1. DATA DICTIONARY: INDIAN STATES & DISTRICTS (IN ENGLISH)
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
// 2. WORLD COUNTRIES LIST (IN ENGLISH)
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

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // LIVE CLOCK TICKER
    // -------------------------------------------------------------
    const liveClockEl = document.getElementById("live-clock");
    function updateLiveClock() {
        if (!liveClockEl) return;
        const now = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[now.getMonth()];
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        liveClockEl.textContent = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
    }
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

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
    const foreignCityGroup = document.getElementById("foreign-city-group");
    const foreignCityInput = document.getElementById("foreignCity");
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
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");

    const successModal = document.getElementById("success-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const configAlert = document.getElementById("config-alert");

    if (GOOGLE_APPS_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
        configAlert.classList.remove("hidden");
    }

    // Set Min Date Picker to Today YYYY-MM-DD
    const todayStr = new Date().toISOString().split("T")[0];
    visitDateInput.setAttribute("min", todayStr);

    // -------------------------------------------------------------
    // POPULATE INITIAL DROPDOWNS
    // -------------------------------------------------------------
    // 1. Populate Indian States
    Object.keys(indiaLocationData).sort().forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });

    // 2. Populate World Countries
    worldCountries.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    // -------------------------------------------------------------
    // STATE CHANGE -> POPULATE DISTRICTS
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // DEVOTEE NATIONALITY TOGGLE (India vs Other Country)
    // -------------------------------------------------------------
    nationalitySelect.addEventListener("change", () => {
        const isIndia = nationalitySelect.value === "India";

        if (isIndia) {
            indiaLocationGrid.classList.remove("hidden");
            countryGroup.classList.add("hidden");
            foreignCityGroup.classList.add("hidden");
            
            stateSelect.required = true;
            districtSelect.required = true;
            countrySelect.required = false;

            idLabelText.textContent = "आधार नं0 / पासपोर्ट नं0 (Aadhaar / Passport No)";
            idNumberInput.placeholder = "Enter 12-digit Aadhaar No. or Passport No.";
        } else {
            indiaLocationGrid.classList.add("hidden");
            countryGroup.classList.remove("hidden");
            foreignCityGroup.classList.remove("hidden");

            stateSelect.required = false;
            districtSelect.required = false;
            countrySelect.required = true;

            idLabelText.textContent = "पासपोर्ट नं0 (Passport Number Mandatory for International Devotees)";
            idNumberInput.placeholder = "Enter Passport Number (E.g. Z1234567)";
        }
    });

    // -------------------------------------------------------------
    // REFERRED BY DROPDOWN TOGGLE (Other Officer Name Text Field)
    // -------------------------------------------------------------
    referredBySelect.addEventListener("change", () => {
        if (referredBySelect.value === "Other") {
            otherRefGroup.classList.remove("hidden");
            otherRefNameInput.required = true;
            otherRefNameInput.focus();
        } else {
            otherRefGroup.classList.add("hidden");
            otherRefNameInput.required = false;
            otherRefNameInput.value = "";
            markGroup(otherRefNameInput, true);
        }
    });

    // -------------------------------------------------------------
    // VALIDATION HELPERS
    // -------------------------------------------------------------
    const mobileRegex = /^[0-9+\s-]{8,15}$/;

    function markGroup(input, isValid) {
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

    nameAgeInput.addEventListener("input", () => markGroup(nameAgeInput, nameAgeInput.value.trim().length >= 2));
    idNumberInput.addEventListener("input", () => markGroup(idNumberInput, idNumberInput.value.trim().length >= 4));
    mobileInput.addEventListener("input", () => markGroup(mobileInput, mobileRegex.test(mobileInput.value.trim())));

    // -------------------------------------------------------------
    // FORM SUBMIT HANDLER
    // -------------------------------------------------------------
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const isIndia = nationalitySelect.value === "India";

        const isDateValid = markGroup(visitDateInput, visitDateInput.value !== "");
        const isSlotValid = markGroup(visitSlotSelect, visitSlotSelect.value !== "");
        const isNameAgeValid = markGroup(nameAgeInput, nameAgeInput.value.trim().length >= 2);
        const isIdValid = markGroup(idNumberInput, idNumberInput.value.trim().length >= 4);
        const isMobileValid = markGroup(mobileInput, mobileRegex.test(mobileInput.value.trim()));

        let isLocationValid = true;
        if (isIndia) {
            const isStateValid = markGroup(stateSelect, stateSelect.value !== "");
            const isDistrictValid = markGroup(districtSelect, districtSelect.value !== "");
            isLocationValid = isStateValid && isDistrictValid;
        } else {
            const isCountryValid = markGroup(countrySelect, countrySelect.value !== "");
            isLocationValid = isCountryValid;
        }

        const mVal = parseInt(maleCountInput.value) || 0;
        const fVal = parseInt(femaleCountInput.value) || 0;
        const isCountValid = markGroup(maleCountInput, (mVal + fVal) > 0);

        // Validate Referred By
        const isRefValid = markGroup(referredBySelect, referredBySelect.value !== "");
        let isOtherRefValid = true;
        if (referredBySelect.value === "Other") {
            isOtherRefValid = markGroup(otherRefNameInput, otherRefNameInput.value.trim().length >= 2);
        }

        if (!isDateValid || !isSlotValid || !isNameAgeValid || !isIdValid || !isMobileValid || !isLocationValid || !isCountValid || !isRefValid || !isOtherRefValid) {
            const firstInvalid = form.querySelector(".input-group.invalid input, .input-group.invalid select");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        setSubmittingState(true);

        // Format DateTime string: "2026-07-25 (09:00 AM - 11:00 AM)"
        const formattedVisitDateTime = `${visitDateInput.value} (${visitSlotSelect.value})`;

        let finalState = "";
        let finalDistrict = "";

        if (isIndia) {
            finalState = stateSelect.value;
            finalDistrict = districtSelect.value;
        } else {
            finalState = countrySelect.value + " (International)";
            finalDistrict = foreignCityInput.value.trim() || "International Devotee";
        }

        // Determine Referred By text for Google Sheet
        let finalReferredBy = referredBySelect.value;
        if (referredBySelect.value === "Other" && otherRefNameInput.value.trim()) {
            finalReferredBy = "Other: " + otherRefNameInput.value.trim();
        }

        const formData = {
            visitDateTime: formattedVisitDateTime,
            nameAge: nameAgeInput.value.trim(),
            state: finalState,
            district: finalDistrict,
            idNumber: idNumberInput.value.trim(),
            maleCount: mVal,
            femaleCount: fVal,
            mobile: mobileInput.value.trim(),
            vehicleNo: vehicleNoInput.value.trim(),
            accompanying: accompanyingInput.value.trim(),
            referredBy: finalReferredBy
        };

        try {
            await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(formData)
            });

            // Show Success Modal
            successModal.classList.remove("hidden");

            // Reset form
            form.reset();
            districtSelect.disabled = true;
            districtSelect.innerHTML = '<option value="">-- Select State First --</option>';
            nationalitySelect.value = "India";
            nationalitySelect.dispatchEvent(new Event("change"));
            referredBySelect.dispatchEvent(new Event("change"));

            document.querySelectorAll(".input-group").forEach(g => g.classList.remove("valid", "invalid"));

        } catch (error) {
            console.error("Submission Error:", error);
            alert("❌ Submitting error occurred. Please check your internet connection.");
        } finally {
            setSubmittingState(false);
        }
    });

    function setSubmittingState(isSubmitting) {
        if (isSubmitting) {
            submitBtn.disabled = true;
            btnText.classList.add("hidden");
            btnLoader.classList.remove("hidden");
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove("hidden");
            btnLoader.classList.add("hidden");
        }
    }

    modalCloseBtn.addEventListener("click", () => successModal.classList.add("hidden"));
    successModal.addEventListener("click", (e) => {
        if (e.target === successModal) successModal.classList.add("hidden");
    });
});
