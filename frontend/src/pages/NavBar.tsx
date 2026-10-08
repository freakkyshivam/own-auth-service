import { useState, useEffect } from 'react';
import { Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import NavBarMenuAndAvtar from '@/components/navabr/NavBarMenuAndAvtar';
import NavbarMobileMenu from '@/components/navabr/NavbarMobileMenu';
import { logout } from '@/utils/logout';
 import { useAuth } from '@/auth/useAuth';
const NavBar = () => {
  const [scrollY, setScrollY] = useState(0);

   const navigate = useNavigate();  
 const { resetAuth } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    console.log('Logging out...');
    await logout(resetAuth);
     
  };

 

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-md bg-transparent border-b border-gray-800 transition-all duration-300"
      style={{
        boxShadow: scrollY > 10 ? '0 4px 6px -1px rgba(0,0,0,0.5)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold bg-linear-to-br from-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
                Authify
              </h1>
              <span className="text-[10px] font-mono tracking-wider bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                authify.in
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-400 -mt-0.5">Authentication infrastructure for developers</p>
          </div>
        </div>

         

         <NavBarMenuAndAvtar handleLogout={handleLogout}/>
      <NavbarMobileMenu handleLogout={handleLogout}/>
      
      </div>
    </header>
  );
};

export default NavBar;