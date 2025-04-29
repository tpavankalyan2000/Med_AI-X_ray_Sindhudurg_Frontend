import { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiMessageSquare, FiFileText, FiHome, FiLogOut, FiUser, FiSettings } from 'react-icons/fi'
import { SiConvertio } from "react-icons/si";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import ChatbotPanel from '../components/dashboard/ChatbotPanel.jsx'
import RadiologyPanel from '../components/dashboard/RadiologyPanel.jsx'
import DashboardHome from '../components/dashboard/DashboardHome.jsx'
import Convertion from '../components/dashboard/Convertion.jsx'
import Profile from '../components/dashboard/Profile.jsx'
import Setting from '../components/dashboard/Setting.jsx'
import Upload_PDF from '../components/dashboard/upload_pdf_chat.jsx'
import med_ai from '../assets/med_ai.png';

// ----------------------------for redux _purpose -------------------------
import { useDispatch } from 'react-redux'
import { clearCredentials } from '../components/redux_tool/authSlice.js'

// --------------------------------------------------------------------------


const Dashboard = () => {
  const { currentUser, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

    // -------------for redux use----------------------------
    const dispatch = useDispatch()
    // --------------------------------------------------------
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  
  const handleLogout = () => {
    logout()
    dispatch(clearCredentials())
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-5 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MedAI</span>
            </div>
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <FiX size={24} />
            </button>
          </div>
          
          {/* User Profile */}
          <div className="px-4 py-4 border-b">
            <div className="flex items-center space-x-3">
              <img 
                src={med_ai || "https://i.pravatar.cc/150?img=69"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{currentUser?.name || "User"}</p>
                <p className="text-sm text-gray-500 capitalize">{currentUser?.role || "User"}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavLink 
              to="/auth/dashboard" 
              end
              className={({ isActive }) => 
                `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'hover:bg-gray-100'
                }`
              }
            >
              <FiHome className="mr-3" size={20} />
              Dashboard
            </NavLink>
            
            <NavLink 
              to="/auth/dashboard/chatbot" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'hover:bg-gray-100'
                }`
              }
            >
              <FiMessageSquare className="mr-3" size={20} />
              AI Chatbot
            </NavLink>
            <NavLink 
              to="/auth/dashboard/upload_pdf" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'hover:bg-gray-100'
                }`
              }
            >
              <MdOutlinePictureAsPdf className="mr-3" size={20} />
              DocAnalyzer AI
            </NavLink>
            
            <NavLink 
              to="/auth/dashboard/radiology" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'hover:bg-gray-100'
                }`
              }
            >
              <FiFileText className="mr-3" size={20} />
              X-Ray Analysis
            </NavLink>

            <NavLink 
              to="/auth/dashboard/convertion" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'hover:bg-gray-100'
                }`
              }
            >
              <SiConvertio className="mr-3" size={20} />
              Image Convertion
            </NavLink>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <NavLink 
                to="/auth/dashboard/profile" 
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiUser className="mr-3" size={20} />
                Profile
              </NavLink>
              
              <NavLink 
                to="/auth/dashboard/setting" 
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiSettings className="mr-3" size={20} />
                Settings
              </NavLink>
            </div>
          </nav>
          
          {/* Logout Button */}
          <div className="px-4 py-4 border-t">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiLogOut className="mr-3" size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleSidebar}
            >
              <FiMenu size={24} />
            </button>
            
            <h1 className="text-xl font-semibold text-gray-800 lg:hidden">
              MedAI Platform
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                  <img 
                    src={med_ai || "https://i.pravatar.cc/150?img=69"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/chatbot" element={<ChatbotPanel />} />
              <Route path="/radiology" element={<RadiologyPanel />} />
              <Route path="/upload_pdf" element={<Upload_PDF />} />
              <Route path="/convertion" element={<Convertion />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/setting" element={<Setting />} />
              {/* Add more routes as needed */}
              <Route path="*" element={<DashboardHome />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard