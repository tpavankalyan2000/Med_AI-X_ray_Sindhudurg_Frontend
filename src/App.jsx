import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./components/redux_tool/authSlice.js";
import Signup from "./pages/Signup.jsx";

const store = configureStore({
  reducer: {
    auth: authReducer, // ⬅️ add here
  },
});

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/auth/dashboard" /> : <Login />}
        />
        <Route
          path="/auth/login"
          element={isAuthenticated ? <Navigate to="/auth/dashboard" /> : <Login />}
        />
        <Route
          path="/auth/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={
              <Signup />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Provider>
  );
}

export default App;
