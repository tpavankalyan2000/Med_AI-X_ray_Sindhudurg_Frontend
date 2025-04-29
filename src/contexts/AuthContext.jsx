import { createContext, useContext, useState, useEffect } from 'react'

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

  // Mock login function - in a real app, this would communicate with a backend
  const login = async (email, password) => {
    setError(null)
    
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Simple validation - in real app, this would be a backend auth call
      if (email === 'sindhudurg.healthcare@maha.gov.in' && password === 'pavan') {
        const user = { 
          id: '1', 
          email, 
          name: 'AI MedAdvisor',
          role: 'doctor',
          avatar: 'https://i.pravatar.cc/150?img=69'
        }
        
        setCurrentUser(user)
        localStorage.setItem('medicalAppUser', JSON.stringify(user))
        return user
      } else {
        throw new Error('Invalid email or password')
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