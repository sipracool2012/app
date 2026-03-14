import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About us</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</Link></li>
              <li><Link to="/press" className="text-gray-600 hover:text-gray-900 transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-600 hover:text-gray-900 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact us</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-gray-900 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
            <ul className="space-y-3">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Twitter</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Facebook</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © {currentYear} Sherpa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
