import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiInfo } from 'react-icons/fi'
import LoginImage from '../components/LoginImage.jsx'

// ----------------------------for redux _purpose -------------------------
import { useDispatch } from 'react-redux'
import { setCredentials } from '../components/redux_tool/authSlice.js'


// --------------------------------------------------------------------------

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  // -------------for redux use----------------------------
  const dispatch = useDispatch()
// --------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    
    if (!email || !password) {
      setLoginError('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    
    try {
      await login(email, password)

       // Store into Redux
    dispatch(setCredentials({ email, password }))


      navigate('/auth/dashboard')
    } catch (error) {
      setLoginError(error.message || 'Failed to log in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left side - Form */}
      <motion.div 
        className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 md:p-12"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">Medical AI Platform</h1>
            <p className="text-gray-600">Advanced Chatbot & Radiology Analysis</p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
            
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
                <FiInfo className="mt-0.5 mr-2 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="input pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                <div className="mt-1 text-right">
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-800">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <button
                type="submit"
                className={`btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            
            {/* <div className="mt-6 text-center text-sm text-gray-600">
              <p>Use demo credentials:</p>
              <p className="font-medium text-primary-700">email :- sindhudurg.healthcare@gmail.com / pass :- pavan</p>
            </div> */}
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
  )
}

export default Login