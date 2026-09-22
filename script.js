/**
 * DARSHAN PASS PUBLIC FORM - FRONTEND CONNECTOR
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1hvU0bmecFROopDXRFvBqN6RiJqXhskCQfKNasopNwPo/edit
 */

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCRSyNuq_QvPcURMaaXVhqFIcxX5Bdxrf-nDvjhVLGw7wyuB1D-oM6lSVdeG-g7ZiCBQ/exec";

// -------------------------------------------------------------
// 1. DATA DICTIONARY: INDIAN STATES & DISTRICTS (COMPLETE 36 STATES & UTs)
// -------------------------------------------------------------
const indiaLocationData = {
    "Andaman & Nicobar Islands": ["Nicobar", "North & Middle Andaman", "South Andaman"],
    "Andhra Pradesh": ["Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Itanagar Capital Complex", "Kamle", "Kra Daadi", "Kurung Kumey", "Leparada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
    "Assam": ["Baksa", "Bajali", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tamulpur", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran (Motihari)", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda (Bihar Sharif)", "Nawada", "Patna", "Purnia", "Rohtas (Sasaram)", "Saharsa", "Samastipur", "Saran (Chhapra)", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali (Hajipur)", "West Champaran (Bettiah)"],
    "Chandigarh": ["Chandigarh"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar (Jagdalpur)", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham (Kawardha)", "Kanker", "Khairagarh-Chhuikhadan-Gandai", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh-Chirmiri-Bharatpur", "Mohla-Manpur-Ambagarh Chowki", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Sarangarh-Bilaigarh", "Sukma", "Surajpur", "Surguja (Ambikapur)"],
    "Dadra & Nagar Haveli and Daman & Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
    "Delhi (NCT)": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jammu & Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum (Jamshedpur)", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu (Medininagar)", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum (Chaibasa)"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada (Mangaluru)", "Davanagere", "Dharwad (Hubballi)", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada (Karwar)", "Vijayanagara", "Vijayapura", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam (Kochi)", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Ladakh": ["Kargil", "Leh"],
    "Lakshadweep": ["Lakshadweep"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad (Narmadapuram)", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Maihar", "Mandla", "Mandsaur", "Mauganj", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Pandhurna", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar (Ahilyanagar)", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Chhatrapati Sambhajinagar (Aurangabad)", "Dharashiv (Osmanabad)", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["Eastern West Khasi Hills", "East Garo Hills", "East Jaintia Hills", "East Khasi Hills (Shillong)", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
    "Nagaland": ["Chümoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyü", "Tuensang", "Wokha", "Zünheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam (Berhampur)", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)", "Khordha (Bhubaneswar)", "Koraput", "Malkangiri", "Mayurbhanj (Baripada)", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur (Sonepur)", "Sundargarh (Rourkela)"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Pathankot", "Patiala", "Rupnagar (Ropar)", "Sahibzada Ajit Singh Nagar (Mohali)", "Sangrur", "Shahid Bhagat Singh Nagar (Nawanshahr)", "Sri Muktsar Sahib", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Anupgarh", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Deeg", "Didwana-Kuchaman", "Dholpur", "Dudu", "Dungarpur", "Gangapur City", "Hanumangarh", "Jaipur", "Jaipur Rural", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Jodhpur Rural", "Karauli", "Kekri", "Khairthal-Tijara", "Kota", "Kotputli-Behror", "Nagaur", "Neem Ka Thana", "Pali", "Phalodi", "Pratapgarh", "Rajsamand", "Salumbar", "Sanchore", "Sawai Madhopur", "Shahpura", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Sikkim": ["Gangtok", "Gyalshing", "Mangan", "Namchi", "Pakyong", "Soreng"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari (Nagercoil)", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris (Ooty)", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahbubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"],
    "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura (Agartala)"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar (Noida)", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Rae Bareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar (Rudrapur)", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman (Asansol/Durgapur)", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
};

// -------------------------------------------------------------
// 2. WORLD COUNTRIES LIST (ALL 195+ SOVEREIGN NATIONS)
// -------------------------------------------------------------
const worldCountries = [
    "Nepal", "Mauritius", "United States", "United Kingdom", "Canada", "Australia", 
    "Singapore", "Malaysia", "United Arab Emirates", "Fiji", "Sri Lanka", "New Zealand", 
    "South Africa", "Trinidad and Tobago", "Guyana", "Suriname", "Netherlands", "Germany", 
    "France", "Japan", "Thailand", "Indonesia", "Myanmar", "Bhutan", "Kenya", "Tanzania", 
    "Oman", "Qatar", "Kuwait", "Bahrain", "Saudi Arabia", "Switzerland", "Italy", "Spain", 
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", 
    "Armenia", "Austria", "Azerbaijan", "Bahamas", "Bangladesh", "Barbados", "Belarus", 
    "Belgium", "Belize", "Benin", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", 
    "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", 
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", 
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", 
    "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", 
    "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Finland", "Gabon", "Gambia", "Georgia", 
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Haiti", "Honduras", 
    "Hungary", "Iceland", "Iran", "Iraq", "Ireland", "Israel", "Ivory Coast", "Jamaica", 
    "Jordan", "Kazakhstan", "Kiribati", "Kosovo", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", 
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", 
    "Malawi", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mexico", 
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
    "Namibia", "Nauru", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", 
    "Norway", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", 
    "Peru", "Philippines", "Poland", "Portugal", "Romania", "Russia", "Rwanda", 
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", 
    "San Marino", "Sao Tome and Principe", "Senegal", "Serbia", "Seychelles", "Sierra Leone", 
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Korea", "South Sudan", 
    "Sudan", "Sweden", "Syria", "Taiwan", "Tajikistan", "Timor-Leste", "Togo", "Tonga", 
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "Uruguay", 
    "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other"
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

function syncBodyModalLock() {
    const modals = document.querySelectorAll(".modal-overlay, .auth-modal-overlay");
    let anyVisible = false;
    modals.forEach(el => {
        if (el.classList.contains("hidden")) return;
        if (el.style.display === "none") return;
        const comp = window.getComputedStyle(el);
        if (comp.display !== "none" && comp.visibility !== "hidden") {
            anyVisible = true;
        }
    });
    if (anyVisible) {
        document.body.classList.add("modal-open");
    } else {
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
    }
}
window.syncBodyModalLock = syncBodyModalLock;

function unlockFormScreen(name, email) {
    const googleAuthLock = document.getElementById("google-auth-lock");
    if (googleAuthLock) {
        googleAuthLock.style.display = "none";
        googleAuthLock.classList.add("hidden");
    }

    const displayUserName = document.getElementById("display-user-name");
    const displayUserEmail = document.getElementById("display-user-email");
    const googleSignedIn = document.getElementById("google-signed-in");
    const googleLoginPrompt = document.getElementById("google-login-prompt");

    if (displayUserName) displayUserName.textContent = name || "Google User";
    if (displayUserEmail) displayUserEmail.textContent = email || "";
    if (googleSignedIn) googleSignedIn.classList.remove("hidden");
    if (googleLoginPrompt) googleLoginPrompt.classList.add("hidden");

    // Immediately restore scrolling and remove freeze
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.touchAction = "";

    syncBodyModalLock();
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
            if (typeof window.updateGoogleAccountUI === "function") {
                window.updateGoogleAccountUI();
            }
        } else {
            console.warn("Could not parse credential payload, using default login.");
            localStorage.setItem("darshan_submitter_name", "Google User");
            localStorage.setItem("darshan_submitter_email", "user@gmail.com");
            unlockFormScreen("Google User", "user@gmail.com");
            if (typeof window.updateGoogleAccountUI === "function") {
                window.updateGoogleAccountUI();
            }
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

    const primaryNameInput = document.getElementById("primaryName");
    const primaryAgeInput = document.getElementById("primaryAge");
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
        syncBodyModalLock();
    }

    function syncBodyModalLock() {
        const modals = document.querySelectorAll(".modal-overlay, .auth-modal-overlay");
        let anyVisible = false;
        modals.forEach(el => {
            if (el.classList.contains("hidden")) return;
            if (el.style.display === "none") return;
            const comp = window.getComputedStyle(el);
            if (comp.display !== "none" && comp.visibility !== "hidden") {
                anyVisible = true;
            }
        });
        if (anyVisible) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }
    }
    window.syncBodyModalLock = syncBodyModalLock;

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
        syncBodyModalLock();
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
            syncBodyModalLock();
        });
    }

    checkAuthLock();
    updateGoogleAccountUI();

    // Precise Indian Standard Time (IST - Asia/Kolkata, UTC+5:30) Helper
    function getNowIST() {
        try {
            return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        } catch (e) {
            const d = new Date();
            const utcMs = d.getTime() + (d.getTimezoneOffset() * 60000);
            return new Date(utcMs + (5.5 * 3600000));
        }
    }

    // Calculate Indian Standard Time today and max 6-day date string (Total 7-day rolling window)
    const nowIST = getNowIST();
    const year = nowIST.getFullYear();
    const month = String(nowIST.getMonth() + 1).padStart(2, '0');
    const day = String(nowIST.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const maxDateObj = new Date(nowIST.getTime());
    maxDateObj.setDate(maxDateObj.getDate() + 6); // Today + 6 days
    const maxYear = maxDateObj.getFullYear();
    const maxMonth = String(maxDateObj.getMonth() + 1).padStart(2, '0');
    const maxDay = String(maxDateObj.getDate()).padStart(2, '0');
    const maxDateStr = `${maxYear}-${maxMonth}-${maxDay}`;

    // Slot end-time mapping in 24-hour decimal time
    const slotEndHours = {
        "07:00 AM - 09:00 AM": 9,
        "09:00 AM - 11:00 AM": 11,
        "11:00 AM - 12:00 PM": 12,
        "01:00 PM - 03:00 PM": 15,
        "03:00 PM - 05:00 PM": 17,
        "05:00 PM - 07:00 PM": 19,
        "07:00 PM - 09:00 PM": 21
    };

    // Check if all slots for today have ended (after 21:00 / 9:00 PM IST)
    const initCheckTime = getNowIST();
    const currentDecimalHourInit = initCheckTime.getHours() + (initCheckTime.getMinutes() / 60);
    const isPastAllSlotsToday = currentDecimalHourInit >= 21;

    let defaultSelectedDateStr = todayStr;
    if (isPastAllSlotsToday) {
        const tomorrowObj = new Date(nowIST.getTime());
        tomorrowObj.setDate(tomorrowObj.getDate() + 1);
        const tomYear = tomorrowObj.getFullYear();
        const tomMonth = String(tomorrowObj.getMonth() + 1).padStart(2, '0');
        const tomDay = String(tomorrowObj.getDate()).padStart(2, '0');
        defaultSelectedDateStr = `${tomYear}-${tomMonth}-${tomDay}`;
    }

    function updateAvailableSlots() {
        if (!visitSlotSelect || !visitDateInput) return;
        const selectedDate = visitDateInput.value;
        const isToday = (selectedDate === todayStr);
        const checkNow = getNowIST();
        const currentDecimalHour = checkNow.getHours() + (checkNow.getMinutes() / 60);

        let currentSelectedExpired = false;

        Array.from(visitSlotSelect.options).forEach(opt => {
            if (!opt.value) return; // skip placeholder
            const endHour = slotEndHours[opt.value];
            if (isToday && endHour !== undefined && currentDecimalHour >= endHour) {
                opt.disabled = true;
                if (!opt.textContent.includes("समय समाप्त")) {
                    opt.textContent = `${opt.value} (समय समाप्त / Expired)`;
                }
                if (visitSlotSelect.value === opt.value) {
                    currentSelectedExpired = true;
                }
            } else {
                opt.disabled = false;
                opt.textContent = opt.value;
            }
        });

        if (currentSelectedExpired) {
            visitSlotSelect.value = "";
        }
    }

    if (visitDateInput) {
        const minAllowedDate = isPastAllSlotsToday ? defaultSelectedDateStr : todayStr;
        visitDateInput.setAttribute("min", minAllowedDate);
        visitDateInput.setAttribute("max", maxDateStr);
        visitDateInput.value = defaultSelectedDateStr; // Pre-select today or tomorrow if past 9 PM

        if (isPastAllSlotsToday) {
            setTimeout(() => {
                showToast("आज के सभी दर्शन स्लॉट समाप्त हो चुके हैं। कल की तिथि स्वतः चुन ली गई है।", "info");
            }, 800);
        }

        // Dynamically block past dates or dates beyond 6 days
        const enforceDateBounds = () => {
            if (!visitDateInput.value) return;
            const minAllowed = isPastAllSlotsToday ? defaultSelectedDateStr : todayStr;
            if (visitDateInput.value < minAllowed) {
                visitDateInput.value = minAllowed;
                if (isPastAllSlotsToday) {
                    showToast("आज के सभी दर्शन स्लॉट समाप्त हो चुके हैं। कृपया आगामी तिथि चुनें।", "warning");
                } else {
                    showToast("पिछली तिथि नहीं चुनी जा सकती। केवल आज से अगले 6 दिन की तिथि चुनें।", "warning");
                }
            } else if (visitDateInput.value > maxDateStr) {
                visitDateInput.value = maxDateStr;
                showToast("दर्शन पास केवल आज और अगले 6 दिन तक ही बुक किया जा सकता है।", "warning");
            }
            updateAvailableSlots();
        };
        visitDateInput.addEventListener("change", enforceDateBounds);
        visitDateInput.addEventListener("input", enforceDateBounds);
    }

    updateAvailableSlots();

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

                const curLang = localStorage.getItem("darshan_lang") || "hi";
                if (idLabelText) idLabelText.textContent = curLang === "en" ? "Aadhaar / Passport No" : "आधार नं0 / पासपोर्ट नं0";
                if (idNumberInput) idNumberInput.placeholder = curLang === "en" ? "Enter 12-digit Aadhaar No. or Passport No." : "12-अंकों का आधार नंबर या पासपोर्ट नंबर दर्ज करें";
            } else {
                if (indiaLocationGrid) indiaLocationGrid.classList.add("hidden");
                if (countryGroup) countryGroup.classList.remove("hidden");

                if (stateSelect) stateSelect.required = false;
                if (districtSelect) districtSelect.required = false;
                if (countrySelect) countrySelect.required = true;

                const curLang = localStorage.getItem("darshan_lang") || "hi";
                if (idLabelText) idLabelText.textContent = curLang === "en" ? "Passport Number (Mandatory for International)" : "पासपोर्ट नंबर (अंतर्राष्ट्रीय श्रद्धालु हेतु अनिवार्य)";
                if (idNumberInput) idNumberInput.placeholder = curLang === "en" ? "Enter Passport Number (E.g. Z1234567)" : "पासपोर्ट नंबर दर्ज करें (उदा: Z1234567)";
            }
            if (idNumberInput) {
                idNumberInput.dispatchEvent(new Event("input"));
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

    // 2. Vehicle Number: No symbols at all, Automatic Uppercase & On-Foot Checkbox (ITEM 4)
    const noVehicleCheck = document.getElementById("noVehicleCheck");
    if (vehicleNoInput) {
        const cleanVehicle = () => {
            if (!noVehicleCheck || !noVehicleCheck.checked) {
                vehicleNoInput.value = vehicleNoInput.value.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
            }
        };
        vehicleNoInput.addEventListener("input", cleanVehicle);
        vehicleNoInput.addEventListener("paste", () => setTimeout(cleanVehicle, 10));
    }

    if (noVehicleCheck && vehicleNoInput) {
        const noVehicleLabel = document.querySelector(".no-vehicle-label");
        noVehicleCheck.addEventListener("change", () => {
            if (noVehicleCheck.checked) {
                if (noVehicleLabel) noVehicleLabel.classList.add("checked");
                vehicleNoInput.value = "पैदल (On Foot)";
                vehicleNoInput.disabled = true;
                markGroup(vehicleNoInput, true);
            } else {
                if (noVehicleLabel) noVehicleLabel.classList.remove("checked");
                vehicleNoInput.value = "";
                vehicleNoInput.disabled = false;
                markGroup(vehicleNoInput, true);
            }
        });
    }

    // -------------------------------------------------------------
    // STRICT NAME FIELD GUARD: ABSOLUTELY NO NUMBERS IN ANY NAME BOX
    // -------------------------------------------------------------
    let _lastNumberToastTime = 0;
    function showNameNumberBlockedFeedback(inputEl) {
        if (!inputEl) return;
        inputEl.classList.remove("input-warning-shake");
        // Force reflow for smooth re-trigger
        void inputEl.offsetWidth;
        inputEl.classList.add("input-warning-shake");
        setTimeout(() => inputEl.classList.remove("input-warning-shake"), 400);

        const now = Date.now();
        if (now - _lastNumberToastTime > 2200) {
            _lastNumberToastTime = now;
            const curLang = localStorage.getItem("darshan_lang") || "hi";
            const msg = (curLang === "en")
                ? "Numbers/age are not allowed in the Name box. Please enter age in the Age box."
                : "नाम वाले बॉक्स में नंबर/उम्र लिखना मना है। कृपया उम्र को 'उम्र' वाले बॉक्स में लिखें।";
            showToast(msg, "warning");
        }
    }

    function sanitizeNameField(inputEl, notify = true) {
        if (!inputEl) return;
        const val = inputEl.value;
        if (/[0-9\u0966-\u096F]/.test(val)) {
            inputEl.value = val.replace(/[0-9\u0966-\u096F]/g, '');
            if (notify) showNameNumberBlockedFeedback(inputEl);
        }
        // Allow letters (English + Hindi), spaces, and dot
        const cleanVal = inputEl.value.replace(/[^a-zA-Z\u0900-\u097F\s.]/g, '');
        if (cleanVal !== inputEl.value) {
            inputEl.value = cleanVal;
        }
    }

    // Smart Paste for Primary Devotee Name (Extracts age to primaryAge if present)
    if (primaryNameInput) {
        primaryNameInput.addEventListener("paste", (e) => {
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            if (!pastedText) return;

            if (/[0-9\u0966-\u096F]/.test(pastedText)) {
                e.preventDefault();
                const extracted = extractMemberNameAndAge(pastedText);
                primaryNameInput.value = extracted.name.replace(/[0-9\u0966-\u096F]/g, '');
                if (primaryAgeInput && !primaryAgeInput.value && extracted.age) {
                    primaryAgeInput.value = extracted.age;
                    primaryAgeInput.dispatchEvent(new Event("input", { bubbles: true }));
                    showToast("नाम व उम्र स्वतः अलग-अलग बॉक्स में भर दिए गए!", "success");
                } else {
                    showNameNumberBlockedFeedback(primaryNameInput);
                }
                primaryNameInput.dispatchEvent(new Event("input", { bubbles: true }));
            }
        });
    }

    // Global Keydown & BeforeInput Delegation: strictly intercept & reject number keys in ALL name boxes
    document.addEventListener("keydown", (e) => {
        const target = e.target;
        if (!target || !target.matches) return;
        if (target.id === "primaryName" || target.classList.contains("member-name-input")) {
            // Allow functional & shortcut keys (Ctrl/Cmd/Alt + Key, Backspace, Arrows, Tab, etc.)
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            const functionalKeys = ["Backspace", "Delete", "Tab", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Escape"];
            if (functionalKeys.includes(e.key)) return;

            // Check if user is typing any number key (0-9 or Numpad 0-9)
            const isDigitKey = (e.key >= '0' && e.key <= '9') ||
                               (e.keyCode >= 48 && e.keyCode <= 57 && !e.shiftKey) ||
                               (e.keyCode >= 96 && e.keyCode <= 105);

            if (isDigitKey) {
                e.preventDefault();
                showNameNumberBlockedFeedback(target);
            }
        }
    }, true);

    document.addEventListener("beforeinput", (e) => {
        const target = e.target;
        if (!target || !target.matches) return;
        if (target.id === "primaryName" || target.classList.contains("member-name-input")) {
            if (e.data && /[0-9\u0966-\u096F]/.test(e.data)) {
                e.preventDefault();
                showNameNumberBlockedFeedback(target);
            }
        }
    }, true);

    document.addEventListener("input", (e) => {
        const target = e.target;
        if (!target || !target.matches) return;
        if (target.id === "primaryName" || target.classList.contains("member-name-input")) {
            sanitizeNameField(target, true);
        }
    });

    // Other Ref Name (Senior Officer Name): No forbidden symbols
    if (otherRefNameInput) {
        const cleanOtherRef = () => {
            otherRefNameInput.value = otherRefNameInput.value.replace(/[^a-zA-Z0-9\u0900-\u097F\u0966-\u096F\s.\r\n]/g, '');
        };
        otherRefNameInput.addEventListener("input", cleanOtherRef);
        otherRefNameInput.addEventListener("paste", () => setTimeout(cleanOtherRef, 10));
    }

    if (primaryAgeInput) {
        primaryAgeInput.addEventListener("input", () => {
            let ageVal = parseInt(primaryAgeInput.value, 10);
            if (ageVal > 120) primaryAgeInput.value = 120;
            if (ageVal < 0) primaryAgeInput.value = "";
        });
    }

    // 4. ID Number (Aadhaar / Passport): Alphanumeric Uppercase, Max 12 chars + Live Digit Counter
    if (idNumberInput) {
        const idCounter = document.getElementById("idNumber-counter");
        const cleanId = () => {
            let val = idNumberInput.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            idNumberInput.value = val.slice(0, 12);

            if (idCounter) {
                const len = idNumberInput.value.length;
                const curLang = localStorage.getItem("darshan_lang") || "hi";
                const isPassport = (nationalitySelect && nationalitySelect.value === "Other");

                if (len === 0) {
                    idCounter.style.display = "none";
                    idCounter.className = "id-counter";
                } else if (isPassport) {
                    if (len >= 6 && len <= 12) {
                        idCounter.style.display = "inline-block";
                        idCounter.className = "id-counter valid";
                        idCounter.textContent = curLang === "en" ? "✔ Valid Passport No." : "✔ मान्य पासपोर्ट नंबर";
                    } else {
                        idCounter.style.display = "inline-block";
                        idCounter.className = "id-counter";
                        idCounter.textContent = curLang === "en" ? `${len} chars (Min 6)` : `${len} अक्षर (न्यूनतम 6)`;
                    }
                } else if (len === 12) {
                    idCounter.style.display = "inline-block";
                    idCounter.className = "id-counter valid";
                    idCounter.textContent = curLang === "en" ? "✔ 12 digits complete" : "✔ 12 अंक पूर्ण";
                } else {
                    idCounter.style.display = "inline-block";
                    idCounter.className = "id-counter";
                    idCounter.textContent = curLang === "en" ? `${len}/12 digits` : `${len}/12 अंक`;
                }
            }
        };
        idNumberInput.addEventListener("input", cleanId);
        idNumberInput.addEventListener("paste", () => setTimeout(cleanId, 10));
    }

    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // TOAST NOTIFICATION HELPER
    // -------------------------------------------------------------
    function showToast(message, type = "info") {
        const toast = document.getElementById("gov-toast");
        if (!toast) return;

        let iconClass = "fa-circle-info";
        if (type === "success") iconClass = "fa-circle-check";
        if (type === "error" || type === "warning") iconClass = "fa-triangle-exclamation";

        toast.innerHTML = `<i class="toast-icon fa-solid ${iconClass}"></i> <span>${message}</span>`;
        toast.className = `gov-toast toast-${type}`;
        toast.classList.remove("hidden");
        toast.classList.add("show");

        clearTimeout(window._toastTimer);
        window._toastTimer = setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.classList.add("hidden"), 300);
        }, 4500);
    }

    // UNIQUE APPLICATION TOKEN GENERATOR (AYO-YYYYMMDD-ROW - Strictly IST Date)
    function generateTokenId(rowNumber) {
        const now = getNowIST();
        const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        let rowSuffix = "";
        if (rowNumber && typeof rowNumber === "number") {
            rowSuffix = String(rowNumber);
            localStorage.setItem("darshan_last_row", rowSuffix);
        } else if (rowNumber && !isNaN(parseInt(rowNumber))) {
            rowSuffix = String(parseInt(rowNumber));
            localStorage.setItem("darshan_last_row", rowSuffix);
        } else {
            // Persistent fallback row counter if server doesn't return row
            let current = parseInt(localStorage.getItem("darshan_last_row") || "101", 10) + 1;
            localStorage.setItem("darshan_last_row", current);
            rowSuffix = String(current);
        }
        return `AYO-${ymd}-${rowSuffix}`;
    }

    // -------------------------------------------------------------
    // ULTRA-FAST TRANSMISSION PIPELINE WITH ATOMIC ROW FEEDBACK
    // -------------------------------------------------------------
    async function sendDataWithRowFeedback(formData) {
        const payloadStr = JSON.stringify(formData);

        // Check active internet connection first
        if (navigator.onLine === false) {
            showToast("इंटरनेट कनेक्शन उपलब्ध नहीं है। कृपया नेटवर्क जांचें।", "error");
            throw new Error("Offline");
        }

        let assignedRow = null;
        let returnedToken = null;

        // 1. Single atomic POST to Google Apps Script
        try {
            const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: payloadStr
            });
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    if (data.result === "duplicate" || data.isDuplicate) {
                        return {
                            result: "duplicate",
                            isDuplicate: true,
                            message: data.message || "इस आधार नंबर या मोबाइल नंबर से पिछले 24 घंटे में आवेदन पहले ही दर्ज है।",
                            rowNumber: data.matchedRow
                        };
                    }
                    if (data.result === "error" || data.status === "error") {
                        throw new Error(data.error || data.message || "सर्वर पर त्रुटि आई।");
                    }
                    if (data.rowNumber || data.row) {
                        assignedRow = parseInt(data.rowNumber || data.row, 10);
                        returnedToken = data.token || generateTokenId(assignedRow);
                        localStorage.setItem("darshan_last_row", String(assignedRow));
                        return {
                            success: true,
                            result: "success",
                            rowNumber: assignedRow,
                            token: returnedToken
                        };
                    }
                }
            }
        } catch (postErr) {
            console.warn("Direct POST JSON response check:", postErr);
            if (postErr.message && (postErr.message.includes("सर्वर") || postErr.message.includes("व्यस्त"))) {
                throw postErr;
            }
        }

        // 2. Fallback Verification: If POST was redirected or response body wasn't readable directly,
        // verify atomically via track query to ensure a BRAND NEW row was indeed appended
        try {
            await new Promise(r => setTimeout(r, 1500));
            const verifyRes = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=track&query=${encodeURIComponent(formData.mobile)}&_t=${Date.now()}`);
            if (verifyRes.ok) {
                const vData = await verifyRes.json();
                if (vData && vData.result === "success" && vData.data && vData.data.rowNumber) {
                    const item = vData.data;
                    const statusStr = String(item.status || '').toLowerCase().trim();
                    const itemVisitDate = String(item.visitDate || '').trim();
                    const formVisitDate = String(formData.visitDate || '').trim();

                    // CRITICAL GUARD: Only accept this row as a successful submission IF:
                    // 1. Status is strictly 'Pending' (brand-new row, NOT 'Pass Created', 'Rejected', or 'Already Created')
                    // 2. Visit Date matches the requested visit date
                    const isPending = (statusStr === "pending" || statusStr.includes("pending") || statusStr.includes("लंबित"));
                    const isDateMatch = (!formVisitDate || itemVisitDate === formVisitDate);

                    if (isPending && isDateMatch) {
                        const confirmedRow = parseInt(item.rowNumber, 10);
                        localStorage.setItem("darshan_last_row", String(confirmedRow));
                        return {
                            success: true,
                            result: "success",
                            rowNumber: confirmedRow,
                            token: item.token || generateTokenId(confirmedRow)
                        };
                    } else {
                        // The row found belongs to an OLD past submission (e.g. status was already 'Pass Created')
                        // Never deliver an old past row's token as a new submission!
                        console.warn("Fallback track returned an old past record, not a new submission:", item);
                    }
                }
            }
        } catch (vErr) {
            console.warn("Verification fallback error:", vErr);
        }

        // Never claim false success if a genuine new row was not confirmed
        throw new Error("सर्वर पर आपका नया आवेदन दर्ज नहीं हो सका। कृपया इंटरनेट जांचकर दोबारा सबमिट करें।");
    }

    // -------------------------------------------------------------
    // DUPLICATE SUBMISSION CHECKER (24-HOUR AADHAAR & MOBILE CHECK)
    // -------------------------------------------------------------
    function getSubmissionsHistory() {
        try {
            return JSON.parse(localStorage.getItem("darshan_submissions_history") || "[]");
        } catch (e) {
            return [];
        }
    }

    function checkDuplicateSubmission(mobile, idNumber, visitDate, visitSlot) {
        let cleanMob = String(mobile || "").replace(/\D/g, '').slice(-10);
        let cleanId = String(idNumber || "").trim().toUpperCase();

        if (cleanId === "NA" || cleanId === "N/A" || cleanId === "NONE" || cleanId === "NULL" || cleanId.length < 6) {
            cleanId = "";
        }
        if (cleanMob.length < 10) {
            cleanMob = "";
        }

        if ((!cleanMob && !cleanId) || !visitDate || !visitSlot) return null;
        const history = getSubmissionsHistory();
        const oneDayMs = 24 * 60 * 60 * 1000; // Strictly 24 hours
        const now = Date.now();

        return history.find(item => {
            const isSameVisitDate = item.visitDate && (item.visitDate === visitDate);
            const matchMobile = cleanMob && item.mobile && (item.mobile === cleanMob);
            const matchId = cleanId && item.idNumber && (item.idNumber === cleanId);
            return isSameVisitDate && (matchMobile || matchId);
        }) || null;
    }

    function recordSubmission(mobile, idNumber, visitDate, visitSlot, token) {
        try {
            const history = getSubmissionsHistory();
            history.unshift({
                mobile: String(mobile || "").trim(),
                idNumber: String(idNumber || "").trim().toUpperCase(),
                visitDate: visitDate,
                visitSlot: visitSlot,
                token: token,
                timestamp: Date.now()
            });
            localStorage.setItem("darshan_submissions_history", JSON.stringify(history.slice(0, 50)));
        } catch (e) {
            console.warn("Could not save submission to history:", e);
        }
    }

    // -------------------------------------------------------------
    // DRAFT MANAGEMENT
    // Per requirement: Browser refresh must always load a brand-new form.
    // Draft auto-saving is cleanly disabled.
    // -------------------------------------------------------------
    function clearFormDraft() {
        try {
            localStorage.removeItem("darshan_form_draft");
            sessionStorage.removeItem("darshan_form_draft");
        } catch (e) {}
    }

    function saveFormDraft() {
        // Disabled per requirement: Browser refresh must always load a fresh, new form
    }

    let draftDebounceTimer = null;
    function queueSaveDraft() {
        // Disabled per requirement
    }

    function restoreFormDraft() {
        // Disabled per requirement: Browser refresh must always load a fresh, new form
        clearFormDraft();
    }

    function resetFormState() {
        if (form) form.reset();
        if (visitDateInput) {
            const minAllowedDate = isPastAllSlotsToday ? defaultSelectedDateStr : todayStr;
            visitDateInput.setAttribute("min", minAllowedDate);
            visitDateInput.setAttribute("max", maxDateStr);
            visitDateInput.value = defaultSelectedDateStr;
        }
        if (noVehicleCheck) {
            noVehicleCheck.checked = false;
        }
        if (vehicleNoInput) {
            vehicleNoInput.disabled = false;
            vehicleNoInput.value = "";
        }
        if (stateSelect) {
            stateSelect.value = "";
            stateSelect.dispatchEvent(new Event("change"));
        }
        if (districtSelect) {
            districtSelect.disabled = true;
            districtSelect.innerHTML = '<option value="">-- Select State First --</option>';
            districtSelect.dispatchEvent(new Event("change"));
        }
        if (nationalitySelect) {
            nationalitySelect.value = "India";
            nationalitySelect.dispatchEvent(new Event("change"));
        }
        if (referredBySelect) {
            referredBySelect.value = "";
            referredBySelect.dispatchEvent(new Event("change"));
        }

        // Reset custom searchable dropdown trigger text
        const curLang = localStorage.getItem("darshan_lang") || "hi";
        const t = (typeof translations !== "undefined" && translations[curLang]) ? translations[curLang] : {};
        const stateTr = document.querySelector('.custom-select-container[data-target="stateSelect"] .trigger-text');
        if (stateTr) stateTr.textContent = t.optSelectState || "-- राज्य चुनें --";
        const distTr = document.querySelector('.custom-select-container[data-target="districtSelect"] .trigger-text');
        if (distTr) distTr.textContent = t.optSelectDistrict || "-- पहले राज्य चुनें --";
        const refTr = document.querySelector('.custom-select-container[data-target="referredBySelect"] .trigger-text');
        if (refTr) refTr.textContent = t.optSelectRef || "-- रेफरेंस अधिकारी चुनें --";

        document.querySelectorAll(".input-group").forEach(g => g.classList.remove("valid", "invalid"));

        // Reset devotee count defaults (1 Male, 0 Female = 1 Total Single Devotee)
        if (maleCountInput) maleCountInput.value = "1";
        if (femaleCountInput) femaleCountInput.value = "0";
        updateAccompanyingRequirement(1);
        updateAvailableSlots();
        clearFormDraft();
    }

    // -------------------------------------------------------------
    // FORM SUBMIT HANDLER
    // -------------------------------------------------------------
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const natVal = getVal("nationality") || "India";
            const isIndia = natVal === "India";

            // Safe validation checks (Date strictly between minAllowedDate and today+6)
            const minAllowedDate = isPastAllSlotsToday ? defaultSelectedDateStr : todayStr;
            const isDateWithinAllowedRange = visitDateInput ? (visitDateInput.value !== "" && visitDateInput.value >= minAllowedDate && visitDateInput.value <= maxDateStr) : true;
            const isDateValid = visitDateInput ? markGroup(visitDateInput, isDateWithinAllowedRange) : true;
            let isSlotValid = visitSlotSelect ? markGroup(visitSlotSelect, visitSlotSelect.value !== "") : true;
            if (isSlotValid && visitSlotSelect && visitDateInput && visitDateInput.value === todayStr) {
                const checkNow = getNowIST();
                const curHour = checkNow.getHours() + (checkNow.getMinutes() / 60);
                const endH = slotEndHours[visitSlotSelect.value];
                if (endH !== undefined && curHour >= endH) {
                    isSlotValid = false;
                    markGroup(visitSlotSelect, false);
                    const slotErr = document.getElementById("visitSlot-error");
                    if (slotErr) slotErr.textContent = "चयनित समय स्लॉट समाप्त हो चुका है, कृपया आगामी स्लॉट चुनें।";
                    showToast("चयनित समय स्लॉट समाप्त हो चुका है, कृपया आगामी स्लॉट चुनें।", "error");
                }
            }
            
            // Primary Devotee Name & Age validation
            let isNameValid = false;
            let isAgeValid = false;

            if (primaryNameInput) {
                const nameVal = primaryNameInput.value.trim();
                const hasLetters = /[a-zA-Z\u0900-\u097F]/.test(nameVal);
                const hasDigits = /[0-9\u0966-\u096F]/.test(nameVal);
                isNameValid = (nameVal.length >= 2 && hasLetters && !hasDigits);
                markGroup(primaryNameInput, isNameValid);
                const nameErrorEl = document.getElementById("primaryName-error");
                if (!isNameValid && nameErrorEl) {
                    if (hasDigits) {
                        nameErrorEl.textContent = (localStorage.getItem("darshan_lang") === "en")
                            ? "Numbers/age are not allowed in the Name box. Please enter age in the Age box."
                            : "नाम में नंबर/उम्र लिखना मना है, कृपया उम्र को 'उम्र' वाले बॉक्स में लिखें";
                    } else {
                        nameErrorEl.textContent = (localStorage.getItem("darshan_lang") === "en")
                            ? "Please enter primary devotee's full name (at least 2 letters)"
                            : "कृपया मुख्य दर्शनार्थी का पूरा नाम दर्ज करें";
                    }
                }
            } else {
                isNameValid = true;
            }

            if (primaryAgeInput) {
                const ageVal = parseInt(primaryAgeInput.value.trim(), 10);
                isAgeValid = (!isNaN(ageVal) && ageVal >= 1 && ageVal <= 120);
                markGroup(primaryAgeInput, isAgeValid);
                const ageErrorEl = document.getElementById("primaryAge-error");
                if (!isAgeValid && ageErrorEl) {
                    ageErrorEl.textContent = (localStorage.getItem("darshan_lang") === "en")
                        ? "Please enter valid age (1 to 120 yrs)"
                        : "कृपया सही उम्र (1 से 120 वर्ष) दर्ज करें";
                }
            } else {
                isAgeValid = true;
            }

            const isNameAgeValid = isNameValid && isAgeValid;
            
            // ID Number validation (12 digits Aadhaar OR valid Passport number)
            let isIdValid = false;
            if (idNumberInput) {
                const idVal = idNumberInput.value.trim().toUpperCase();
                const idErrorEl = document.getElementById("idNumber-error");

                if (isIndia) {
                    if (/^\d+$/.test(idVal)) {
                        isIdValid = idVal.length === 12;
                        if (idErrorEl && !isIdValid) {
                            idErrorEl.textContent = "आधार नंबर strictly 12 अंकों का होना अनिवार्य है";
                        }
                    } else if (idVal.length >= 6 && idVal.length <= 12) {
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

            // Devotee Counts Calculation
            const mVal = parseInt(getVal("maleCount")) || 0;
            const fVal = parseInt(getVal("femaleCount")) || 0;
            const totalCount = mVal + fVal;
            const isCountValid = totalCount > 0 && totalCount <= 8;
            if (maleCountInput) markGroup(maleCountInput, isCountValid);

            // Accompanying devotees validation (Dynamically based on Total Devotees count)
            let isAccompanyingValid = true;
            if (totalCount <= 1) {
                // Single Devotee: Accompanying is NOT required
                isAccompanyingValid = true;
                if (accompanyingInput) accompanyingInput.value = "लागू नहीं (अकेले दर्शनार्थी)";
                markGroup(accompanyingInput, true);
            } else {
                syncAccompanyingTextarea();
                const accErrorEl = document.getElementById("accompanying-error");
                const memberCards = document.querySelectorAll(".member-row-card");
                let firstInvalidIndex = -1;
                let invalidFieldType = "";

                memberCards.forEach((card, idx) => {
                    const nameEl = card.querySelector(".member-name-input");
                    const ageEl = card.querySelector(".member-age-input");
                    const nVal = nameEl ? nameEl.value.trim() : "";
                    const aVal = ageEl ? parseInt(ageEl.value.trim(), 10) : NaN;
                    const hasDigits = /[0-9\u0966-\u096F]/.test(nVal);

                    let rowValid = true;
                    if (!nVal || nVal.length < 2) {
                        rowValid = false;
                        if (firstInvalidIndex === -1) {
                            firstInvalidIndex = idx + 1;
                            invalidFieldType = "name";
                        }
                    } else if (hasDigits) {
                        rowValid = false;
                        if (firstInvalidIndex === -1) {
                            firstInvalidIndex = idx + 1;
                            invalidFieldType = "name_digits";
                        }
                    } else if (isNaN(aVal) || aVal < 1 || aVal > 120) {
                        rowValid = false;
                        if (firstInvalidIndex === -1) {
                            firstInvalidIndex = idx + 1;
                            invalidFieldType = "age";
                        }
                    }

                    if (!rowValid) {
                        card.style.borderColor = "#dc2626";
                    } else {
                        card.style.borderColor = "";
                    }
                });

                if (firstInvalidIndex !== -1) {
                    isAccompanyingValid = false;
                    if (accErrorEl) {
                        const curLang = localStorage.getItem("darshan_lang") || "hi";
                        if (invalidFieldType === "age") {
                            accErrorEl.textContent = curLang === "en"
                                ? `Please enter valid age (1 to 120 yrs) for devotee ${firstInvalidIndex}`
                                : `कृपया साथी ${firstInvalidIndex} की सही उम्र (1 से 120 वर्ष) दर्ज करें`;
                        } else if (invalidFieldType === "name_digits") {
                            accErrorEl.textContent = curLang === "en"
                                ? `Devotee ${firstInvalidIndex}'s name cannot contain numbers. Enter age in the Age box.`
                                : `साथी ${firstInvalidIndex} के नाम में नंबर लिखना मना है, उम्र अलग बॉक्स में लिखें`;
                        } else {
                            accErrorEl.textContent = curLang === "en"
                                ? `Please enter full name for devotee ${firstInvalidIndex}`
                                : `कृपया साथी ${firstInvalidIndex} का पूरा नाम दर्ज करें`;
                        }
                        accErrorEl.style.display = "block";
                    }
                    markGroup(accompanyingInput, false);
                } else {
                    isAccompanyingValid = true;
                    if (accErrorEl) accErrorEl.style.display = "none";
                    markGroup(accompanyingInput, true);
                }
            }

            // Vehicle No validation (Optional, or On-Foot)
            let isVehicleValid = true;
            if (noVehicleCheck && noVehicleCheck.checked) {
                isVehicleValid = true;
                if (vehicleNoInput) markGroup(vehicleNoInput, true);
            } else if (vehicleNoInput && vehicleNoInput.value.trim()) {
                isVehicleValid = markGroup(vehicleNoInput, /^[A-Z0-9\s]{4,15}$/.test(vehicleNoInput.value.trim()));
                const vehErr = document.getElementById("vehicleNo-error");
                if (!isVehicleValid && vehErr) {
                    vehErr.textContent = "कृपया सही गाड़ी नंबर दर्ज करें (उदा: UP42AB1234) अथवा 'पैदल' चुनें";
                }
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
                showToast("कृपया फॉर्म में सभी आवश्यक जानकारी सही प्रकार भरें", "warning");
                return;
            }

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

            // DUPLICATE SUBMISSION CHECK (Server is authoritative; client provides instant warning)
            const idValForDup = getVal("idNumber");
            const dupRecord = checkDuplicateSubmission(mobVal, idValForDup, formattedDateStr, slotVal);
            if (dupRecord) {
                const dupField = (idValForDup && dupRecord.idNumber && dupRecord.idNumber === idValForDup.toUpperCase()) ? "आधार / पहचान पत्र" : "मोबाइल नंबर";
                console.warn(`Recent client submission detected for ${dupField}. Passing to server for authoritative sheet verification.`);
            }

            setSubmittingState(true);

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

            let devoteeNameVal = "";
            if (primaryNameInput && primaryAgeInput) {
                const pName = cleanAccompanyingMemberName(primaryNameInput.value.trim());
                const pAge = primaryAgeInput.value.trim();
                devoteeNameVal = `${pName} ${pAge} Yrs`;
            } else {
                devoteeNameVal = getVal("nameAge");
            }
            const finalAccompanyingVal = totalCount <= 1 ? "लागू नहीं (अकेले दर्शनार्थी)" : (getVal("accompanying") || "कोई नहीं");

            // Construct Transmission Payload
            const formData = {
                visitDateTime: formattedVisitDateTime,
                visitDate: formattedDateStr,
                visitSlot: slotVal,
                nameAge: devoteeNameVal,
                state: finalState,
                district: finalDistrict,
                idNumber: getVal("idNumber"),
                maleCount: mVal,
                femaleCount: fVal,
                mobile: getVal("mobile"),
                vehicleNo: (noVehicleCheck && noVehicleCheck.checked) ? "पैदल (On Foot)" : getVal("vehicleNo"),
                accompanying: finalAccompanyingVal,
                referredBy: finalReferredBy,
                submitterName: subName,
                submitterEmail: subEmail
            };

            try {
                // Direct single transmission pipeline with atomic row & token feedback
                const sendResult = await sendDataWithRowFeedback(formData);

                // Check if server rejected duplicate submission (24-Hour Duplicate Aadhaar / Mobile Guard)
                if (sendResult && (sendResult.result === "duplicate" || sendResult.isDuplicate)) {
                    showToast(`⚠️ ${sendResult.message || "इस आधार या मोबाइल नंबर से पिछले 24 घंटे में आवेदन पहले ही दर्ज है!"}`, "warning");
                    const mobErr = document.getElementById("mobile-error");
                    if (mobErr) mobErr.textContent = sendResult.message || "इस विवरण से आवेदन पहले से दर्ज है";
                    const idErr = document.getElementById("idNumber-error");
                    if (idErr) idErr.textContent = sendResult.message || "इस विवरण से आवेदन पहले से दर्ज है";
                    return;
                }

                if (!sendResult || !sendResult.rowNumber) {
                    throw new Error("सर्वर से रो नंबर प्राप्त नहीं हो सका।");
                }

                // Exact atomic row and token from server
                const confirmedRow = sendResult.rowNumber;
                const tokenNumber = sendResult.token || generateTokenId(confirmedRow);
                localStorage.setItem("darshan_last_row", String(confirmedRow));

                // Populate Acknowledgement Slip / Modal
                const slipDevoteeName = document.getElementById("slip-devotee-name");
                const slipTokenId = document.getElementById("slip-token-id");
                const slipVisitDatetime = document.getElementById("slip-visit-datetime");
                const slipTotalDevotees = document.getElementById("slip-total-devotees");
                const slipMobile = document.getElementById("slip-mobile");
                const slipReferredBy = document.getElementById("slip-referred-by");

                if (slipDevoteeName) slipDevoteeName.textContent = devoteeNameVal;
                if (slipTokenId) slipTokenId.textContent = tokenNumber;
                if (slipVisitDatetime) slipVisitDatetime.textContent = formattedVisitDateTime;
                const isLangEn = (localStorage.getItem("darshan_lang") === "en");
                if (slipTotalDevotees) {
                    slipTotalDevotees.textContent = isLangEn 
                        ? `${totalCount} (Male: ${mVal}, Female: ${fVal})`
                        : `${totalCount} (पुरुष: ${mVal}, महिला: ${fVal})`;
                }
                if (slipMobile) slipMobile.textContent = formData.mobile;
                if (slipReferredBy) slipReferredBy.textContent = finalReferredBy;

                // Record submission & clear draft
                recordSubmission(formData.mobile, formData.idNumber, formattedDateStr, slotVal, tokenNumber);
                clearFormDraft();

                // Display Success Modal
                if (successModal) {
                    successModal.classList.remove("hidden");
                    syncBodyModalLock();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }

                showToast("आवेदन सफलतापूर्वक दर्ज हो गया!", "success");
            } catch (err) {
                console.error("Submission error:", err);
                showToast(err.message || "आवेदन सबमिट करने में समस्या आई। कृपया पुनः प्रयास करें।", "error");
            } finally {
                setSubmittingState(false);
            }
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
        syncBodyModalLock();
        if (formClosedCard) formClosedCard.classList.add("hidden");
        if (govFormCard) govFormCard.classList.remove("hidden");
        resetFormState();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (visitDateInput) visitDateInput.focus();
    }

    function closeFormSession() {
        if (successModal) successModal.classList.add("hidden");
        syncBodyModalLock();
        if (formClosedCard) formClosedCard.classList.add("hidden");
        if (govFormCard) govFormCard.classList.remove("hidden");
        resetFormState();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (visitDateInput) visitDateInput.focus();
    }

    // Modal Close Handler ("बंद करें")
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeFormSession);
    }
    const modalCloseIconBtn = document.getElementById("modal-close-icon-btn");
    if (modalCloseIconBtn) {
        modalCloseIconBtn.addEventListener("click", closeFormSession);
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

    // Copy Token ID Handler
    const copyTokenBtn = document.getElementById("copy-token-btn");
    if (copyTokenBtn) {
        copyTokenBtn.addEventListener("click", () => {
            const tokenIdEl = document.getElementById("slip-token-id");
            if (tokenIdEl) {
                navigator.clipboard.writeText(tokenIdEl.textContent.trim()).then(() => {
                    copyTokenBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #16a34a;"></i>';
                    const strip = document.querySelector(".pass-token-strip");
                    if (strip) {
                        strip.classList.add("copied");
                        setTimeout(() => strip.classList.remove("copied"), 1800);
                    }
                    showToast("टोकन ID सफलतापूर्वक कॉपी हो गई!", "success");
                    setTimeout(() => {
                        copyTokenBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
                    }, 2200);
                });
            }
        });
    }

    // Print Receipt Handler
    const printSlipBtn = document.getElementById("print-slip-btn");
    if (printSlipBtn) {
        printSlipBtn.addEventListener("click", () => {
            window.print();
        });
    }

    // -------------------------------------------------------------
    // DIRECT SLIP DOWNLOAD (SAVE PNG VIA HTML2CANVAS - ITEM 6)
    // -------------------------------------------------------------
    const downloadSlipBtn = document.getElementById("download-slip-btn");
    if (downloadSlipBtn) {
        downloadSlipBtn.addEventListener("click", async () => {
            const printableSlip = document.getElementById("printable-slip");
            if (!printableSlip) return;

            if (typeof html2canvas === "undefined") {
                showToast("इमेज डाउनलोड इंजन लोड नहीं हो सका, कृपया प्रिंट करें।", "warning");
                window.print();
                return;
            }

            const copyBtn = printableSlip.querySelector(".pass-copy-btn, .token-copy-btn");
            const origDownloadHtml = downloadSlipBtn.innerHTML;
            const isEn = (localStorage.getItem("darshan_lang") === "en");

            try {
                downloadSlipBtn.disabled = true;
                downloadSlipBtn.innerHTML = isEn 
                    ? '<i class="fa-solid fa-spinner fa-spin"></i> Downloading...' 
                    : '<i class="fa-solid fa-spinner fa-spin"></i> डाउनलोड हो रहा है...';

                if (copyBtn) copyBtn.style.display = "none";

                const canvas = await html2canvas(printableSlip, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    logging: false,
                    scrollX: 0,
                    scrollY: 0,
                    onclone: (clonedDoc) => {
                        const slip = clonedDoc.getElementById("printable-slip");
                        if (slip) {
                            slip.style.width = "460px";
                            slip.style.maxWidth = "460px";
                            slip.style.boxSizing = "border-box";
                            slip.style.margin = "0";
                            slip.style.padding = "1.2rem 1.4rem";
                            slip.style.boxShadow = "none";
                            slip.style.border = "1.5px solid #0f172a";
                            const copyBtn = slip.querySelector(".pass-copy-btn, #copy-token-btn");
                            if (copyBtn) copyBtn.remove();
                        }
                    }
                });

                if (copyBtn) copyBtn.style.display = "";

                const dataUrl = canvas.toDataURL("image/png");
                const tokenIdEl = document.getElementById("slip-token-id");
                const tokenStr = (tokenIdEl && tokenIdEl.textContent.trim()) ? tokenIdEl.textContent.trim() : "receipt";
                const cleanTokenStr = tokenStr.replace(/[^a-zA-Z0-9_-]/g, '');

                const link = document.createElement("a");
                link.download = `Darshan-Pass-${cleanTokenStr}.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showToast(isEn ? "Slip downloaded successfully!" : "रसीद सफलतापूर्वक डाउनलोड हो गई!", "success");
            } catch (err) {
                if (copyBtn) copyBtn.style.display = "";
                console.error("Slip image download error:", err);
                showToast(isEn ? "Error downloading slip. Please use Print." : "डाउनलोड में समस्या आई, कृपया प्रिंट विकल्प का प्रयोग करें।", "error");
            } finally {
                if (copyBtn) copyBtn.style.display = "";
                downloadSlipBtn.disabled = false;
                downloadSlipBtn.innerHTML = origDownloadHtml;
            }
        });
    }

    // -------------------------------------------------------------
    // WHATSAPP 1-CLICK SHARE HANDLER (PNG IMAGE + CLEAN TEXT)
    // -------------------------------------------------------------
    const whatsappShareBtn = document.getElementById("whatsapp-share-btn");
    if (whatsappShareBtn) {
        whatsappShareBtn.addEventListener("click", async () => {
            const devoteeName = (document.getElementById("slip-devotee-name")?.textContent || "").trim();
            const tokenId = (document.getElementById("slip-token-id")?.textContent || "").trim();
            const visitDatetime = (document.getElementById("slip-visit-datetime")?.textContent || "").trim();
            const totalDevotees = (document.getElementById("slip-total-devotees")?.textContent || "").trim();
            const mobile = (document.getElementById("slip-mobile")?.textContent || "").trim();
            const referredBy = (document.getElementById("slip-referred-by")?.textContent || "").trim();

            const messageText = 
`*श्री राम जन्मभूमि दर्शन पास - अयोध्या पुलिस पावती*

Token ID: ${tokenId}
मुख्य दर्शनार्थी: ${devoteeName}
दर्शन तिथि व समय: ${visitDatetime}
कुल दर्शनार्थी: ${totalDevotees}
मोबाइल नंबर: ${mobile}
Reference: ${referredBy}

जय श्री राम`;

            const printableSlip = document.getElementById("printable-slip");
            const cleanTokenStr = tokenId.replace(/[^a-zA-Z0-9_-]/g, '') || "pass";
            const fileName = `Darshan-Pass-${cleanTokenStr}.png`;

            if (!printableSlip || typeof html2canvas === "undefined") {
                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
                window.open(whatsappUrl, "_blank");
                return;
            }

            const origHtml = whatsappShareBtn.innerHTML;
            try {
                whatsappShareBtn.disabled = true;
                whatsappShareBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> तैयार हो रहा है...';

                const canvas = await html2canvas(printableSlip, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    logging: false,
                    scrollX: 0,
                    scrollY: 0,
                    onclone: (clonedDoc) => {
                        const slip = clonedDoc.getElementById("printable-slip");
                        if (slip) {
                            slip.style.width = "460px";
                            slip.style.maxWidth = "460px";
                            slip.style.boxSizing = "border-box";
                            slip.style.margin = "0";
                            slip.style.padding = "1.2rem 1.4rem";
                            slip.style.boxShadow = "none";
                            slip.style.border = "1.5px solid #0f172a";
                            const copyBtn = slip.querySelector(".pass-copy-btn, #copy-token-btn");
                            if (copyBtn) copyBtn.remove();
                        }
                    }
                });

                canvas.toBlob(async (blob) => {
                    whatsappShareBtn.disabled = false;
                    whatsappShareBtn.innerHTML = origHtml;

                    if (!blob) {
                        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
                        window.open(whatsappUrl, "_blank");
                        return;
                    }

                    const file = new File([blob], fileName, { type: "image/png" });

                    // Web Share API with File (Native support on Android Chrome & iOS Safari)
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({
                                files: [file],
                                title: "श्रीरामजन्मभूमि दर्शन पास",
                                text: messageText
                            });
                        } catch (err) {
                            if (err.name !== "AbortError") {
                                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
                                window.open(whatsappUrl, "_blank");
                            }
                        }
                    } else {
                        // Desktop fallback: download PNG + open WhatsApp Web
                        const link = document.createElement("a");
                        link.download = fileName;
                        link.href = URL.createObjectURL(blob);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        showToast("रसीद डाउनलोड हो गई, WhatsApp चैट खुल रहा है...", "info");
                        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
                        window.open(whatsappUrl, "_blank");
                    }
                }, "image/png");
            } catch (err) {
                console.error("WhatsApp share error:", err);
                whatsappShareBtn.disabled = false;
                whatsappShareBtn.innerHTML = origHtml;
                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
                window.open(whatsappUrl, "_blank");
            }
        });
    }

    // -------------------------------------------------------------
    // FLOATING SCROLL TO TOP BUTTON HANDLER
    // -------------------------------------------------------------
    const scrollToTopBtn = document.getElementById("scroll-to-top-btn");
    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 280) {
                scrollToTopBtn.classList.remove("hidden");
            } else {
                scrollToTopBtn.classList.add("hidden");
            }
        }, { passive: true });

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // -------------------------------------------------------------
    // TRACK PASS APPLICATION STATUS (ITEM 1)
    // -------------------------------------------------------------
    const trackPassNavBtn = document.getElementById("track-pass-nav-btn");
    const trackPassModal = document.getElementById("track-pass-modal");
    const closeTrackModalBtn = document.getElementById("close-track-modal-btn");
    const submitTrackBtn = document.getElementById("submit-track-btn");
    const trackQueryInput = document.getElementById("track-query-input");
    const trackResultBox = document.getElementById("track-result-box");
    const trackSubmitText = document.getElementById("track-submit-text");
    const trackSubmitLoader = document.getElementById("track-submit-loader");

    if (trackPassNavBtn && trackPassModal) {
        trackPassNavBtn.addEventListener("click", () => {
            trackPassModal.classList.remove("hidden");
            syncBodyModalLock();
            if (trackQueryInput) {
                trackQueryInput.value = "";
                setTimeout(() => trackQueryInput.focus(), 80);
            }
            if (trackResultBox) {
                trackResultBox.classList.add("hidden");
                trackResultBox.innerHTML = "";
            }
        });
    }

    if (closeTrackModalBtn && trackPassModal) {
        closeTrackModalBtn.addEventListener("click", () => {
            trackPassModal.classList.add("hidden");
            syncBodyModalLock();
        });
    }

    if (trackPassModal) {
        trackPassModal.addEventListener("click", (e) => {
            if (e.target === trackPassModal) {
                trackPassModal.classList.add("hidden");
                syncBodyModalLock();
            }
        });
    }

    if (submitTrackBtn && trackQueryInput && trackResultBox) {
        async function fetchTrackData(query) {
            const cleanQuery = String(query || '').trim();
            const encoded = encodeURIComponent(cleanQuery);
            const trackUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=track&query=${encoded}&_t=${Date.now()}`;

            // Attempt 1: Modern fetch (without cache: "no-store", which triggers CORS redirect failures in WebKit/Chromium)
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const res = await fetch(trackUrl, {
                    method: "GET",
                    headers: { "Accept": "application/json" },
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const json = await res.json();
                    if (json) return json;
                }
            } catch (fetchErr) {
                console.warn("Direct fetch error in track, switching to bulletproof JSONP fallback...", fetchErr);
            }

            // Attempt 2: Bulletproof JSONP fallback (100% immune to CORS, adblockers, and 302 cross-origin redirect blocks)
            return new Promise((resolve, reject) => {
                const callbackName = "darshan_track_cb_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
                const script = document.createElement("script");
                let timer = null;

                window[callbackName] = function(data) {
                    cleanup();
                    resolve(data);
                };

                function cleanup() {
                    if (timer) clearTimeout(timer);
                    try { delete window[callbackName]; } catch (e) { window[callbackName] = undefined; }
                    if (script && script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                }

                timer = setTimeout(() => {
                    cleanup();
                    reject(new Error("Track request timed out"));
                }, 15000);

                script.onerror = function() {
                    cleanup();
                    reject(new Error("Network error during track request"));
                };

                script.src = `${trackUrl}&callback=${callbackName}`;
                document.body.appendChild(script);
            });
        }

        async function executeTrackSearch() {
            const query = trackQueryInput.value.trim();
            if (!query) {
                showToast("कृपया टोकन ID, आधार या 10-अंकों का मोबाइल नंबर दर्ज करें", "warning");
                trackQueryInput.focus();
                return;
            }

            trackResultBox.classList.add("hidden");
            trackResultBox.innerHTML = "";
            submitTrackBtn.disabled = true;
            if (trackSubmitText) trackSubmitText.classList.add("hidden");
            if (trackSubmitLoader) trackSubmitLoader.classList.remove("hidden");

            try {
                const data = await fetchTrackData(query);

                trackResultBox.classList.remove("hidden");
                if (data && data.result === "success" && data.data) {
                    const item = data.data;
                    const statusStr = String(item.status || "Pending").trim();
                    let statusClass = "status-pending";
                    let statusHindi = "प्रक्रियाधीन";

                    const lowerStatus = statusStr.toLowerCase();
                    if (lowerStatus.includes("already") || statusStr.includes("अन्य काउंटर")) {
                        statusClass = "status-already-created";
                        statusHindi = "अन्य काउंटर से जारी";
                    } else if (lowerStatus.includes("pass") || lowerStatus.includes("created") || lowerStatus.includes("बन गया") || lowerStatus.includes("approved") || statusStr.includes("स्वीकृत") || statusStr.includes("जारी")) {
                        statusClass = "status-pass-created";
                        statusHindi = "पास जारी (Pass Created)";
                    } else if (lowerStatus.includes("reject") || statusStr.includes("निरस्त") || statusStr.includes("अस्वीकृत")) {
                        statusClass = "status-rejected";
                        statusHindi = "निरस्त (Rejected)";
                    }

                    function formatTrackDate(raw) {
                        if (!raw) return '--';
                        const str = String(raw).trim();
                        if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return str;
                        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
                            const p = str.split('-');
                            return `${p[2]}/${p[1]}/${p[0]}`;
                        }
                        const d = new Date(str);
                        if (!isNaN(d.getTime())) {
                            const dd = String(d.getDate()).padStart(2, '0');
                            const mm = String(d.getMonth() + 1).padStart(2, '0');
                            const yyyy = d.getFullYear();
                            return `${dd}/${mm}/${yyyy}`;
                        }
                        return str;
                    }

                    function formatTrackToken(rawDate, rowNumber) {
                        let ymd = 'AYO';
                        if (rawDate) {
                            const str = String(rawDate).trim();
                            if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
                                const p = str.split('/');
                                ymd = `${p[2]}${p[1]}${p[0]}`;
                            } else if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
                                ymd = str.replace(/-/g, '');
                            } else {
                                const d = new Date(str);
                                if (!isNaN(d.getTime())) {
                                    const dd = String(d.getDate()).padStart(2, '0');
                                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                                    const yyyy = d.getFullYear();
                                    ymd = `${yyyy}${mm}${dd}`;
                                }
                            }
                        }
                        return `AYO-${ymd}-${rowNumber || ''}`;
                    }

                    const cleanDate = formatTrackDate(item.visitDate);
                    const cleanToken = item.token || formatTrackToken(item.visitDate, item.rowNumber);

                    let statusIcon = "fa-clock";
                    let statusSub = "आवेदन पर विचार चल रहा है";
                    if (statusClass === "status-pass-created") {
                        statusIcon = "fa-circle-check";
                        statusSub = "पास स्वीकृत एवं तैयार है";
                    } else if (statusClass === "status-already-created") {
                        statusIcon = "fa-id-card-clip";
                        statusSub = "पास अन्य काउंटर से पहले ही जारी हो चुका है";
                    } else if (statusClass === "status-rejected") {
                        statusIcon = "fa-circle-xmark";
                        statusSub = "आवेदन निरस्त कर दिया गया है";
                    }

                    trackResultBox.innerHTML = `
                        <div class="track-status-card">
                            <div class="track-status-banner ${statusClass}">
                                <div class="status-banner-left">
                                    <i class="fa-solid ${statusIcon}"></i>
                                    <div>
                                        <div class="status-banner-title">${statusHindi}</div>
                                        <div class="status-banner-sub">${statusSub}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="track-token-banner">
                                <div class="token-banner-label"><i class="fa-solid fa-ticket"></i> टोकन नंबर</div>
                                <div class="token-banner-code">${cleanToken}</div>
                            </div>

                            <div class="track-grid-details">
                                <div class="track-cell full-col">
                                    <span class="cell-lbl"><i class="fa-solid fa-user"></i> मुख्य दर्शनार्थी</span>
                                    <span class="cell-val text-primary">${item.name || '--'}</span>
                                </div>
                                <div class="track-cell">
                                    <span class="cell-lbl"><i class="fa-regular fa-calendar-check"></i> दर्शन तिथि</span>
                                    <span class="cell-val">${cleanDate}</span>
                                </div>
                                <div class="track-cell">
                                    <span class="cell-lbl"><i class="fa-regular fa-clock"></i> समय स्लॉट</span>
                                    <span class="cell-val">${item.visitSlot || '--'}</span>
                                </div>
                                <div class="track-cell">
                                    <span class="cell-lbl"><i class="fa-solid fa-users"></i> कुल दर्शनार्थी</span>
                                    <span class="cell-val">${item.totalDevotees || '1'} व्यक्ति</span>
                                </div>
                                <div class="track-cell">
                                    <span class="cell-lbl"><i class="fa-solid fa-handshake"></i> संदर्भ (रेफरेंस)</span>
                                    <span class="cell-val">${item.referredBy || '--'}</span>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    trackResultBox.innerHTML = `
                        <div class="track-not-found">
                            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.5rem; margin-bottom: 0.4rem; display: block;"></i>
                            दर्ज विवरण से कोई आवेदन नहीं मिला। कृपया टोकन ID या 10-अंकों का मोबाइल नंबर पुनः जांचें।
                        </div>
                    `;
                }
            } catch (err) {
                console.error("Track error:", err);
                trackResultBox.classList.remove("hidden");
                trackResultBox.innerHTML = `
                    <div class="track-not-found">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.5rem; margin-bottom: 0.4rem; display: block;"></i>
                        सर्वर से संपर्क नहीं हो सका। कृपया थोड़ी देर बाद पुनः प्रयास करें।
                    </div>
                `;
            } finally {
                submitTrackBtn.disabled = false;
                if (trackSubmitText) trackSubmitText.classList.remove("hidden");
                if (trackSubmitLoader) trackSubmitLoader.classList.add("hidden");
            }
        }

        submitTrackBtn.addEventListener("click", executeTrackSearch);
        trackQueryInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                executeTrackSearch();
            }
        });
    }

    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // LANGUAGE SWITCHER (HINDI / ENGLISH - ITEM 8)
    // -------------------------------------------------------------
    const translations = {
        hi: {
            langBtn: "English",
            trackBtn: "स्थिति देखें",
            refreshBtn: "रिफ्रेश",
            portalTitle: "श्रीरामजन्मभूमि दर्शन हेतु पास आवेदन",
            secVisit: '<i class="fa-solid fa-calendar-day"></i> दर्शन तिथि व स्लॉट',
            lblVisitDate: 'दर्शन तिथि <span class="required">*</span>',
            lblVisitSlot: 'समय स्लॉट <span class="required">*</span>',
            optSelectSlot: '-- समय स्लॉट चुनें --',
            lblNationality: 'श्रद्धालु का देश <span class="required">*</span>',
            optIndia: 'भारत',
            optOtherCountry: 'अन्य देश',
            lblCountry: 'देश चुनें <span class="required">*</span>',
            optSelectCountry: '-- देश चुनें --',
            lblState: 'राज्य चुनें <span class="required">*</span>',
            optSelectState: '-- राज्य चुनें --',
            lblDistrict: 'जनपद चुनें <span class="required">*</span>',
            optSelectDistrict: '-- पहले राज्य चुनें --',
            secPrimary: '<i class="fa-solid fa-id-card"></i> मुख्य दर्शनार्थी विवरण',
            lblPrimaryName: 'मुख्य दर्शनार्थी का पूरा नाम <span class="required">*</span>',
            phPrimaryName: 'नाम (उदा: Rahul)',
            lblPrimaryAge: 'उम्र <span class="required">*</span>',
            primaryAgeSuffix: 'वर्ष',
            lblNameAge: 'मुख्य दर्शनार्थी का नाम व उम्र <span class="required">*</span>',
            phNameAge: 'उदा: Rahul 35 Yrs',
            lblMobile: 'मोबाइल नंबर <span class="required">*</span>',
            phMobile: '10 अंकों का मोबाइल नंबर दर्ज करें',
            lblId: 'पहचान पत्र / आधार संख्या <span class="required">*</span>',
            phId: '12-अंकों का आधार या पासपोर्ट',
            hintVisitDate: 'केवल आज से अगले 6 दिन तक मान्य',
            lblVehicle: 'गाड़ी नं0 <span class="optional-tag">(ऐच्छिक)</span>',
            phVehicle: 'उदा: UP42AB1234',
            noVehicle: 'पैदल / कोई वाहन नहीं',
            secCount: '<i class="fa-solid fa-users"></i> दर्शनार्थी संख्या व साथी विवरण',
            lblDevoteeCount: 'श्रद्धालु संख्या (पुरुष / महिला) <span class="optional-tag">(अधिकतम 8)</span> <span class="required">*</span>',
            lblMale: 'पुरुष',
            lblFemale: 'महिला',
            lblAccompanying: 'साथ में आने वाले सदस्यों के नाम व उम्र',
            phAccompanying: '1. Rahul 32 Yrs\n2. Ashwani 35 Yrs',
            secRef: '<i class="fa-solid fa-user-check"></i> संदर्भ (रेफरेंस)',
            lblReferredBy: 'रेफरेंस अधिकारी <span class="required">*</span>',
            optSelectRef: '-- रेफरेंस अधिकारी चुनें --',
            lblOtherRef: 'वरिष्ठ अधिकारी का नाम <span class="required">*</span>',
            phOtherRef: 'अधिकारी का नाम व पद दर्ज करें',
            submitBtn: 'आवेदन जमा करें',
            
            // Modal & Slip
            successHeading: 'आवेदन सफलतापूर्वक दर्ज हुआ',
            successSubtitle: 'आपकी श्रीरामजन्मभूमि दर्शन पास की जानकारी सुरक्षित रूप से दर्ज कर ली गई है।',
            receiptTitle: 'श्रीरामजन्मभूमि दर्शन पास',
            slipLabelDevotee: 'मुख्य दर्शनार्थी',
            slipLabelToken: 'Token ID:',
            slipLabelDatetime: 'दर्शन तिथि व स्लॉट:',
            slipLabelTotal: 'कुल दर्शनार्थी:',
            slipLabelMobile: 'मोबाइल नंबर:',
            slipLabelRef: 'Reference:',
            slipFooterNote: '<i class="fa-solid fa-shield-halved"></i> यह ऑनलाइन आवेदन पावती है, इसको अन्तिम पास नही माना जायेगा। अंतिम पास सक्षम पुलिस अधिकारी के अनुमोदन के उपरांत जारी होगा।',
            whatsappShare: 'WhatsApp शेयर',
            downloadSlip: 'रसीद डाउनलोड',
            printSlip: 'प्रिंट / PDF',
            submitAnother: 'दूसरा फॉर्म',
            closeModal: 'बंद करें',
            singleDevoteeNotice: 'अकेले दर्शनार्थी हैं - अतिरिक्त साथी विवरण की आवश्यकता नहीं है।',
            trackModalTitle: '<i class="fa-solid fa-magnifying-glass" style="color: var(--primary-blue);"></i> आवेदन स्थिति जांचें',
            trackModalDesc: 'टोकन ID, आधार नंबर या 10-अंकों का मोबाइल नंबर दर्ज करें:',
            trackSearchBtn: 'खोजें',
            trackPlaceholder: 'टोकन ID, आधार या मोबाइल नंबर...',
            closedTitle: 'आवेदन सत्र समाप्त',
            closedDesc: 'आपका दर्शन पास आवेदन सफलतापूर्वक दर्ज कर लिया गया है। फॉर्म बंद कर दिया गया है। नया आवेदन भरने के लिए नीचे बटन पर क्लिक करें।',
            reopenBtn: '<i class="fa-solid fa-rotate-left"></i> नया फॉर्म भरें',
            footerLine1: '© 2026 अयोध्या पुलिस. सर्वाधिकार सुरक्षित.',
            footerLine2: 'Designed & Developed by Smart Cell Ayodhya',
            installAppBtn: 'ऐप इंस्टॉल करें',
            iosInstallTitle: 'iPhone / iPad पर ऐप जोड़ें'
        },
        en: {
            langBtn: "हिन्दी",
            trackBtn: "Track Status",
            refreshBtn: "Refresh",
            installAppBtn: 'Install App',
            iosInstallTitle: 'Add App to iPhone / iPad',
            portalTitle: "Shri Ram Janmabhoomi Darshan Pass Application",
            secVisit: '<i class="fa-solid fa-calendar-day"></i> Visit Date & Time Schedule',
            lblVisitDate: 'Visit Date <span class="required">*</span>',
            lblVisitSlot: 'Time Slot <span class="required">*</span>',
            optSelectSlot: '-- Select Time Slot --',
            lblNationality: 'Devotee Country <span class="required">*</span>',
            optIndia: 'India',
            optOtherCountry: 'Other Country (International Devotee)',
            lblCountry: 'Select Country <span class="required">*</span>',
            optSelectCountry: '-- Select Country --',
            lblState: 'Select State <span class="required">*</span>',
            optSelectState: '-- Select State --',
            lblDistrict: 'Select District <span class="required">*</span>',
            optSelectDistrict: '-- Select State First --',
            secPrimary: '<i class="fa-solid fa-id-card"></i> Primary Devotee Information',
            lblPrimaryName: 'Primary Devotee Full Name <span class="required">*</span>',
            phPrimaryName: 'Name (E.g. Rahul)',
            lblPrimaryAge: 'Age <span class="required">*</span>',
            primaryAgeSuffix: 'Yrs',
            lblNameAge: 'Devotee Full Name & Age <span class="required">*</span>',
            phNameAge: 'E.g. Rahul 35 Yrs',
            lblMobile: 'Mobile Number (10 Digits) <span class="required">*</span>',
            phMobile: 'Enter 10-digit Mobile Number',
            lblId: 'Identity Card / Aadhaar Number <span class="required">*</span>',
            phId: '12-digit Aadhaar or Passport',
            hintVisitDate: 'Valid for Today + next 6 days only',
            lblVehicle: 'Vehicle Number <span class="optional-tag">(Optional)</span>',
            phVehicle: 'E.g. UP42AB1234 (Alphanumeric only)',
            noVehicle: 'On Foot / No Vehicle',
            secCount: '<i class="fa-solid fa-users"></i> Devotee Count & Accompanying Details',
            lblDevoteeCount: 'Devotee Count (Male / Female) <span class="optional-tag">(Max 8 Devotees)</span> <span class="required">*</span>',
            lblMale: 'Male',
            lblFemale: 'Female',
            lblAccompanying: 'Accompanying Members (Name & Age)',
            phAccompanying: '1. Rahul 32 Yrs\n2. Ashwani 35 Yrs',
            secRef: '<i class="fa-solid fa-user-check"></i> Reference & Recommendation',
            lblReferredBy: 'Referred By / Recommendation Officer <span class="required">*</span>',
            optSelectRef: '-- Select Reference Officer --',
            lblOtherRef: 'Senior Officer Name & Designation <span class="required">*</span>',
            phOtherRef: 'Enter Senior Officer Name / Designation',
            submitBtn: 'Submit Application',
            
            // Modal & Slip
            successHeading: 'Application Submitted Successfully',
            successSubtitle: 'Your Shri Ram Janmabhoomi Darshan Pass details have been safely recorded.',
            receiptTitle: 'Shri Ram Janmabhoomi Darshan Pass - Slip',
            receiptSubtitle: 'Ayodhya Police • Smart Cell Ayodhya',
            slipLabelDevotee: 'Primary Devotee Name',
            slipLabelToken: 'Token ID:',
            slipLabelDatetime: 'Visit Date & Slot:',
            slipLabelTotal: 'Total Devotees:',
            slipLabelMobile: 'Mobile Number:',
            slipLabelRef: 'Reference:',
            slipFooterNote: '<i class="fa-solid fa-shield-halved"></i> This is an online acknowledgement slip only and not the final pass. The final pass will be issued upon approval by the competent police officer.',
            whatsappShare: 'Share on WhatsApp',
            downloadSlip: 'Download Slip (Save PNG)',
            printSlip: 'Print Slip / Save PDF',
            submitAnother: 'Submit Another Application',
            closeModal: 'Close',
            singleDevoteeNotice: 'Single devotee - No additional accompanying member details required.',
            trackModalTitle: '<i class="fa-solid fa-magnifying-glass" style="color: var(--primary-blue);"></i> Track Application Status',
            trackModalDesc: 'Enter Token ID, Aadhaar Number, or 10-digit Mobile Number:',
            trackSearchBtn: 'Search Status',
            trackPlaceholder: 'Token ID, Aadhaar or Mobile Number...',
            closedTitle: 'Application Session Closed',
            closedDesc: 'Your Darshan Pass application has been recorded successfully. Click below to open a new form.',
            reopenBtn: '<i class="fa-solid fa-rotate-left"></i> Open New Form',
            footerLine1: '© 2026 Ayodhya Police. All Rights Reserved.',
            footerLine2: 'Designed & Developed by Smart Cell Ayodhya'
        }
    };

    function applyLanguage(lang) {
        const t = translations[lang] || translations.hi;
        localStorage.setItem("darshan_lang", lang);

        const langBtnText = document.getElementById("lang-btn-text");
        if (langBtnText) langBtnText.textContent = t.langBtn;

        const trackNavLabel = document.getElementById("track-nav-label");
        if (trackNavLabel) trackNavLabel.textContent = t.trackBtn;

        const mainTitle = document.getElementById("main-portal-title");
        if (mainTitle) mainTitle.textContent = t.portalTitle;

        // Update all data-i18n elements
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (t[key]) {
                el.innerHTML = t[key];
            }
        });

        // Update all data-i18n-ph (placeholder) elements
        document.querySelectorAll("[data-i18n-ph]").forEach(el => {
            const key = el.getAttribute("data-i18n-ph");
            if (t[key]) {
                el.placeholder = t[key];
            }
        });

        // Update ID Label and Placeholder dynamically based on nationality
        const isIndia = !nationalitySelect || nationalitySelect.value === "India";
        if (idLabelText) {
            idLabelText.textContent = isIndia 
                ? (lang === "en" ? "Aadhaar / Passport No" : "आधार नं0 / पासपोर्ट नं0") 
                : (lang === "en" ? "Passport Number (Mandatory for International)" : "पासपोर्ट नंबर (अंतर्राष्ट्रीय श्रद्धालु हेतु अनिवार्य)");
        }
        if (idNumberInput) {
            idNumberInput.placeholder = isIndia 
                ? (lang === "en" ? "12-digit Aadhaar or Passport" : "12-अंकों का आधार या पासपोर्ट")
                : (lang === "en" ? "Passport Number (E.g. Z1234567)" : "पासपोर्ट नंबर दर्ज करें (उदा: Z1234567)");
        }

        // Update dynamic member row cards if present
        document.querySelectorAll(".member-row-card").forEach(card => {
            const idx = card.getAttribute("data-member-index");
            const badge = card.querySelector(".member-index-badge span");
            if (badge) badge.textContent = lang === "en" ? `Member ${idx}` : `साथी ${idx}`;
            const nameIn = card.querySelector(".member-name-input");
            if (nameIn) nameIn.placeholder = lang === "en" ? `Devotee ${idx} Full Name` : `सदस्य ${idx} का पूरा नाम`;
            const ageIn = card.querySelector(".member-age-input");
            if (ageIn) ageIn.placeholder = lang === "en" ? "Age" : "उम्र";
            const suffix = card.querySelector(".age-suffix");
            if (suffix) suffix.textContent = lang === "en" ? "Yrs" : "वर्ष";
        });

        // Update Searchable select triggers if they are on default/empty selection
        const stateContainer = document.querySelector('.custom-select-container[data-target="stateSelect"]');
        if (stateContainer && (!stateSelect || !stateSelect.value)) {
            const trText = stateContainer.querySelector(".trigger-text");
            if (trText) trText.textContent = t.optSelectState;
        }

        const districtContainer = document.querySelector('.custom-select-container[data-target="districtSelect"]');
        if (districtContainer && (!districtSelect || !districtSelect.value)) {
            const trText = districtContainer.querySelector(".trigger-text");
            if (trText) trText.textContent = t.optSelectDistrict;
        }

        const refContainer = document.querySelector('.custom-select-container[data-target="referredBySelect"]');
        if (refContainer && (!referredBySelect || !referredBySelect.value)) {
            const trText = refContainer.querySelector(".trigger-text");
            if (trText) trText.textContent = t.optSelectRef;
        }

        // Update custom dropdown search input placeholders
        document.querySelectorAll(".custom-search-input").forEach(si => {
            si.placeholder = lang === "en" ? "Type to search..." : "टाइप करके खोजें...";
        });

        // Refresh accompanying note based on current devotee counts
        const m = parseInt(maleCountInput ? maleCountInput.value : 1) || 1;
        const f = parseInt(femaleCountInput ? femaleCountInput.value : 0) || 0;
        updateAccompanyingRequirement(m + f);
    }

    const langToggleBtn = document.getElementById("lang-toggle-btn");
    if (langToggleBtn) {
        langToggleBtn.addEventListener("click", () => {
            const currentLang = localStorage.getItem("darshan_lang") || "hi";
            const nextLang = currentLang === "hi" ? "en" : "hi";
            applyLanguage(nextLang);
            showToast(nextLang === "en" ? "Switched to English" : "हिन्दी भाषा चुनी गई", "info");
        });
    }

    // 1-Tap Force Refresh / Cache Clear Handler
    const forceRefreshBtn = document.getElementById("force-refresh-btn");
    if (forceRefreshBtn) {
        forceRefreshBtn.addEventListener("click", async () => {
            forceRefreshBtn.classList.add("spinning");
            showToast("कैश साफ़ हो रहा है और ताज़ा पोर्टल लोड हो रहा है...", "info");

            try {
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                }
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (let reg of registrations) {
                        await reg.update();
                    }
                }
                localStorage.removeItem("darshan_form_draft");
                sessionStorage.removeItem("darshan_form_draft");
            } catch (err) {
                console.warn("Cache clean error:", err);
            }

            setTimeout(() => {
                window.location.reload(true);
            }, 450);
        });
    }

    // Auto-save form inputs
    if (form) {
        form.addEventListener("input", queueSaveDraft);
        form.addEventListener("change", queueSaveDraft);
    }

    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // VOICE TYPING (SPEECH TO TEXT) HANDLER (SINGLETON TOGGLE)
    // -------------------------------------------------------------
    let currentVoiceRecognition = null;
    let currentVoiceBtn = null;

    function stopCurrentVoiceTyping() {
        if (currentVoiceRecognition) {
            try {
                currentVoiceRecognition.abort();
            } catch (e) {}
            currentVoiceRecognition = null;
        }
        if (currentVoiceBtn) {
            currentVoiceBtn.classList.remove("listening");
            currentVoiceBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
            currentVoiceBtn = null;
        }
    }

    function setupVoiceTyping() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const micButtons = document.querySelectorAll(".voice-mic-btn");

        if (!SpeechRecognition) {
            micButtons.forEach(btn => {
                btn.style.display = "none";
            });
            document.querySelectorAll(".mic-wrapper input, .mic-wrapper textarea").forEach(inp => {
                inp.style.paddingRight = "1rem";
            });
            return;
        }

        micButtons.forEach(btn => {
            if (btn._voiceBound) return;
            btn._voiceBound = true;

            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                // If THIS button is already active, touching it again turns it OFF!
                if (currentVoiceBtn === btn) {
                    stopCurrentVoiceTyping();
                    showToast("माइक बंद कर दिया गया (Voice typing stopped)", "info");
                    return;
                }

                // If ANOTHER mic is active, stop that one first
                stopCurrentVoiceTyping();

                const targetId = btn.getAttribute("data-target");
                const targetInput = document.getElementById(targetId);
                if (!targetInput) return;

                let recognition;
                try {
                    recognition = new SpeechRecognition();
                } catch (err) {
                    console.error("Failed to create SpeechRecognition:", err);
                    showToast("वॉयस टाइपिंग शुरू नहीं हो सकी। कृपया कीबोर्ड से लिखें।", "warning");
                    return;
                }

                // Check language (Hindi or English)
                const curLang = localStorage.getItem("darshan_lang") || "hi";
                recognition.lang = curLang === "en" ? "en-IN" : "hi-IN";
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;
                recognition.continuous = false;

                currentVoiceRecognition = recognition;
                currentVoiceBtn = btn;

                btn.classList.add("listening");
                btn.innerHTML = '<i class="fa-solid fa-microphone-lines fa-beat" style="color: #ef4444;"></i>';

                recognition.onstart = () => {
                    showToast("🎙️ सुन रहा हूँ... बोलिए (Listening... speak now)", "info");
                };

                recognition.onresult = (event) => {
                    if (!event.results || !event.results[0]) return;
                    const speechResult = (event.results[0][0].transcript || "").trim();
                    if (!speechResult) return;

                    if (targetInput.tagName === "TEXTAREA") {
                        targetInput.value += (targetInput.value ? "\n" : "") + speechResult;
                    } else {
                        if (targetInput.id === "mobile") {
                            // Extract digits only for mobile number
                            const digits = speechResult.replace(/\D/g, "");
                            targetInput.value = digits ? digits.slice(0, 10) : speechResult;
                        } else if (targetInput.id === "idNumber") {
                            const cleanId = speechResult.replace(/[\s-]/g, "");
                            targetInput.value = cleanId.slice(0, 12);
                        } else if (targetInput.id === "primaryName") {
                            const extracted = extractMemberNameAndAge(speechResult);
                            targetInput.value = extracted.name.replace(/[0-9\u0966-\u096F]/g, '');
                            if (primaryAgeInput && !primaryAgeInput.value && extracted.age) {
                                primaryAgeInput.value = extracted.age;
                                primaryAgeInput.dispatchEvent(new Event("input", { bubbles: true }));
                                primaryAgeInput.dispatchEvent(new Event("change", { bubbles: true }));
                            }
                        } else if (targetInput.classList.contains("member-name-input")) {
                            const card = targetInput.closest(".member-row-card");
                            const ageIn = card ? card.querySelector(".member-age-input") : null;
                            const extracted = extractMemberNameAndAge(speechResult);
                            targetInput.value = extracted.name.replace(/[0-9\u0966-\u096F]/g, '');
                            if (ageIn && !ageIn.value && extracted.age) {
                                ageIn.value = extracted.age;
                                ageIn.dispatchEvent(new Event("input", { bubbles: true }));
                                ageIn.dispatchEvent(new Event("change", { bubbles: true }));
                            }
                        } else {
                            targetInput.value = speechResult;
                        }
                    }

                    targetInput.dispatchEvent(new Event("input", { bubbles: true }));
                    targetInput.dispatchEvent(new Event("change", { bubbles: true }));
                    showToast("✅ आवाज़ दर्ज हो गई (Voice recorded)", "success");
                    stopCurrentVoiceTyping();
                };

                recognition.onerror = (event) => {
                    console.warn("Speech recognition error:", event.error);
                    stopCurrentVoiceTyping();
                    if (event.error === "no-speech") {
                        showToast("कोई आवाज़ नहीं पहचानी गई, कृपया पुनः बोलें", "warning");
                    } else if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                        showToast("माइक्रोफ़ोन की अनुमति (Permission) नहीं मिली। कृपया ब्राउज़र में माइक अनुमति दें।", "error");
                    } else if (event.error === "network") {
                        showToast("इंटरनेट कनेक्शन समस्या के कारण वॉयस टाइपिंग नहीं हो सकी।", "warning");
                    }
                };

                recognition.onend = () => {
                    stopCurrentVoiceTyping();
                };

                try {
                    recognition.start();
                } catch (startErr) {
                    console.error("recognition.start() threw:", startErr);
                    stopCurrentVoiceTyping();
                    showToast("माइक शुरू नहीं हो सका। कृपया पुनः प्रयास करें।", "warning");
                }
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

            // Create or reuse custom container
            let customContainer = parentWrapper.querySelector(`.custom-select-container[data-target="${id}"]`);
            if (customContainer) {
                const triggerText = customContainer.querySelector(".trigger-text");
                const defaultText = selectEl.options[selectEl.selectedIndex] ? selectEl.options[selectEl.selectedIndex].textContent : "-- Select --";
                if (triggerText) triggerText.textContent = defaultText;
                if (customContainer._populateOptions) {
                    customContainer._populateOptions("");
                }
                return;
            }

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
                        <input type="text" class="custom-search-input" placeholder="टाइप करके खोजें..." autocomplete="off">
                    </div>
                    <div class="custom-options-list"></div>
                </div>
            `;

            if (selectEl.disabled) {
                customContainer.classList.add("disabled");
            }
            parentWrapper.appendChild(customContainer);

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

            customContainer._populateOptions = populateOptions;
            populateOptions("");

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
                    setTimeout(() => {
                        searchInput.focus();
                        if (window.innerWidth <= 640) {
                            customContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        }
                    }, 80);
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
    // DYNAMIC REFERENCE OFFICERS LOADER (Google Sheet Sync)
    // -------------------------------------------------------------
    const DEFAULT_REFERENCE_OFFICERS = [
        "Ref by SSP sir",
        "ADG Zone sir/ADG Zone Pro",
        "SP City Ayo",
        "SPRA Ayo",
        "SP Protocol Ayo",
        "CO Ayodhya Ayo",
        "CO City Ayo",
        "CO Bikapur Ayo",
        "CO Sadar Ayo",
        "CO Milkipur Ayo",
        "CO Rudauli Ayo",
        "CO Vigilance",
        "CO LIU Ayo",
        "CFO Ayodhya",
        "PRO SSP AYO",
        "STENO SSP Ayo",
        "ZO Intelligence",
        "DCIO IB Ayo",
        "STF Incharge Ayo",
        "Darshan Cell"
    ];

    function populateReferenceOfficersSelect(officersList) {
        if (!referredBySelect) return;
        const curVal = referredBySelect.value;
        const curLang = localStorage.getItem("darshan_lang") || "hi";
        const placeholderText = curLang === "en" ? "-- Select Reference Officer --" : "-- रेफरेंस अधिकारी चुनें --";

        referredBySelect.innerHTML = `<option value="" data-i18n="optSelectRef">${placeholderText}</option>`;

        officersList.forEach(officer => {
            const opt = document.createElement("option");
            opt.value = officer;
            opt.textContent = officer;
            referredBySelect.appendChild(opt);
        });

        // Always add Other option at the bottom
        const otherOpt = document.createElement("option");
        otherOpt.value = "Other";
        otherOpt.textContent = curLang === "en" ? "Other (Senior Officer)" : "Other (अन्य अधिकारी)";
        referredBySelect.appendChild(otherOpt);

        if (curVal) {
            referredBySelect.value = curVal;
        }

        initCustomSearchableSelects();
    }

    function loadDynamicReferenceOfficers() {
        // 1. Instant load from local cache if available
        try {
            const cached = localStorage.getItem("darshan_officers_list");
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    populateReferenceOfficersSelect(parsed);
                }
            }
        } catch (e) {}

        // 2. Fetch fresh list from Google Apps Script
        fetch(GOOGLE_APPS_SCRIPT_URL + "?action=get_officers")
            .then(res => res.json())
            .then(data => {
                if (data && data.status === "success" && Array.isArray(data.officers) && data.officers.length > 0) {
                    localStorage.setItem("darshan_officers_list", JSON.stringify(data.officers));
                    populateReferenceOfficersSelect(data.officers);
                }
            })
            .catch(err => {
                console.warn("Could not sync officers list from sheet:", err);
            });
    }

    // -------------------------------------------------------------
    // DYNAMIC ACCOMPANYING MEMBER ROWS & SYNC PIPELINE
    // -------------------------------------------------------------
    function cleanAccompanyingMemberName(rawName) {
        if (!rawName) return "";
        let str = String(rawName).trim();
        // 1. Remove leading numbering e.g. "(1) ", "1. 1.", "1.", "1)", "[1]", "#1", "1-", "1 ", "साथी 1", etc.
        str = str.replace(/^(?:साथी\s*\d+|member\s*\d+|[\d\s.\-():\[\]#•\u0966-\u096F])+/gi, '').trim();
        // 2. Remove explicit age declarations e.g. "उम्र 38 वर्ष", "उम्र 38", "38 वर्ष", "38 Yrs", "age 38"
        str = str.replace(/(?:(?:उम्र|आयु|age)\s*[:\-]?\s*\d{1,3}|\d{1,3}\s*(?:वर्ष|साल|yrs?|years?))/gi, '').trim();
        // 3. Remove standalone trailing numbers (when age is typed at the end of name)
        str = str.replace(/\b\d{1,3}\s*$/g, '').trim();
        // 4. Remove ALL other numbers / digits (English & Devanagari) completely!
        str = str.replace(/[0-9\u0966-\u096F]/g, '').trim();
        // 5. Remove residual punctuation or double spaces
        str = str.replace(/^[\s.\-:,()\[\]]+|[\s.\-:,()\[\]]+$/g, '').trim();
        str = str.replace(/\s{2,}/g, ' ').trim();
        return str;
    }

    function extractMemberNameAndAge(rawStr) {
        if (!rawStr) return { name: "", age: "" };
        let str = String(rawStr).trim();
        // 1. Strip leading numbering first so "1. Ramesh" does not make age = 1
        str = str.replace(/^(?:साथी\s*\d+|member\s*\d+|[\d\s.\-():\[\]#•\u0966-\u096F])+/gi, '').trim();

        let age = "";
        // 2. Priority 1: Explicit age declaration (e.g. "उम्र 35", "35 वर्ष", "35 Yrs", "age 35")
        const explicitMatch = str.match(/(?:(?:उम्र|आयु|age)\s*[:\-]?\s*(\d{1,3})|(\d{1,3})\s*(?:वर्ष|साल|yrs?|years?))/i);
        if (explicitMatch) {
            const num = parseInt(explicitMatch[1] || explicitMatch[2], 10);
            if (num >= 1 && num <= 120) {
                age = String(num);
                str = str.replace(/(?:(?:उम्र|आयु|age)\s*[:\-]?\s*(\d{1,3}|\d{1,3}\s*(?:वर्ष|साल|yrs?|years?)))/i, '').trim();
            }
        }

        // 3. Priority 2: Standalone trailing number at the end of the line (e.g. "Rahul 35")
        if (!age) {
            const trailingMatch = str.match(/\b(\d{1,3})\s*$/);
            if (trailingMatch) {
                const num = parseInt(trailingMatch[1], 10);
                if (num >= 1 && num <= 120) {
                    age = String(num);
                    str = str.replace(/\b\d{1,3}\s*$/, '').trim();
                }
            }
        }

        // 4. Priority 3: Standalone number anywhere in text
        if (!age) {
            const anyMatch = str.match(/\b(\d{1,3})\b/);
            if (anyMatch) {
                const num = parseInt(anyMatch[1], 10);
                if (num >= 1 && num <= 120) {
                    age = String(num);
                    str = str.replace(/\b\d{1,3}\b/, '').trim();
                }
            }
        }

        const name = cleanAccompanyingMemberName(str);
        return { name, age };
    }

    function syncAccompanyingTextarea() {
        if (!accompanyingInput) return;
        const cards = document.querySelectorAll(".member-row-card");
        if (!cards || cards.length === 0) {
            accompanyingInput.value = "लागू नहीं (अकेले दर्शनार्थी)";
            return;
        }

        const lines = [];
        cards.forEach((card, idx) => {
            const i = idx + 1;
            const nameInput = card.querySelector(".member-name-input");
            const ageInput = card.querySelector(".member-age-input");
            let rawName = nameInput ? nameInput.value.trim() : "";
            let ageVal = ageInput ? ageInput.value.trim() : "";

            // Auto-extract age only if user typed it into the name box and age box was empty
            if (!ageVal && rawName) {
                const extracted = extractMemberNameAndAge(rawName);
                if (extracted.age) {
                    ageVal = extracted.age;
                    if (ageInput) ageInput.value = ageVal;
                }
            }

            const cleanName = cleanAccompanyingMemberName(rawName);

            if (cleanName || ageVal) {
                const ageSuffix = ageVal ? ` ${ageVal} Yrs` : '';
                lines.push(`${i}. ${cleanName}${ageSuffix}`);
            }
        });

        accompanyingInput.value = lines.join("\n");
    }

    function renderAccompanyingMemberRows(extraCount, prefillMembers = null) {
        const container = document.getElementById("accompanying-rows-container");
        if (!container) return;

        // Preserve currently entered values if prefillMembers not explicitly provided
        const existingValues = [];
        if (prefillMembers && Array.isArray(prefillMembers)) {
            prefillMembers.forEach(m => existingValues.push({ name: m.name || "", age: m.age || "" }));
        } else {
            const existingCards = container.querySelectorAll(".member-row-card");
            existingCards.forEach(card => {
                const nInput = card.querySelector(".member-name-input");
                const aInput = card.querySelector(".member-age-input");
                existingValues.push({
                    name: nInput ? nInput.value : "",
                    age: aInput ? aInput.value : ""
                });
            });
        }

        container.innerHTML = "";

        const curLang = localStorage.getItem("darshan_lang") || "hi";
        const t = translations[curLang] || translations.hi;

        if (extraCount < 0) {
            container.innerHTML = `
                <div class="single-devotee-notice" style="border-color: #f59e0b; color: #b45309; background: #fffbeb;">
                    <i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b;"></i>
                    <span>${curLang === "en" ? "Please select at least 1 devotee (Male or Female) above." : "कृपया ऊपर कम से कम 1 दर्शनार्थी (पुरुष अथवा महिला) चुनें।"}</span>
                </div>
            `;
            if (accompanyingInput) accompanyingInput.value = "";
            return;
        }

        if (extraCount === 0) {
            container.innerHTML = `
                <div class="single-devotee-notice">
                    <i class="fa-solid fa-circle-check"></i>
                    <span data-i18n="singleDevoteeNotice">${t.singleDevoteeNotice || "अकेले दर्शनार्थी हैं - अतिरिक्त साथी विवरण की आवश्यकता नहीं है।"}</span>
                </div>
            `;
            if (accompanyingInput) accompanyingInput.value = "लागू नहीं (अकेले दर्शनार्थी)";
            return;
        }

        for (let i = 1; i <= extraCount; i++) {
            const prev = existingValues[i - 1] || { name: "", age: "" };
            const card = document.createElement("div");
            card.className = "member-row-card";
            card.setAttribute("data-member-index", i);

            const memberBadgeText = (curLang === "en" ? `Member ${i}` : `साथी ${i}`);
            const namePlaceholder = (curLang === "en" ? `Devotee ${i} Full Name` : `सदस्य ${i} का पूरा नाम`);
            const agePlaceholder = (curLang === "en" ? "Age" : "उम्र");
            const yrsSuffix = (curLang === "en" ? "Yrs" : "वर्ष");

            card.innerHTML = `
                <div class="member-index-badge">
                    <i class="fa-solid fa-user-tag"></i> <span>${memberBadgeText}</span>
                </div>
                <div class="member-inputs-grid">
                    <div class="input-wrapper mic-wrapper">
                        <input type="text" class="member-name-input" id="member-name-${i}" placeholder="${namePlaceholder}" value="${prev.name}" autocomplete="off">
                        <button type="button" class="voice-mic-btn" data-target="member-name-${i}" title="बोलकर टाइप करें (Voice Typing)">
                            <i class="fa-solid fa-microphone"></i>
                        </button>
                    </div>
                    <div class="member-age-wrapper">
                        <input type="number" class="member-age-input" id="member-age-${i}" placeholder="${agePlaceholder}" min="1" max="120" value="${prev.age}" autocomplete="off">
                        <span class="age-suffix">${yrsSuffix}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }

        // Attach speech-to-text recognition to newly created mic buttons
        setupVoiceTyping();

        // Attach input listeners to dynamically sync with textarea and auto-save draft
        container.querySelectorAll(".member-row-card").forEach(card => {
            const nameInput = card.querySelector(".member-name-input");
            const ageInput = card.querySelector(".member-age-input");

            if (nameInput) {
                const cleanName = () => {
                    if (/[0-9\u0966-\u096F]/.test(nameInput.value)) {
                        nameInput.value = nameInput.value.replace(/[0-9\u0966-\u096F]/g, '');
                        showNameNumberBlockedFeedback(nameInput);
                    }
                    nameInput.value = nameInput.value.replace(/[^a-zA-Z\u0900-\u097F\s.]/g, '');
                    syncAccompanyingTextarea();
                    queueSaveDraft();
                };
                nameInput.addEventListener("input", cleanName);

                // Smart multi-item / WhatsApp list paste handler
                nameInput.addEventListener("paste", (e) => {
                    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                    if (!pastedText) return;

                    let items = [];
                    if (pastedText.includes("\n") || pastedText.includes("\r")) {
                        items = pastedText.split(/[\r\n]+/).map(s => s.trim()).filter(Boolean);
                    } else if (/\b\d+[\.\)]\s+/.test(pastedText)) {
                        items = pastedText.split(/(?=\b\d+[\.\)]\s+)/).map(s => s.trim()).filter(Boolean);
                    }

                    if (items.length > 1) {
                        e.preventDefault();
                        const currentCardIdx = parseInt(card.getAttribute("data-member-index") || "1", 10);
                        const allCards = document.querySelectorAll(".member-row-card");

                        items.forEach((item, pIdx) => {
                            const targetIdx = currentCardIdx - 1 + pIdx;
                            if (targetIdx < allCards.length) {
                                const targetCard = allCards[targetIdx];
                                const nIn = targetCard.querySelector(".member-name-input");
                                const aIn = targetCard.querySelector(".member-age-input");

                                const extracted = extractMemberNameAndAge(item);
                                if (nIn) nIn.value = extracted.name.replace(/[0-9\u0966-\u096F]/g, '');
                                if (aIn && extracted.age) aIn.value = extracted.age;
                            }
                        });

                        syncAccompanyingTextarea();
                        showToast("सूची से सदस्यों का विवरण स्वतः भर गया!", "success");
                    } else if (/[0-9\u0966-\u096F]/.test(pastedText)) {
                        // Single item with embedded age/number pasted into companion name box
                        e.preventDefault();
                        const extracted = extractMemberNameAndAge(pastedText);
                        nameInput.value = extracted.name.replace(/[0-9\u0966-\u096F]/g, '');
                        if (ageInput && !ageInput.value && extracted.age) {
                            ageInput.value = extracted.age;
                            showToast("नाम व उम्र स्वतः अलग-अलग बॉक्स में भर दिए गए!", "success");
                        } else {
                            showNameNumberBlockedFeedback(nameInput);
                        }
                        syncAccompanyingTextarea();
                        queueSaveDraft();
                    }
                });
            }

            if (ageInput) {
                ageInput.addEventListener("input", () => {
                    let ageVal = parseInt(ageInput.value, 10);
                    if (ageVal > 120) ageInput.value = 120;
                    syncAccompanyingTextarea();
                    queueSaveDraft();
                });
            }
        });

        syncAccompanyingTextarea();
    }

    function updateAccompanyingRequirement(totalCount, prefillMembers = null) {
        const accGroup = document.getElementById("accompanying-group");
        const accNote = document.getElementById("accompanying-note");
        const accReq = document.getElementById("accompanying-required");
        const accError = document.getElementById("accompanying-error");

        const curLang = localStorage.getItem("darshan_lang") || "hi";
        if (totalCount === 0) {
            if (accompanyingInput) {
                accompanyingInput.required = false;
                accompanyingInput.value = "";
            }
            if (accReq) accReq.style.display = "none";
            if (accNote) accNote.textContent = curLang === "en" ? "(Please select at least 1 devotee above)" : "(कृपया ऊपर कम से कम 1 दर्शनार्थी चुनें)";
            if (accGroup) {
                accGroup.classList.remove("invalid");
                accGroup.classList.add("single-devotee");
            }
            if (accError) accError.style.display = "none";
            renderAccompanyingMemberRows(-1);
            return;
        }

        if (totalCount === 1) {
            if (accompanyingInput) {
                accompanyingInput.required = false;
            }
            if (accReq) accReq.style.display = "none";
            if (accNote) accNote.textContent = curLang === "en" ? "(Not Applicable for Single Devotee)" : "(अकेले दर्शनार्थी हेतु लागू नहीं)";
            if (accGroup) {
                accGroup.classList.remove("invalid");
                accGroup.classList.add("single-devotee");
            }
            if (accError) accError.style.display = "none";
            renderAccompanyingMemberRows(0);
        } else {
            if (accompanyingInput) {
                accompanyingInput.required = true;
            }
            if (accReq) accReq.style.display = "inline";
            const extra = totalCount - 1;
            if (accNote) accNote.textContent = curLang === "en" ? `(Please enter name & age of remaining ${extra} accompanying members)` : `(मुख्य दर्शनार्थी के अतिरिक्त अन्य ${extra} साथी सदस्यों के नाम व उम्र लिखें)`;
            if (accGroup) {
                accGroup.classList.remove("single-devotee");
            }
            if (accError) accError.style.display = "none";
            renderAccompanyingMemberRows(extra, prefillMembers);
        }
    }

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

            const total = mVal + fVal;
            const isCountValid = total >= 1 && total <= 8;
            markGroup(maleCountInput, isCountValid);
            const countErr = document.getElementById("count-error");
            if (countErr) {
                if (total === 0) {
                    countErr.textContent = (localStorage.getItem("darshan_lang") === "en") 
                        ? "Please enter at least 1 devotee (Male or Female)" 
                        : "कृपया कम से कम 1 दर्शनार्थी (पुरुष अथवा महिला) दर्ज करें";
                    countErr.style.display = "block";
                } else {
                    countErr.style.display = "";
                }
            }
            updateAccompanyingRequirement(total);
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

            const total = mVal + fVal;
            const isCountValid = total >= 1 && total <= 8;
            markGroup(maleCountInput, isCountValid);
            const countErr = document.getElementById("count-error");
            if (countErr) {
                if (total === 0) {
                    countErr.textContent = (localStorage.getItem("darshan_lang") === "en") 
                        ? "Please enter at least 1 devotee (Male or Female)" 
                        : "कृपया कम से कम 1 दर्शनार्थी (पुरुष अथवा महिला) दर्ज करें";
                    countErr.style.display = "block";
                } else {
                    countErr.style.display = "";
                }
            }
            updateAccompanyingRequirement(total);
        }

        maleCountInput.addEventListener("input", handleMaleInput);
        maleCountInput.addEventListener("change", handleMaleInput);
        femaleCountInput.addEventListener("input", handleFemaleInput);
        femaleCountInput.addEventListener("change", handleFemaleInput);

        // Stepper button (+ / -) handler
        document.querySelectorAll(".stepper-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute("data-target");
                const input = document.getElementById(targetId);
                if (!input) return;
                let val = parseInt(input.value) || 0;
                if (btn.classList.contains("plus-btn")) {
                    const otherId = (targetId === "maleCount") ? "femaleCount" : "maleCount";
                    const otherInput = document.getElementById(otherId);
                    const otherVal = otherInput ? (parseInt(otherInput.value) || 0) : 0;
                    if (val + otherVal >= 8) {
                        showToast(localStorage.getItem("darshan_lang") === "en" ? "Maximum 8 devotees allowed" : "अधिकतम 8 दर्शनार्थी ही अनुमन्य हैं", "warning");
                        return;
                    }
                    val += 1;
                } else if (btn.classList.contains("minus-btn")) {
                    const otherId = (targetId === "maleCount") ? "femaleCount" : "maleCount";
                    const otherInput = document.getElementById(otherId);
                    const otherVal = otherInput ? (parseInt(otherInput.value) || 0) : 0;
                    const minAllowed = (otherVal === 0) ? 1 : 0;
                    if (val <= minAllowed) {
                        showToast(localStorage.getItem("darshan_lang") === "en" ? "At least 1 devotee is required" : "कम से कम 1 दर्शनार्थी होना आवश्यक है", "warning");
                        return;
                    }
                    val = Math.max(0, val - 1);
                }
                input.value = val;
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.dispatchEvent(new Event("change", { bubbles: true }));
            });
        });

        // Run initially for current values (default: 1 Male + 0 Female = 1 Single Devotee)
        const initialTotal = (parseInt(maleCountInput.value) || 0) + (parseInt(femaleCountInput.value) || 0);
        updateAccompanyingRequirement(initialTotal);
    }

    // 1. Clear any old draft and reset form on page refresh / load so it is always 100% brand new
    clearFormDraft();
    resetFormState();

    // 2. Clear tracking modal inputs on page load
    if (trackQueryInput) trackQueryInput.value = "";
    if (trackResultBox) {
        trackResultBox.classList.add("hidden");
        trackResultBox.innerHTML = "";
    }

    // 3. Default language to Hindi on every page refresh / load
    localStorage.setItem("darshan_lang", "hi");
    applyLanguage("hi");

    // 4. Initialize Voice Typing, Devotee Count Limit & Searchable Dropdowns
    setupVoiceTyping();
    enforceDevoteeCountLimit();
    initCustomSearchableSelects();
    loadDynamicReferenceOfficers();

    // -------------------------------------------------------------
    // PROGRESSIVE WEB APP (PWA) INSTALL & SERVICE WORKER
    // -------------------------------------------------------------
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('PWA ServiceWorker registered with scope:', reg.scope))
                .catch(err => console.warn('PWA ServiceWorker registration error:', err));
        });
    }

    let deferredPrompt = null;
    const pwaInstallBtn = document.getElementById("pwa-install-btn");
    const iosInstallModal = document.getElementById("ios-install-modal");
    const closeIosModalBtn = document.getElementById("close-ios-modal-btn");
    const iosGotItBtn = document.getElementById("ios-got-it-btn");

    // Detect if already installed / running in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone && pwaInstallBtn) {
        pwaInstallBtn.style.display = "none";
    }

    // Android/Chrome/Edge native install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (pwaInstallBtn) {
            pwaInstallBtn.style.display = "inline-flex";
        }
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        if (pwaInstallBtn) pwaInstallBtn.style.display = "none";
        showToast("श्रीरामजन्मभूमि दर्शन पास ऐप सफलतापूर्वक आपके डिवाइस पर इंस्टॉल हो गया!", "success");
    });

    if (pwaInstallBtn) {
        pwaInstallBtn.addEventListener('click', async () => {
            // Check if iOS
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) {
                if (iosInstallModal) {
                    iosInstallModal.classList.remove("hidden");
                    syncBodyModalLock();
                }
                return;
            }

            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    pwaInstallBtn.style.display = "none";
                }
                deferredPrompt = null;
            } else {
                // If browser has not fired beforeinstallprompt or desktop Safari/Firefox
                showToast("ब्राउज़र के ऊपर दाईं ओर मेनू (⋮) पर क्लिक करके 'Install app' या 'Add to Home screen' चुनें।", "info");
            }
        });
    }

    if (closeIosModalBtn && iosInstallModal) {
        closeIosModalBtn.addEventListener('click', () => {
            iosInstallModal.classList.add("hidden");
            syncBodyModalLock();
        });
    }
    if (iosGotItBtn && iosInstallModal) {
        iosGotItBtn.addEventListener('click', () => {
            iosInstallModal.classList.add("hidden");
            syncBodyModalLock();
        });
    }
    if (iosInstallModal) {
        iosInstallModal.addEventListener('click', (e) => {
            if (e.target === iosInstallModal) {
                iosInstallModal.classList.add("hidden");
                syncBodyModalLock();
            }
        });
    }

    // Global Escape key listener to dismiss open modals smoothly
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (trackPassModal && !trackPassModal.classList.contains("hidden")) {
                trackPassModal.classList.add("hidden");
            }
            if (iosInstallModal && !iosInstallModal.classList.contains("hidden")) {
                iosInstallModal.classList.add("hidden");
            }
            if (successModal && !successModal.classList.contains("hidden")) {
                closeFormSession();
            }
            syncBodyModalLock();
        }
    });

    // Background silent sync of latest sheet row for instant token generator
    function silentSyncSheetRow() {
        try {
            fetch(GOOGLE_APPS_SCRIPT_URL)
                .then(r => r.json())
                .then(d => {
                    if (d && d.lastRow) {
                        localStorage.setItem("darshan_last_row", String(d.lastRow));
                    }
                })
                .catch(() => {});
        } catch(e) {}
    }
    // Initial background sync of sheet row on page load
    silentSyncSheetRow();

    // -------------------------------------------------------------
    // ONLINE / OFFLINE NETWORK STATUS NOTIFICATIONS (ITEM 1.3)
    // -------------------------------------------------------------
    window.addEventListener("online", () => {
        showToast("इंटरनेट कनेक्शन पुनः जुड़ गया है।", "success");
    });
    window.addEventListener("offline", () => {
        showToast("इंटरनेट कनेक्शन कट गया है। कृपया नेटवर्क जांचें।", "warning");
    });
});
