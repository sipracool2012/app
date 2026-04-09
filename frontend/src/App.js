import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import PrivateRoute from "./context/PrivateRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VisaApplication from "./pages/VisaApplication";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import AdminPanel from "./pages/AdminPanel";
import MyApplications from "./pages/MyApplications";
import PaymentReturn from "./pages/PaymentReturn";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import RefundPolicy from "./pages/RefundPolicy";
import VisaDetail from "./pages/VisaDetail";
import Requirements from "./pages/Requirements";
import { Toaster } from "./components/ui/toaster";
import { ScrollToTopOnNav, ScrollToTopButton } from "./components/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <ScrollToTopOnNav />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/apply/:visaId"
              element={
                <PrivateRoute>
                  <VisaApplication />
                </PrivateRoute>
              }
            />
            <Route
              path="/application-success"
              element={
                <PrivateRoute>
                  <ApplicationSuccess />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <PrivateRoute>
                  <MyApplications />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment-return"
              element={
                <PrivateRoute>
                  <PaymentReturn />
                </PrivateRoute>
              }
            />
            <Route path="/visa/:visaId" element={<VisaDetail />} />
            <Route path="/requirements" element={<Requirements />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
          </Routes>
          <Footer />
          <ScrollToTopButton />
          <Toaster />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;

