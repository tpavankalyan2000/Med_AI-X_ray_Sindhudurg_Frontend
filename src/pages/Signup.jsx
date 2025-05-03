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
    state: "Maharashtra",
    district: "Sindhudurg",
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
    Kudal: ["Village 1", "Village 2", "Village 3"],
    Sawantwadi: ["Village A", "Village B", "Village C"],
    Vengurla: ["Village X", "Village Y", "Village Z"],
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
                  options: ["Maharashtra"],
                },
                {
                  label: "District",
                  name: "district",
                  type: "select",
                  options: ["Sindhudurg"],
                },
                {
                  label: "Taluka",
                  name: "taluka",
                  type: "select",
                  options: ["Select Taluka", "Kudal", "Sawantwadi", "Vengurla"],
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
