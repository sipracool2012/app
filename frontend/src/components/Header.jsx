import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthProvider';
import { getAuthHeaders } from '../utils/auth';
import { languages } from '../i18n';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, handleLogout } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(
    () => languages.find(l => l.code === i18next.language) || languages[0]
  );
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
            headers: getAuthHeaders()
          });
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role);
          }
        } catch (error) {
          console.error('Failed to fetch user role:', error);
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const onLogout = () => {
    handleLogout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLanguageChange = (lang) => {
    i18next.changeLanguage(lang.code);
    setCurrentLang(lang);
    setIsLangOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header row */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
            <span className="text-2xl font-bold text-gray-900">Clear eVisa</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              {t('header.getVisa')}
            </Link>
            <Link to="/requirements" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              {t('header.travelRequirements')}
            </Link>
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(prev => !prev)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                aria-haspopup="listbox"
                aria-expanded={isLangOpen}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{currentLang.nativeName}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isLangOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
                >
                  <div className="py-1">
                    <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {t('languageSelector.language')}
                    </p>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        role="option"
                        aria-selected={currentLang.code === lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          currentLang.code === lang.code ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span>{lang.nativeName}</span>
                        {lang.nativeName !== lang.name && (
                          <span className="ml-2 text-xs text-gray-400">{lang.name}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <>
                <Link to="/my-applications">
                  <Button variant="outline" className="border-gray-300" data-testid="my-applications-nav-btn">
                    {t('header.myApplications')}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="border-gray-300">
                      {t('header.admin')}
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="border-gray-300"
                  data-testid="logout-btn"
                >
                  {t('header.logout')}
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" className="border-gray-300">
                    {t('header.signIn')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    {t('header.signUp')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: hamburger button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 pb-4 space-y-1">
            {/* Nav links */}
            <Link
              to="/home"
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
            >
              {t('header.getVisa')}
            </Link>
            <Link
              to="/requirements"
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
            >
              {t('header.travelRequirements')}
            </Link>

            <div className="h-px bg-gray-100 mx-4 my-2" />

            {/* Language selector */}
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {t('languageSelector.language')}
              </p>
              <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { handleLanguageChange(lang); closeMobileMenu(); }}
                    className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      currentLang.code === lang.code
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100 mx-4 my-2" />

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="px-4 space-y-2 pt-1">
                <Link to="/my-applications" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full border-gray-300" data-testid="my-applications-nav-btn">
                    {t('header.myApplications')}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full border-gray-300">
                      {t('header.admin')}
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="w-full border-gray-300"
                  data-testid="logout-btn"
                >
                  {t('header.logout')}
                </Button>
              </div>
            ) : (
              <div className="px-4 space-y-2 pt-1">
                <Link to="/signin" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full border-gray-300">
                    {t('header.signIn')}
                  </Button>
                </Link>
                <Link to="/signup" onClick={closeMobileMenu}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {t('header.signUp')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
