import { motion } from "framer-motion";
import {
  FiMessageSquare,
  FiFileText,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import { FaImage } from 'react-icons/fa'; 
import { FaRobot } from 'react-icons/fa'; 
import { FaStethoscope } from 'react-icons/fa'; // Stethoscope as a health-related icon

// import { FaSyncAlt } from 'react-icons/fa'; // Represents a sync or transformation action
// import { IoMdAnalytics } from 'react-icons/io'; // Represents analytics or predictions
// import { GiBabyFace } from 'react-icons/gi'; // Represents a baby face

import { useAuth } from "../../contexts/AuthContext.jsx";

// ----------------------------for redux _purpose -------------------------
import { useSelector } from 'react-redux'; // ⬅️ ADD THIS
import { useDispatch } from 'react-redux'
import { setCredentials } from '../redux_tool/authSlice.js'

// --------------------------------------------------------------------------

const DashboardHome = () => {
  const { currentUser } = useAuth();

    // -------------for redux use----------------------------
    const { email, password } = useSelector((state) => state.auth);  // ⬅️ access redux state
    const dispatch = useDispatch()
    // --------------------------------------------------------


  const stats = [
    {
      id: 1,
      name: "AI Chat Sessions",
      value: "24",
      icon: FiMessageSquare,
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "X-Ray Analyses",
      value: "12",
      icon: FiFileText,
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "Extracted X-Ray Images",
      value: "148",
      icon: FiUsers,
      color: "bg-purple-500",
    },
    {
      id: 4,
      name: "Documents Analysed",
      value: "8",
      icon: FiCalendar,
      color: "bg-amber-500",
    },
  ];


  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentUser?.name || "Doctor"} {email || "Doctor"}
        </h1>
        <p className="text-gray-600">
          Here's an overview of your medical AI platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Access Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quick Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickAccessCard
                title="AI Medical Chatbot"
                description="Interact with our AI assistant for patient consultations and medical inquiries"
                icon={FiMessageSquare}
                linkTo="/auth/dashboard/chatbot"
                colorClass="bg-blue-100 text-blue-800"
              />
              <QuickAccessCard
                title="X-Ray Analysis"
                description="Upload and analyze radiological images with our advanced AI system"
                icon={FaStethoscope}
                linkTo="/auth/dashboard/radiology"
                colorClass="bg-green-100 text-green-800"
              />
              <QuickAccessCard
                title="Convertion of X-Rays Format"
                description="Upload X-rays (.dcm format) to Visualise in .jpg format"
                icon={FaImage}
                linkTo="/auth/dashboard/convertion"
                colorClass="bg-green-100 text-green-800"
              />
              <QuickAccessCard
                title="Child Nourish AI"
                description="AI-powered platform designed to monitor, and address child malnutrition"
                icon={FaRobot}
                linkTo="http://192.168.35.15:2001/"
                // linkTo="http://192.168.1.49:2002/"
                colorClass="bg-green-100 text-green-800"
              />
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <ActivityItem
                title="X-Ray Analysis Completed"
                description="Chest X-Ray analysis for patient #12345"
                time="2 hours ago"
              />
              <ActivityItem
                title="New Chat Session"
                description="Medical consultation via AI chatbot"
                time="Yesterday"
              />
              <ActivityItem
                title="Patient Record Updated"
                description="Added new treatment notes"
                time="2 days ago"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const QuickAccessCard = ({
  title,
  description,
  icon: Icon,
  linkTo,
  colorClass,
}) => (
  <a href={linkTo} className="block group">
    <div className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md group-hover:border-primary-500">
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-base font-medium text-gray-900 group-hover:text-primary-700">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  </a>
);

const ActivityItem = ({ title, description, time }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-3 w-3 rounded-full bg-primary-500 mt-2"></div>
    <div className="ml-3">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  </div>
);

export default DashboardHome;
