import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink as NavLinkType } from '../types';

interface NavbarProps {
  title: string;
  links: NavLinkType[];
}

const Navbar: React.FC<NavbarProps> = ({ title, links }) => {
  return (
    <nav className="bg-gray-800 text-white w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold">{title}</div>
          <div className="flex space-x-6">
            {links.map((link) => (
              <Link
                key={link.id}
                to={link.href}
                className="hover:text-electric-blue-400 transition-colors duration-300"
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
