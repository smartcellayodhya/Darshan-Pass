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
            const isCountValid = (mVal + fVal) > 0;

            const isRefValid = referredBySelect ? markGroup(referredBySelect, referredBySelect.value !== "") : true;
            let isOtherRefValid = true;
            if (referredBySelect && referredBySelect.value === "Other" && otherRefNameInput) {
                isOtherRefValid = markGroup(otherRefNameInput, otherRefNameInput.value.trim().length >= 2);
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

            // Construct Unstoppable 11-Column Payload
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
                referredBy: finalReferredBy
            };

            // Transmit Data via Unstoppable Pipeline
            await sendDataUnstoppable(formData);

            // Display Success Modal
            if (successModal) successModal.classList.remove("hidden");

            // Reset form safely
            form.reset();
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

    if (modalCloseBtn && successModal) {
        modalCloseBtn.addEventListener("click", () => successModal.classList.add("hidden"));
        successModal.addEventListener("click", (e) => {
            if (e.target === successModal) successModal.classList.add("hidden");
        });
    }
});
