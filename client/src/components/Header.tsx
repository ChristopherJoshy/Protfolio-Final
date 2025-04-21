import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-gray-900/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-space font-bold tracking-tight">
            <span className="text-primary-500">C</span>hristopher<span className="text-primary-500">.</span>
          </Link>
          <div className="flex items-center gap-8">
            <nav className="hidden md:block">
              <ul className="flex gap-6">
                <li><a href="#about" className="text-sm font-medium hover:text-primary-400 transition-colors duration-300">About</a></li>
                <li><a href="#skills" className="text-sm font-medium hover:text-primary-400 transition-colors duration-300">Skills</a></li>
                <li><a href="#certificates" className="text-sm font-medium hover:text-primary-400 transition-colors duration-300">Certificates</a></li>
                <li><a href="#projects" className="text-sm font-medium hover:text-primary-400 transition-colors duration-300">Projects</a></li>
                <li><a href="#contact" className="text-sm font-medium hover:text-primary-400 transition-colors duration-300">Contact</a></li>
                <li><Link href="/admin" className="text-sm font-medium hover:text-primary-400 transition-colors duration-300">Admin</Link></li>
              </ul>
            </nav>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <i className={`ri-${theme === 'dark' ? 'moon' : 'sun'}-line text-lg`}></i>
            </Button>
            <Button
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu} 
              className="md:hidden w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <i className="ri-menu-line text-lg"></i>
            </Button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} pt-4 pb-2`}>
          <nav>
            <ul className="flex flex-col gap-4">
              <li><a href="#about" onClick={closeMobileMenu} className="block py-2 text-sm font-medium hover:text-primary-400 transition-colors duration-300">About</a></li>
              <li><a href="#skills" onClick={closeMobileMenu} className="block py-2 text-sm font-medium hover:text-primary-400 transition-colors duration-300">Skills</a></li>
              <li><a href="#certificates" onClick={closeMobileMenu} className="block py-2 text-sm font-medium hover:text-primary-400 transition-colors duration-300">Certificates</a></li>
              <li><a href="#projects" onClick={closeMobileMenu} className="block py-2 text-sm font-medium hover:text-primary-400 transition-colors duration-300">Projects</a></li>
              <li><a href="#contact" onClick={closeMobileMenu} className="block py-2 text-sm font-medium hover:text-primary-400 transition-colors duration-300">Contact</a></li>
              <li><Link href="/admin" onClick={closeMobileMenu} className="block py-2 text-sm font-medium hover:text-primary-400 transition-colors duration-300">Admin</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
