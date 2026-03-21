import React, { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VisaApplication from "./pages/VisaApplication";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import AdminPanel from "./pages/AdminPanel";
import MyApplications from "./pages/MyApplications";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }
    return children;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Header 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
          <Route 
            path="/apply/:visaId" 
            element={
              <ProtectedRoute>
                <VisaApplication />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/application-success" 
            element={
              <ProtectedRoute>
                <ApplicationSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-applications" 
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            } 
          />
          <Route path="/requirements" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
