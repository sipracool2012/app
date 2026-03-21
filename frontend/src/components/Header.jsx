import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user role if authenticated
    const fetchUserRole = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
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

  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Clear eVisa</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Get an eVisa
            </Link>
            <Link to="/requirements" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Travel requirements
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language/Currency selector */}
            <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">EN - USD ($)</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <>
                <Link to="/my-applications">
                  <Button variant="outline" className="border-gray-300" data-testid="my-applications-nav-btn">
                    My Applications
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="border-gray-300">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={onLogout}
                  variant="outline" 
                  className="border-gray-300"
                  data-testid="logout-btn"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" className="border-gray-300">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
