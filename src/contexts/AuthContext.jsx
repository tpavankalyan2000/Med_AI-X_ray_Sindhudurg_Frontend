import { createContext, useContext, useState, useEffect } from 'react'
import { URLS } from '../config.js'

// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for saved auth in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('medicalAppUser')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (err) {
        console.error('Error parsing saved user:', err)
        localStorage.removeItem('medicalAppUser')
      }
    }
    setLoading(false)
  }, [])

  // Mock login function - now making an actual API call
  const login = async (email, password) => {
    setError(null)
    
    try {
      const response = await fetch(`${URLS.API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      
      if (response.ok) {
        // Handle login success
        const user = {
          email,
          role: 'doctor', // Assuming the role is passed in the response
          avatar: 'https://i.pravatar.cc/150?img=69', // Mocked avatar
        }

      //    // Show success toast
      // toast.success("Logged in successfully!", {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 3000,
      //   hideProgressBar: true,
      // });
          
        setCurrentUser(user)
        localStorage.setItem('medicalAppUser', JSON.stringify(user))

        return user
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('medicalAppUser')
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
