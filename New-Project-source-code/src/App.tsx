import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Predicting from "./pages/Predicting";
import Results from "./pages/Results";
import Share from "./pages/Share";
import History from "./pages/History";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Splash — no layout wrapper */}
          <Route path="/" element={<Splash />} />

          {/* All other routes wrapped in Layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/predicting/:predictionId"
              element={
                <ProtectedRoute>
                  <Predicting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results/:predictionId"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route
              path="/share/:predictionId"
              element={
                <ProtectedRoute>
                  <Share />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
