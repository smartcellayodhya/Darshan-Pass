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

    // Calculate local today and max 30-day date string (ITEM 3)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const maxDateObj = new Date();
    maxDateObj.setDate(maxDateObj.getDate() + 30);
    const maxYear = maxDateObj.getFullYear();
    const maxMonth = String(maxDateObj.getMonth() + 1).padStart(2, '0');
    const maxDay = String(maxDateObj.getDate()).padStart(2, '0');
    const maxDateStr = `${maxYear}-${maxMonth}-${maxDay}`;

    if (visitDateInput) {
        visitDateInput.setAttribute("min", todayStr);
        visitDateInput.setAttribute("max", maxDateStr);
        visitDateInput.value = todayStr; // Pre-select today's date by default

        // Dynamically block past dates or dates beyond 30 days
        visitDateInput.addEventListener("change", () => {
            if (visitDateInput.value < todayStr) {
                visitDateInput.value = todayStr;
                showToast("पिछली तिथि नहीं चुनी जा सकती।", "warning");
            } else if (visitDateInput.value > maxDateStr) {
                visitDateInput.value = maxDateStr;
                showToast("दर्शन पास अधिकतम 30 दिन आगे तक ही बुक किया जा सकता है।", "warning");
            }
        });
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
        noVehicleCheck.addEventListener("change", () => {
            if (noVehicleCheck.checked) {
                vehicleNoInput.value = "पैदल (On Foot)";
                vehicleNoInput.disabled = true;
                markGroup(vehicleNoInput, true);
            } else {
                vehicleNoInput.value = "";
                vehicleNoInput.disabled = false;
                markGroup(vehicleNoInput, true);
            }
        });
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

    // UNIQUE APPLICATION TOKEN GENERATOR (AYO-YYYYMMDD-ROW)
    function generateTokenId(rowNumber) {
        const now = new Date();
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

        // Try direct POST first to read exact atomic row number assigned by Google Sheets
        try {
            const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: payloadStr
            });
            if (res.ok) {
                const data = await res.json();
                if (data && (data.rowNumber || data.row)) {
                    assignedRow = parseInt(data.rowNumber || data.row, 10);
                    localStorage.setItem("darshan_last_row", String(assignedRow));
                }
            }
        } catch (postErr) {
            // If cross-origin redirect prevents reading JSON, fall through to robust delivery
            console.warn("Direct POST JSON response unavailable, falling back to guaranteed delivery...", postErr);
        }

        // Guaranteed delivery fallback via no-cors if direct POST did not return assignedRow
        if (!assignedRow) {
            try {
                await fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "text/plain" },
                    body: payloadStr
                });
            } catch (fetchErr) {
                console.warn("Direct transmission fallback via sendBeacon...", fetchErr);
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(GOOGLE_APPS_SCRIPT_URL, payloadStr);
                }
            }
        }

        // Silent background query to refresh actual Google Sheet row counter
        setTimeout(() => {
            fetch(GOOGLE_APPS_SCRIPT_URL)
                .then(r => r.json())
                .then(d => {
                    if (d && d.lastRow) {
                        localStorage.setItem("darshan_last_row", String(d.lastRow));
                    }
                })
                .catch(() => {});
        }, 150);

        return {
            success: true,
            rowNumber: assignedRow
        };
    }

    // -------------------------------------------------------------
    // DUPLICATE SUBMISSION CHECKER (ITEM 2)
    // -------------------------------------------------------------
    function getSubmissionsHistory() {
        try {
            return JSON.parse(localStorage.getItem("darshan_submissions_history") || "[]");
        } catch (e) {
            return [];
        }
    }

    function checkDuplicateSubmission(mobile, visitDate, visitSlot) {
        if (!mobile || !visitDate || !visitSlot) return false;
        const history = getSubmissionsHistory();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const now = Date.now();
        return history.some(item => {
            return item.mobile === mobile &&
                   item.visitDate === visitDate &&
                   item.visitSlot === visitSlot &&
                   (now - (item.timestamp || 0)) < oneDayMs;
        });
    }

    function recordSubmission(mobile, visitDate, visitSlot, token) {
        try {
            const history = getSubmissionsHistory();
            history.unshift({
                mobile: mobile,
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
    // DRAFT AUTO-SAVE & RESTORE (ITEM 5)
    // -------------------------------------------------------------
    function saveFormDraft() {
        if (!form) return;
        try {
            const memberRows = [];
            document.querySelectorAll(".member-row-card").forEach(card => {
                const nameEl = card.querySelector(".member-name-input");
                const ageEl = card.querySelector(".member-age-input");
                if (nameEl || ageEl) {
                    memberRows.push({
                        name: nameEl ? nameEl.value : "",
                        age: ageEl ? ageEl.value : ""
                    });
                }
            });

            const draft = {
                visitDate: visitDateInput ? visitDateInput.value : "",
                visitSlot: visitSlotSelect ? visitSlotSelect.value : "",
                nationality: nationalitySelect ? nationalitySelect.value : "India",
                stateSelect: stateSelect ? stateSelect.value : "",
                districtSelect: districtSelect ? districtSelect.value : "",
                countrySelect: countrySelect ? countrySelect.value : "",
                idNumber: idNumberInput ? idNumberInput.value : "",
                nameAge: nameAgeInput ? nameAgeInput.value : "",
                maleCount: maleCountInput ? maleCountInput.value : "1",
                femaleCount: femaleCountInput ? femaleCountInput.value : "0",
                mobile: mobileInput ? mobileInput.value : "",
                vehicleNo: vehicleNoInput ? vehicleNoInput.value : "",
                noVehicle: noVehicleCheck ? noVehicleCheck.checked : false,
                accompanying: accompanyingInput ? accompanyingInput.value : "",
                accompanyingMembers: memberRows,
                referredBySelect: referredBySelect ? referredBySelect.value : "",
                otherRefName: otherRefNameInput ? otherRefNameInput.value : "",
                timestamp: Date.now()
            };
            localStorage.setItem("darshan_form_draft", JSON.stringify(draft));
        } catch (e) {}
    }

    function clearFormDraft() {
        localStorage.removeItem("darshan_form_draft");
    }

    let draftDebounceTimer = null;
    function queueSaveDraft() {
        clearTimeout(draftDebounceTimer);
        draftDebounceTimer = setTimeout(saveFormDraft, 400);
    }

    function restoreFormDraft() {
        try {
            const draftStr = localStorage.getItem("darshan_form_draft");
            if (!draftStr) return;
            const draft = JSON.parse(draftStr);
            if (!draft) return;

            // Only restore if draft is less than 48 hours old
            if (Date.now() - (draft.timestamp || 0) > 48 * 60 * 60 * 1000) {
                clearFormDraft();
                return;
            }

            if (draft.nationality && nationalitySelect) {
                nationalitySelect.value = draft.nationality;
                nationalitySelect.dispatchEvent(new Event("change"));
            }
            if (draft.visitDate && visitDateInput && draft.visitDate >= todayStr && draft.visitDate <= maxDateStr) {
                visitDateInput.value = draft.visitDate;
            }
            if (draft.visitSlot && visitSlotSelect) {
                visitSlotSelect.value = draft.visitSlot;
            }
            if (draft.stateSelect && stateSelect) {
                stateSelect.value = draft.stateSelect;
                stateSelect.dispatchEvent(new Event("change"));
                if (draft.districtSelect && districtSelect) {
                    setTimeout(() => {
                        districtSelect.value = draft.districtSelect;
                        districtSelect.dispatchEvent(new Event("change"));
                    }, 80);
                }
            }
            if (draft.countrySelect && countrySelect) {
                countrySelect.value = draft.countrySelect;
            }
            if (draft.idNumber && idNumberInput) idNumberInput.value = draft.idNumber;
            if (draft.nameAge && nameAgeInput) nameAgeInput.value = draft.nameAge;
            if (draft.maleCount && maleCountInput) maleCountInput.value = draft.maleCount;
            if (draft.femaleCount && femaleCountInput) femaleCountInput.value = draft.femaleCount;
            if (draft.mobile && mobileInput) mobileInput.value = draft.mobile;
            
            if (draft.noVehicle && noVehicleCheck) {
                noVehicleCheck.checked = true;
                noVehicleCheck.dispatchEvent(new Event("change"));
            } else if (draft.vehicleNo && vehicleNoInput) {
                vehicleNoInput.value = draft.vehicleNo;
            }

            if (draft.accompanying && accompanyingInput) accompanyingInput.value = draft.accompanying;
            if (draft.referredBySelect && referredBySelect) {
                referredBySelect.value = draft.referredBySelect;
                referredBySelect.dispatchEvent(new Event("change"));
                if (draft.otherRefName && otherRefNameInput) {
                    otherRefNameInput.value = draft.otherRefName;
                }
            }

            const totalDev = (parseInt(draft.maleCount) || 1) + (parseInt(draft.femaleCount) || 0);
            updateAccompanyingRequirement(totalDev, draft.accompanyingMembers || null);

            showToast("अंतिम अधूरा ड्राफ्ट स्वतः लोड हो गया है।", "info");
        } catch (e) {
            console.warn("Could not restore draft:", e);
        }
    }

    function resetFormState() {
        if (form) form.reset();
        if (visitDateInput) {
            visitDateInput.setAttribute("min", todayStr);
            visitDateInput.value = todayStr;
        }
        if (noVehicleCheck) {
            noVehicleCheck.checked = false;
        }
        if (vehicleNoInput) {
            vehicleNoInput.disabled = false;
            vehicleNoInput.value = "";
        }
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

        // Reset devotee count defaults (1 Male, 0 Female = 1 Total Single Devotee)
        if (maleCountInput) maleCountInput.value = "1";
        if (femaleCountInput) femaleCountInput.value = "0";
        updateAccompanyingRequirement(1);
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

                    let rowValid = true;
                    if (!nVal || nVal.length < 2) {
                        rowValid = false;
                        if (firstInvalidIndex === -1) {
                            firstInvalidIndex = idx + 1;
                            invalidFieldType = "name";
                        }
                    } else if (isNaN(aVal) || aVal < 10 || aVal > 120) {
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
                        if (invalidFieldType === "age") {
                            accErrorEl.textContent = `कृपया साथी ${firstInvalidIndex} की सही उम्र (10 से 120 वर्ष) दर्ज करें`;
                        } else {
                            accErrorEl.textContent = `कृपया साथी ${firstInvalidIndex} का पूरा नाम दर्ज करें`;
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

            // DUPLICATE SUBMISSION CHECK (ITEM 2: Prevent duplicate within 24h)
            if (checkDuplicateSubmission(mobVal, formattedDateStr, slotVal)) {
                showToast("इस मोबाइल नंबर से आज इस स्लॉट के लिए आवेदन पहले से दर्ज है।", "warning");
                const mobErr = document.getElementById("mobile-error");
                if (mobErr) mobErr.textContent = "इस मोबाइल नंबर से इस तारीख व स्लॉट हेतु आवेदन पहले से दर्ज है";
                if (mobileInput) {
                    markGroup(mobileInput, false);
                    mobileInput.focus();
                }
                return;
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

            const devoteeNameVal = getVal("nameAge");
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

            // Fast provisional token ID from pre-synced background row counter
            let currentCounter = parseInt(localStorage.getItem("darshan_last_row") || "1545", 10) + 1;
            let tokenNumber = generateTokenId(currentCounter);
            formData.token = tokenNumber;

            try {
                // Direct single transmission pipeline (~1.5s)
                const sendResult = await sendDataWithRowFeedback(formData);

                // If Google Apps Script returned the exact atomic row assigned to this entry, update Token ID seamlessly
                if (sendResult && sendResult.rowNumber) {
                    currentCounter = sendResult.rowNumber;
                    localStorage.setItem("darshan_last_row", String(currentCounter));
                    tokenNumber = generateTokenId(currentCounter);
                } else {
                    localStorage.setItem("darshan_last_row", String(currentCounter));
                }

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
                if (slipTotalDevotees) slipTotalDevotees.textContent = `${totalCount} (पुरुष: ${mVal}, महिला: ${fVal})`;
                if (slipMobile) slipMobile.textContent = formData.mobile;
                if (slipReferredBy) slipReferredBy.textContent = finalReferredBy;

                // Record submission & clear draft
                recordSubmission(formData.mobile, formattedDateStr, slotVal, tokenNumber);
                clearFormDraft();

                // Display Success Modal
                if (successModal) {
                    successModal.classList.remove("hidden");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }

                showToast("आवेदन सफलतापूर्वक दर्ज हो गया!", "success");
            } catch (err) {
                console.error("Submission error:", err);
                showToast("आवेदन सबमिट करने में समस्या आई। कृपया पुनः प्रयास करें।", "error");
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

            try {
                downloadSlipBtn.disabled = true;
                downloadSlipBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> डाउनलोड हो रहा है...';

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

                showToast("रसीद सफलतापूर्वक डाउनलोड हो गई!", "success");
            } catch (err) {
                if (copyBtn) copyBtn.style.display = "";
                console.error("Slip image download error:", err);
                showToast("डाउनलोड में समस्या आई, कृपया प्रिंट विकल्प का प्रयोग करें।", "error");
            } finally {
                if (copyBtn) copyBtn.style.display = "";
                downloadSlipBtn.disabled = false;
                downloadSlipBtn.innerHTML = '<i class="fa-solid fa-circle-down"></i> <span id="download-slip-text">रसीद डाउनलोड</span>';
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

टोकन ID: ${tokenId}
मुख्य दर्शनार्थी: ${devoteeName}
दर्शन तिथि व समय: ${visitDatetime}
कुल दर्शनार्थी: ${totalDevotees}
मोबाइल नंबर: ${mobile}
रेफरेंस: ${referredBy}

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
        });
    }

    if (trackPassModal) {
        trackPassModal.addEventListener("click", (e) => {
            if (e.target === trackPassModal) {
                trackPassModal.classList.add("hidden");
            }
        });
    }

    if (submitTrackBtn && trackQueryInput && trackResultBox) {
        async function fetchTrackData(query) {
            const encoded = encodeURIComponent(query);
            const trackUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=track&query=${encoded}&_t=${Date.now()}`;

            // Attempt 1: Modern fetch with follow redirect
            try {
                const res = await fetch(trackUrl, {
                    method: "GET",
                    cache: "no-store",
                    redirect: "follow"
                });
                if (res.ok) {
                    const json = await res.json();
                    if (json) return json;
                }
            } catch (fetchErr) {
                console.warn("Direct fetch error in track, trying XHR fallback...", fetchErr);
            }

            // Attempt 2: XMLHttpRequest fallback (bulletproof for cross-origin redirects)
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", trackUrl, true);
                xhr.timeout = 20000;
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            resolve(data);
                        } catch (parseErr) {
                            reject(parseErr);
                        }
                    } else {
                        reject(new Error("Server returned status " + xhr.status));
                    }
                };
                xhr.onerror = function() {
                    reject(new Error("Network error during track request"));
                };
                xhr.ontimeout = function() {
                    reject(new Error("Track request timed out"));
                };
                xhr.send();
            });
        }

        async function executeTrackSearch() {
            const query = trackQueryInput.value.trim();
            if (!query) {
                showToast("कृपया टोकन ID या 10-अंकों का मोबाइल नंबर दर्ज करें", "warning");
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
                    const statusStr = (item.status || "Pending").trim();
                    let statusClass = "status-pending";
                    let statusHindi = "प्रक्रियाधीन";

                    if (statusStr.toLowerCase().includes("already") || statusStr.includes("अन्य काउंटर")) {
                        statusClass = "status-already-created";
                        statusHindi = "अन्य काउंटर से जारी";
                    } else if (statusStr.toLowerCase().includes("pass") || statusStr.toLowerCase().includes("created") || statusStr === "स्वीकृत") {
                        statusClass = "status-pass-created";
                        statusHindi = "पास जारी";
                    } else if (statusStr.toLowerCase().includes("reject") || statusStr === "निरस्त") {
                        statusClass = "status-rejected";
                        statusHindi = "निरस्त";
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
                    const cleanToken = formatTrackToken(item.visitDate, item.rowNumber);

                    let statusIcon = "fa-clock";
                    let statusSub = "आवेदन पर विचार चल रहा है";
                    if (statusClass === "status-pass-created") {
                        statusIcon = "fa-circle-check";
                        statusSub = "पास स्वीकृत एवं तैयार है";
                    } else if (statusClass === "status-already-created") {
                        statusIcon = "fa-id-card-clip";
                        statusSub = "पास अन्य काउंटर से जारी है";
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
            lblNameAge: 'मुख्य दर्शनार्थी का नाम व उम्र <span class="required">*</span>',
            phNameAge: 'उदा: Rahul 35 Yrs',
            lblMobile: 'मोबाइल नंबर <span class="required">*</span>',
            phMobile: '10 अंकों का मोबाइल नंबर दर्ज करें',
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
            slipLabelToken: 'टोकन ID:',
            slipLabelDatetime: 'दर्शन तिथि व स्लॉट:',
            slipLabelTotal: 'कुल दर्शनार्थी:',
            slipLabelMobile: 'मोबाइल नंबर:',
            slipLabelRef: 'रेफरेंस:',
            slipFooterNote: '<i class="fa-solid fa-shield-halved"></i> यह ऑनलाइन आवेदन पावती है, इसको अन्तिम पास नही माना जायेगा। अंतिम पास सक्षम पुलिस अधिकारी के अनुमोदन के उपरांत जारी होगा।',
            whatsappShare: 'WhatsApp शेयर',
            downloadSlip: 'रसीद डाउनलोड',
            printSlip: 'प्रिंट / PDF',
            submitAnother: 'दूसरा फॉर्म',
            closeModal: 'बंद करें',
            singleDevoteeNotice: 'अकेले दर्शनार्थी हैं - अतिरिक्त साथी विवरण की आवश्यकता नहीं है।',
            trackModalTitle: '<i class="fa-solid fa-magnifying-glass" style="color: var(--primary-blue);"></i> आवेदन स्थिति जांचें',
            trackModalDesc: 'टोकन ID या 10-अंकों का मोबाइल नंबर दर्ज करें:',
            trackSearchBtn: 'खोजें',
            trackPlaceholder: 'टोकन ID या मोबाइल नंबर...',
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
            lblNameAge: 'Devotee Full Name & Age <span class="required">*</span>',
            phNameAge: 'E.g. Rahul 35 Yrs',
            lblMobile: 'Mobile Number (10 Digits) <span class="required">*</span>',
            phMobile: 'Enter 10-digit Mobile Number',
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
            slipLabelRef: 'Reference / Recommended By:',
            slipFooterNote: '<i class="fa-solid fa-shield-halved"></i> This is an online acknowledgement slip only and not the final pass. The final pass will be issued upon approval by the competent police officer.',
            whatsappShare: 'Share on WhatsApp',
            downloadSlip: 'Download Slip (Save PNG)',
            printSlip: 'Print Slip / Save PDF',
            submitAnother: 'Submit Another Application',
            closeModal: 'Close',
            singleDevoteeNotice: 'Single devotee - No additional accompanying member details required.',
            trackModalTitle: '<i class="fa-solid fa-magnifying-glass" style="color: var(--primary-blue);"></i> Track Application Status',
            trackModalDesc: 'Enter your Token ID (e.g. AYO-20260913-145) or 10-digit Mobile Number:',
            trackSearchBtn: 'Search Status',
            trackPlaceholder: 'Token ID or 10-digit Mobile Number...',
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
                ? (lang === "en" ? "Enter 12-digit Aadhaar No. or Passport No." : "12-अंकों का आधार नंबर या पासपोर्ट नंबर दर्ज करें")
                : (lang === "en" ? "Enter Passport Number (E.g. Z1234567)" : "पासपोर्ट नंबर दर्ज करें (उदा: Z1234567)");
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

    // Auto-save form inputs
    if (form) {
        form.addEventListener("input", queueSaveDraft);
        form.addEventListener("change", queueSaveDraft);
    }

    // -------------------------------------------------------------
    // VOICE TYPING (SPEECH TO TEXT) HANDLER
    // -------------------------------------------------------------
    function setupVoiceTyping() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const micButtons = document.querySelectorAll(".voice-mic-btn");

        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported in this browser.");
            micButtons.forEach(btn => {
                if (btn._voiceBound) return;
                btn._voiceBound = true;
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    showToast("आपका ब्राउज़र वॉयस टाइपिंग का समर्थन नहीं करता है। कृपया कीबोर्ड से टाइप करें।", "warning");
                });
            });
            return;
        }

        micButtons.forEach(btn => {
            if (btn._voiceBound) return;
            btn._voiceBound = true;
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
                            <input type="text" class="custom-search-input" placeholder="टाइप करके खोजें..." autocomplete="off">
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
    // DYNAMIC ACCOMPANYING MEMBER ROWS & SYNC PIPELINE
    // -------------------------------------------------------------
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
            const nameVal = nameInput ? nameInput.value.trim() : "";
            const ageVal = ageInput ? ageInput.value.trim() : "";

            if (nameVal || ageVal) {
                lines.push(`${i}. ${nameVal}${ageVal ? ' ' + ageVal + ' Yrs' : ''}`);
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

        if (extraCount <= 0) {
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
                        <input type="number" class="member-age-input" id="member-age-${i}" placeholder="${agePlaceholder}" min="10" max="120" value="${prev.age}" autocomplete="off">
                        <span class="age-suffix">${yrsSuffix}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }

        // Attach speech-to-text recognition to newly created mic buttons
        setupVoiceTyping();

        // Attach input listeners to dynamically sync with textarea and auto-save draft
        container.querySelectorAll(".member-name-input").forEach(input => {
            const cleanName = () => {
                input.value = input.value.replace(/[^a-zA-Z0-9\u0900-\u097F\u0966-\u096F\s.]/g, '');
                syncAccompanyingTextarea();
                queueSaveDraft();
            };
            input.addEventListener("input", cleanName);
            input.addEventListener("paste", () => setTimeout(cleanName, 10));
        });

        container.querySelectorAll(".member-age-input").forEach(input => {
            input.addEventListener("input", () => {
                let ageVal = parseInt(input.value, 10);
                if (ageVal > 120) input.value = 120;
                syncAccompanyingTextarea();
                queueSaveDraft();
            });
        });

        syncAccompanyingTextarea();
    }

    function updateAccompanyingRequirement(totalCount, prefillMembers = null) {
        const accGroup = document.getElementById("accompanying-group");
        const accNote = document.getElementById("accompanying-note");
        const accReq = document.getElementById("accompanying-required");
        const accError = document.getElementById("accompanying-error");

        const curLang = localStorage.getItem("darshan_lang") || "hi";
        if (totalCount <= 1) {
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
            const isCountValid = total > 0 && total <= 8;
            markGroup(maleCountInput, isCountValid);
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
            const isCountValid = total > 0 && total <= 8;
            markGroup(maleCountInput, isCountValid);
            updateAccompanyingRequirement(total);
        }

        maleCountInput.addEventListener("input", handleMaleInput);
        maleCountInput.addEventListener("change", handleMaleInput);
        femaleCountInput.addEventListener("input", handleFemaleInput);
        femaleCountInput.addEventListener("change", handleFemaleInput);

        // Run initially for current values (default: 1 Male + 0 Female = 1 Single Devotee)
        const initialTotal = (parseInt(maleCountInput.value) || 0) + (parseInt(femaleCountInput.value) || 0);
        updateAccompanyingRequirement(initialTotal);
    }

    // Initialize Voice Typing, Devotee Count Limit & Searchable Dropdowns
    setupVoiceTyping();
    enforceDevoteeCountLimit();
    initCustomSearchableSelects();
    restoreFormDraft();
    applyLanguage(localStorage.getItem("darshan_lang") || "hi");

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
                if (iosInstallModal) iosInstallModal.classList.remove("hidden");
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
        closeIosModalBtn.addEventListener('click', () => iosInstallModal.classList.add("hidden"));
    }
    if (iosGotItBtn && iosInstallModal) {
        iosGotItBtn.addEventListener('click', () => iosInstallModal.classList.add("hidden"));
    }
    if (iosInstallModal) {
        iosInstallModal.addEventListener('click', (e) => {
            if (e.target === iosInstallModal) iosInstallModal.classList.add("hidden");
        });
    }

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
    silentSyncSheetRow();
    // Keep it refreshed every 20 seconds while user fills the form to handle concurrent users
    setInterval(silentSyncSheetRow, 20000);
});
