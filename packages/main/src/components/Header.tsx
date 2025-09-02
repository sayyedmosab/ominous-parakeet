import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavLink as NavLinkType } from '../types';
import {
  Menu,
  X,
  User,
  LogOut,
  Building2,
  Search,
  Sparkles,
  Play,
  Eye,
  Home,
  BookOpen,
  PenTool,
  Wand2,
  Cloud,
  Target,
  MessageSquare
} from "lucide-react";

const navLinks: NavLinkType[] = [
  { id: 1, text: 'Home', href: '/', icon: Home },
  { id: 2, text: 'About', href: '/about', icon: BookOpen },
  { id: 3, text: 'Roadmap', href: '/roadmap', icon: Target },
  { id: 4, text: 'The Deep', href: '/forum', icon: MessageSquare },
];

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'AR'>('EN');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Determine which logo to show based on current path
  const isJosoorPage = pathname.startsWith('/josoor');
  const isSketchAppPage = pathname.startsWith('/sketchapp');
  const isAuraPage = pathname.startsWith('/aura');
  const isWeatherMapPage = pathname.startsWith('/weathermap');
  
  let logoSrc = '/images/aittlogo.png';
  let logoAlt = 'AI Twin Tech';
  
  if (isJosoorPage) {
    logoSrc = '/images/josoorlogo.png';
    logoAlt = 'Josoor';
  } else if (isSketchAppPage) {
    logoSrc = '/images/sketchapplogo.png';
    logoAlt = 'SketchApp';
  } else if (isAuraPage) {
    logoSrc = '/images/auralogonotext.png';
    logoAlt = 'Aura';
  } else if (isWeatherMapPage) {
    logoSrc = '/images/josoorlogo.png';
    logoAlt = 'Weather Map';
  }

  return (
    <header className="shadow-md sticky top-0 z-50 text-white" style={{ backgroundColor: '#00122d' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img 
              src={logoSrc}
              alt={logoAlt}
              className="h-12 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              {navLinks.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                const IconComponent = link.icon;
                return (
                  <div key={link.id} className="relative group">
                    <Link
                      to={link.href}
                      className={`py-2 flex items-center gap-2 transition-colors duration-300 ${
                        isActive
                          ? 'text-electric-blue-400 font-semibold'
                          : 'text-gray-300 hover:text-electric-blue-400'
                      }`}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      {link.text}
                    </Link>
                    {link.subLinks && (
                      <div className="absolute top-full left-0 pt-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
                        <div className="bg-gray-700 rounded-md shadow-lg p-2 w-max">
                          {link.subLinks.map((subLink) => {
                            const SubIconComponent = subLink.icon;
                            return (
                              <Link
                                key={subLink.id}
                                to={subLink.href}
                                className="flex items-center gap-2 px-4 py-2 text-nowrap text-sm text-left text-gray-200 hover:bg-gray-600 rounded-md transition-colors"
                              >
                                {SubIconComponent && <SubIconComponent className="w-3 h-3" />}
                                {subLink.text}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'EN' ? 'AR' : 'EN')}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition-all duration-300 text-sm"
              >
                {language}
              </button>
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-electric-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-electric-blue-700 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-200 focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden pb-4" style={{ backgroundColor: '#00122d' }}>
          <nav className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <React.Fragment key={link.id}>
                  <Link
                    to={link.href}
                    onClick={() => !link.subLinks && setIsOpen(false)}
                    className="flex items-center gap-2 text-gray-300 hover:text-electric-blue-400 transition-colors duration-300 font-medium text-lg"
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    {link.text}
                  </Link>
                  {link.subLinks && (
                    <div className="pl-4 flex flex-col items-center space-y-3 pt-1 pb-2">
                      {link.subLinks.map(subLink => {
                        const SubIconComponent = subLink.icon;
                        return (
                          <Link
                            key={subLink.id}
                            to={subLink.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 text-gray-400 hover:text-electric-blue-500 transition-colors duration-300"
                          >
                            {SubIconComponent && <SubIconComponent className="w-4 h-4" />}
                            {subLink.text}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
          <div className="flex flex-col items-center space-y-4 mt-6">
            {/* Mobile Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'AR' : 'EN')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition-all duration-300"
            >
              {language === 'EN' ? 'العربية' : 'English'}
            </button>
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-3/4 px-4 py-2 bg-electric-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-electric-blue-700 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
