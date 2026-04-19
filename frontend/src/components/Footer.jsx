import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.careers')}</Link></li>
              <li><Link to="/press" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.press')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.helpCenter')}</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.contactUs')}</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.termsOfService')}</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footer.cookiePolicy')}</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('footer.connect')}</h3>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:opacity-80 transition-opacity"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/people/Clear-evisa-Services/61586266041354/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            {t('footer.copyright', { year: currentYear })}
          </p>
          <p className="mt-4 text-center text-gray-500 text-xs leading-5 max-w-3xl mx-auto">
            {t('footer.disclaimer')}
          </p>
          <p className="mt-3 text-center text-gray-400 text-xs">
            Udyam Registration Number: <strong className="text-gray-500">UDYAM-MH-26-1069031</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
