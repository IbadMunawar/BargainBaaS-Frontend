import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';

// Define the structure for the navigation links
const navLinks = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle state for mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand Name (Dark Blue and Gray) */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-800 tracking-wider">
              Bargain<span className="text-gray-600">BaaS</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:bg-gray-50 hover:text-primary-800 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                >
                  {link.name}
                </Link>
              ))}
              {/* Call to Action: Login/Dashboard (Blue Button) */}
              <Link
                href="/auth/login"
                className="ml-4 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary-800 hover:bg-primary-900 transition duration-300 shadow-md"
              >
                Login / Dashboard
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden transition-all duration-300 ease-in-out">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="block w-full text-center px-4 py-2 mt-2 text-sm font-semibold rounded-md text-white bg-primary-800 hover:bg-primary-900 transition duration-300"
              onClick={toggleMenu}
            >
              Login / Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
