import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext.jsx";
import LoginImage from "../components/LoginImage.jsx";
import { URLS } from "../config.js";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    telephone: "",
    state: "Select State",
    district: "Select District",
    taluka: "Select Taluka",
    village: "Select Village",  // Default to "Select Village"
    role: "Public",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Mapping of Talukas to Villages
  const talukaToVillages = {
    Sawantwadi: ["Bada", "Kunkeri", "Talawane", "Sangeli", "Wafoli", "Ajgaon", "Satose", "Kshetrapal", "Asniye", "Bhom", "Gulduve", "Gele", "Devsu", "Malewad", "Degave",
        "Kesari", "Udeli", "Sherle", "Dandeli", "Sarmale", "Kavthani", "Shirshinge", "Dabhil", "Malgaon", "Sateli Tarf Satarda", "Nigude", "Ovaliye", "Nhaveli",
        "Niravade", "Kumbharwada", "Insuli", "Sonurli", "Aronda", "Brahmanpat", "Aros",  "Sawarwad", "Padve Majgaon", "Danoli", "Konas", "Otavane", "Vilavade", "Tiroda",
        "Bavlat", "Kariwade", "Kolgaon", "Nemale", "Galel", "Kumbharli", "Satuli", "Verle", "Dongarpal", "Masure", "Bhatpavani", "Savarjuva", "Vetye", "Bhalawal", "Padve",
        "Nirukhe", "Talavade", "Kegad", "Tamboli", "Ronapal", "Kondure", "Kas", "Nene",  "Satarda", "Madura", "Parpoli", "Amboli", "Ambegaon", "Nanos", "Chaukul", "Netarde",
        "Gharap", "Madkhol", "Padlos", "Dhakore", "Dingne", "Fansavade", "Charathe", "Kinale", "Kalambist"],
    Vengurla: ["Ravadas", "Bhandarwada", "Math", "Nhaichiad", "Sukhatanbag", "Vadakhol", "Khalchiwadi", "Tank", "Ubhadanda", "Huda", "Bandh", "Matond", "Sataye",
        "Pal", "Josoli", "Parabwadi", "Palkarwadi", "Siddhawadi", "Medha", "Bhogave",  "Dabholi", "Bagayat", "Varachiker", "Adeli", "Kanyale", "Kurlewadi", "Velagar",
        "Shiroda", "Vetore", "Khanoli", "Gandhinagar", "Ansur", "Subhashwadi", "Sukhalbhat", "Redi", "Khavane", "Navabag", "Mhapan", "Girapwadi", "Hodawade", "Khalchikar",
        "Asoli", "Mhartale", "Parabwada", "Parule", "Pendur", "Namas", "Sagartirtha", "Sonsure", "Mochemad", "Kamblevir", "Gavan", "Muth", "Temb", "Kelus", "Kochare",
        "Arawali", "Kambaliwadi", "Adari", "Parabgaon", "Bhendamala", "Varachemad",  "Shriramwadi", "Warchiwadi", "Bombadojichiwadi", "Vagheshwar", "Mayana",
        "Khatarwadi", "Karli", "Sakhelekhol", "Shelapi", "Tulas", "Gavatale", "Wayangani", "Talekarwadi", "Vajarath", "Chipi", "Malai", "Kalavi", "Padatal"],
    Kankavli: ["Wargaon", "Ozram", "Kalasuli", "Kasarde", "Wagheri", "Nagave", "Ulhasnagar", "Kajirde", "Dabgaon", "Nandgaon", "Otav", "Savdav", "Karanje", "Harkul Kh.",
        "Bavshi", "Tondavali", "Tiware", "Ghonsari", "Osargaon", "Phanas Nagar", "Karul", "Ayanal", "Sherpe", "Humbarane", "Saliste", "Piyali", "Subhash Nagar", "Bidwadi",
        "Wagade", "Nardave", "Shivajipeth", "Tarandale", "Bandargaon", "Humarat", "Kasaral", "Sangave", "Anandnagar", "Bhairavgaon", "Lingeshwar Nagar", "Kasavan", "Satral",
        "Ranjangaon", "Tarele", "Gangeshwar", "Audumbarnagar", "Harkul Bk.", "Damare", "Halaval", "Janavali", "Shidavne", "Lore", "Gandhinagar", "Kurangavne", "Asalade",
        "Chinchwali", "Nehru Nagar", "Dhareshwar", "Yevteshwargaon", "Talavade", "Bharni", "Ashiye", "Berle", "Navanagar", "Dakshin Bajar Peth", "Natal", "Uttamnagar",
        "Lingeshwar", "Nagsawantwadi", "Upanagar", "Bhiravande", "Jambhalnagar", "Pimpaleshwar Nagar", "Sambhajinagar", "Main", "Shivdav", "Shivajinagar",
        "Shrinagar", "Darum", "Math Kh.", "Phondaghat", "Rameshwarnagar", "Shastrinagar", "Dariste", "Pimpalgaon", "Rajnagar", "Uttar Bajar Peth", "Shiraval", "Digavale",
        "Nadgive", "Kumbhavade", "Belne Kh", "Kharepatan", "Jambhalgaon", "Bordave", "Kondye", "Pise Kamate", "Sakedi", "Koloshi", "Uttargavthan", "Sambhajinagar", "Varavade", "Waingani"],
    Devgad: ["Jamsande", "Malegaon", "Lingdal", "Shiravali", "Kunkeshwar", "Salashi", "Pural", "Burabavade", "Pendhari", "Tambaldeg", "Ombal", "Padvane", "Rahateshwar", "Mond",
        "Nad", "Virwadi", "Kalvi", "Welgave", "Mithbaon", "Tembavali", "Nadan", "Padel", "Rembavali", "Korle", "Patgaon", "Dhoptewadi", "Valivande", "Hurshi", "Manche",
        "Katvan", "Juveshwar", "Hindale", "Chafed", "Morve", "Pavnai", "Wadaker Poi", "Wanivade", "Chinchwad", "Waghivare", "Mithmumbari", "Malpewadi", "Aadbandar",
        "Mohulgaon", "Shevare", "Mahalunge", "Vijaydurg", "Dabhole", "Pombhurle", "Phanasgaon", "Baparde", "Undil", "Elaye", "Palekarwadi", "Rameshwar", "Are",
        "Mouje Waghotan", "Shirgaon", "Vitthaladevi", "Sherighera Kamte", "Bagamala", "Kinjawade", "Phanase", "Chandoshi", "Somlewadi", "Talebajar", "Thakurwadi",
        "Dahibaon", "Devgad", "Saundale", "Mutat", "Talavade", "Katwaneshwar", "Padthar", "Mondpar", "Gadhitamhane", "Gavane", "Kalambai", "Dhalavali", "Tirlot", "Goval",
        "Kotkamte", "Sandve", "Girye", "Wadetar", "Nimatwadi", "Kunkawan", "Khudi", "Wareri", "Kuvale", "Poyare", "Hadpid", "Kasaba Waghotan", "Naringre", "Bagatalavade", "Munage", "Torsole", "Wade"],
    Vaibhavvadi: ["Ainari", "Khambale", "Het", "Bhusarwadi", "Ghanegadwadi", "Umbarde", "Vayamboshi", "Mounde", "Nadhavade", "Nerle", "Kumbharwadi", "Bhui Bawada", "Kumbhari",
        "Tiravade Tarf Kharepatan", "Navale", "Jambhavade", "Sonali", "Yedgaon", "Tembewadi", "Nanivade", "Achirne", "Bhuyadewadi", "Mangavli", "Vengasar",
        "Jamdarwadi", "Tiravade Tarf Soundal", "Mehbubnagar", "Vabhave", "Palandewadi", "Bandhawadi", "Shirale", "Sangulwadi", "Sardarwadi", "Kokisare", "Lore",
        "Madhaliwadi", "Nagapwadi", "Mandavkarwadi", "Arule", "Karul", "Ringewadi", "Digashi", "Napane", "Pimpalwadi", "Kolape", "Nim Arule", "Kurli", "Khambalwadi",
        "Kumbhavade", "Tithavli", "Upale", "Gadmath", "Bhom", "Akhavane", "Kusur", "Mohitewadi", "Sadure", "Bhattiwadi", "Narkarwadi"],
    Malwan: [ "Guram Nagari", "Bhatwadi", "Karlachavhal", "Tiravde", "Parwadi", "Asagani", "Kolamb", "Katvad", "Kirlos", "Palikadilwadi", "Pirawadi", "Malewadi", "Devbag", "Kothewada",
        "Mala", "Kumbharmath", "Palasmb", "Achare", "Jamdul", "Chafekhol", "Hadi", "Devli", "Bagwadi", "Pendur", "Salel", "Sukalwad", "Sonarwada", "Kalethar", "Dongrewadi",
        "Nagzar", "Kusarave", "Dhamapur", "Teraiwadi", "Tondavali", "Revandi", "Bagavewadi", "Chunavare", "Sadewadi", "Golwan", "Magvane", "Shemadranewadi", "Parabwada", "Warad",
        "Hirlewadi", "Wadi Dangmode", "Mahan", "Khanjanwadi", "Ghadiwadi", "Kalse", "Poip", "Palkarwadi", "Chindar", "Bandiwade Kh.", "Kava", "Shrawan", "Khand", "Waingavade",
        "Math Bk.", "Malandi", "Asarondi", "Dikval", "Amavane", "Bhagawantgad", "Bandiwade Bk.", "Budhavale", "Juva Pankhol", "Tarkarli", "Gaudwadi", "Malkewadi", "Anganewadi",
        "Malgaon", "Deulwada", "Gavaliwadi", "Rathivade", "Koil", "Belachiwadi", "Malond", "Katta", "Gavathanwadi", "Advali", "Bhatwadi", "Nirom", "Wayangani", "Ovaliye",
        "Hiwale", "Shirvande", "Margtad", "Trimbak", "Nandrukh", "Mogarne", "Weral", "Sayyad Juva", "Marde", "Gavathan", "Kumbharwadi", "Kharare", "Bagadwadi", "Bilvas",
        "Waghavane", "Nhive", "Varachichawadi", "Gaonkarwada", "Pedave", "Masure", "Ramgad",  "Chander", "Wak", "Anandvhal", "Mhavlunge", "Amdos", "Aparadhwadi", "Ghumade",
        "Bhogalewadi", "Khotale", "Kunkavale", "Tembwadi", "Khervand", "Hedul", "Masade", "Parad", "Sarjekot", "Wayari", "Wadachapat", "Ozaram", "Talgaon", "Kumame",
        "Kandalgaon", "Kudopi", "Gothane", "Palayewadi", "Chauke", "Dangmode", "Nandos"],
    Kudal: ["Mudyacha Kond", "Munagi", "Khocharewadi", "Sonavade Tarf Kalsuli", "Kavilkate", "Gaondhad", "Walawal", "Ambrad", "Tembgaon", "Mitkyachiwadi", "Bhadgaon Kh.", 
        "Avalegaon", "Tulsuli Tarf Mangaon", "Taligaon", "Hirlok", "Kunde", "Bengaon", "Wadivarvade", "Pokharan", "Gondhalpur", "Pangrad", "Tulsuli K.Narur", "Gothos", 
        "Bhadgaon Bk.", "Gavalgaon", "Ambadpal", "Karivane", "Kinlos", "Bibavane", "Nirukhe", "Girgaon", "Pat", "Wasoli", "Ghotage", "Bambarde Tarf Mangaon", "Tembdhurinagar", 
        "Kandargaon", "Kasal", "Andurle", "Humras", "Kusagaon", "Kaleli", "Sarambal", "Ranbambuli", "Gaorai", "Ghatakarnagar", "Shivapur", "Mangaon", "Raygaon", "Saigaon", 
        "Naneli", "Keravade Tarf Mangaon", "Gudhipur", "Khutvalwadi", "Anav", "Humarmala", "Amberi", "Keravade K.Narur", "Kupavade", "Pawashi", "Kanduli", "Oras Kh.", "Oras Bk.", 
        "Bambarde Tarf Kalsuli", "Naikwadi", "Sonavade Tarf Haveli", "Neharunagar", "Madgaon", "Borbhat", "Warde", "Gandhinagar", "Mulade", "Chafeli", "Kutgaon", "Kattagaon", 
        "Gandhigram", "Pandur", "Kavilgaon", "Mankadevi", "Rumadgaon", "Humarmala", "Talegaon", "Pulas", "Bharani", "Narur", "Namaspur", "Upavade", "Jambhavade", "Padave", "Ghavanale", 
        "Sakirde", "Bhattgaon", "Durganagar", "Namasgaon", "Nerur K.Narur", "Tendoli", "Kusabe", "Akeri", "More", "Digas", "Kadawal", "Bambuli Tarf Haveli", "Anjivade", "Mandkuli", 
        "Dholkarwadi", "Naiknagar", "Nivaje", "Kavathi", "Salgaon", "Wados", "Nerur Tarf Haveli", "Chendawan", "Pinguli", "Jambharmala", "Nileli", "Gondhayale", "Bhutvad", "Belnadi", 
        "Bav", "Zarap", "Sangirde", "Deulwadi", "Ghadigaon", "Goveri"],
    Dodamang: ["Fukeri", "Bhike-Konal", "Kumbhavade", "Zare", "Morgaon", "Pikule", "Parme", "Ghatiwade", "Khadpade", "Sasoli", "Adali", "Shirwal", "Awade", "Hewale", "Talkat", 
        "Ker", "Sateli Bhedshi", "Ambeli", "Ambadgaon", "Ayee", "Phondye", "Matane", "Ghotge", "Mangeli", "Kasai", "Kumbral", "Bhekurli", "Bodade", "Virdi", "Terwan", "Talekhol", 
        "Ghotgewadi", "Kudase", "Zolambe", "Bambarde", "Maneri", "Khanyale", "Morle", "Kalane","Palye", "Terwanmedhe", "Ugade", "Sonawal", "Usap", "Girode", "Khokaral", "Vazare", 
        "Konal", "Kolzar", "Panturli"],
  };

  const [villageOptions, setVillageOptions] = useState([]);

  useEffect(() => {
    // Set village options based on the selected taluka
    if (formData.taluka !== "Select Taluka") {
      setVillageOptions(["Select Village", ...talukaToVillages[formData.taluka] || []]);
    } else {
      setVillageOptions(["Select Village"]);
    }
  }, [formData.taluka]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    // Validate form data
    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.telephone ||
      !formData.village ||
      !formData.address ||
      !formData.password ||
      formData.password !== formData.confirmPassword
    ) {
      setSignupError(
        "Please fill in all fields and make sure passwords match."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Call your Flask API to save the user
      const response = await fetch(`${URLS.API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login page after successful signup
        navigate("/auth/login");
      } else {
        setSignupError(data.error || "Failed to sign up");
      }
    } catch (error) {
      setSignupError(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left side - Form */}
      <motion.div
        className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 md:p-12"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full" style={{ maxWidth: "70%" }}>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">
              Medical AI Platform
            </h1>
            <p className="text-gray-600">
              Advanced Chatbot & Radiology Analysis
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

            {signupError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
                <FiInfo className="mt-0.5 mr-2 flex-shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                {
                  label: "Mobile Number",
                  name: "mobile",
                  type: "tel",
                  maxLength: 10,
                },
                {
                  label: "Telephone Number",
                  name: "telephone",
                  type: "tel",
                  maxLength: 12,
                },
                {
                  label: "State",
                  name: "state",
                  type: "select",
                  options: ["Select State", "Maharashtra"],
                },
                {
                  label: "District",
                  name: "district",
                  type: "select",
                  options: ["Select District", "Sindhudurg"],
                },
                {
                  label: "Taluka",
                  name: "taluka",
                  type: "select",
                  options: ['Select Taluka','Sawantwadi', 'Vengurla', 'Kankavli', 'Devgad', 'Vaibhavvadi', 'Malwan', 'Kudal', 'Dodamang'],
                },
                {
                  label: "Village",
                  name: "village",
                  type: "select",
                  options: villageOptions,
                },
                {
                  label: "Role",
                  name: "role",
                  type: "select",
                  options: [
                    "Public",
                    "Civil Sergeant",
                    "ASP",
                    "DSP",
                    "SI",
                    "INSPR",
                  ],
                },
                { label: "Address", name: "address", type: "text" },
                { label: "Password", name: "password", type: "password" },
                {
                  label: "Confirm Password",
                  name: "confirmPassword",
                  type: "password",
                },
              ].map(({ label, name, type, options, maxLength }) => (
                <div className="mb-4" key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {label}
                  </label>
                  {type === "select" ? (
                    <select
                      id={name}
                      name={name}
                      className="input"
                      value={formData[name]}
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      {options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={name}
                      type={type}
                      name={name}
                      className="input"
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={`Enter your ${label.toLowerCase()}`}
                      maxLength={maxLength}
                      disabled={isLoading}
                    />
                  )}
                </div>
              ))}

              <div className="col-span-2">
                <button
                  type="submit"
                  className={`btn-primary w-full ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Signing Up...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Already have an account?</p>
              <button
                onClick={() => navigate("/auth/login")}
                className="font-medium text-primary-700 hover:text-primary-800"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right side - Image */}
      <motion.div
        className="hidden md:flex md:w-1/2 bg-primary-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <LoginImage />
      </motion.div>
    </div>
  );
};

export default Signup;
