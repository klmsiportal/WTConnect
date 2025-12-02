
import React, { useState } from 'react';
import { Home, MessageSquare, User, Bell, Search, LogOut, Compass, Users, Menu, X, PlaySquare, Grid, Moon, Sun, Wifi, WifiOff } from 'lucide-react';
import { ViewState, Notification } from '../types';
import { logout } from '../firebase';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  currentUser: any;
  notifications: Notification[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFreeMode: boolean;
  toggleFreeMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
    currentView, setView, currentUser, notifications,
    isDarkMode, toggleDarkMode, isFreeMode, toggleFreeMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
      logout();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 z-20 transition-colors">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => setView(ViewState.FEED)}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">WTConnect</span>
        </div>

        <div className="px-6 mb-6">
            <div className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all dark:text-white"
                />
            </div>
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavItem 
            icon={<Home size={20} />} 
            label="News Feed" 
            active={currentView === ViewState.FEED} 
            onClick={() => setView(ViewState.FEED)} 
          />
          <NavItem 
            icon={<PlaySquare size={20} />} 
            label="Clips" 
            active={currentView === ViewState.CLIPS} 
            onClick={() => setView(ViewState.CLIPS)} 
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="Messenger" 
            active={currentView === ViewState.CHAT} 
            onClick={() => setView(ViewState.CHAT)} 
          />
          <NavItem 
            icon={<Compass size={20} />} 
            label="Explore & Cinema" 
            active={currentView === ViewState.EXPLORE} 
            onClick={() => setView(ViewState.EXPLORE)} 
          />
           <NavItem 
            icon={<Grid size={20} />} 
            label="Apps" 
            active={currentView === ViewState.APPS} 
            onClick={() => setView(ViewState.APPS)} 
          />
          <NavItem 
            icon={<User size={20} />} 
            label="Profile" 
            active={currentView === ViewState.PROFILE} 
            onClick={() => setView(ViewState.PROFILE)} 
          />
          <NavItem 
            icon={<Bell size={20} />} 
            label="Notifications" 
            active={currentView === ViewState.NOTIFICATIONS} 
            onClick={() => setView(ViewState.NOTIFICATIONS)} 
            badge={unreadNotifications > 0 ? unreadNotifications : undefined}
          />
        </div>

        <div className="p-4 space-y-2">
             <button 
                onClick={toggleFreeMode}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${isFreeMode ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
             >
                 <div className="flex items-center gap-2">
                     {isFreeMode ? <WifiOff size={14} /> : <Wifi size={14} />}
                     {isFreeMode ? 'Free Mode (Data Saver)' : 'Data Mode'}
                 </div>
                 <div className={`w-8 h-4 rounded-full relative ${isFreeMode ? 'bg-purple-500' : 'bg-gray-300'}`}>
                     <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isFreeMode ? 'left-4.5' : 'left-0.5'}`} style={{left: isFreeMode ? '18px' : '2px'}}></div>
                 </div>
             </button>

             <button 
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
             >
                 {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                 {isDarkMode ? 'Light Mode' : 'Dark Mode'}
             </button>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group">
            <div className="relative">
                <img src={currentUser.avatar} alt="User" className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-600 shadow-sm" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0" onClick={() => setView(ViewState.PROFILE)}>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                  {currentUser.name}
                  {currentUser.isVerified && <span className="ml-1 text-blue-500">✓</span>}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Pro Account</p>
            </div>
            <button onClick={handleLogout} title="Logout">
                <LogOut size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-30 px-4 h-16 flex items-center justify-between shadow-sm transition-colors">
         <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">W</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg">WTConnect</span>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={toggleFreeMode} className={`p-2 rounded-full ${isFreeMode ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}>
                <WifiOff size={18} />
            </button>
            <button onClick={toggleDarkMode} className="p-2 text-gray-500 dark:text-gray-300">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full relative" onClick={() => setView(ViewState.NOTIFICATIONS)}>
            <Bell size={20} />
            {unreadNotifications > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
          <img src={currentUser.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" onClick={() => setView(ViewState.PROFILE)} />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-30 h-16 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors">
         <MobileNavItem 
            icon={<Home size={24} />} 
            active={currentView === ViewState.FEED} 
            onClick={() => setView(ViewState.FEED)} 
          />
           <MobileNavItem 
            icon={<PlaySquare size={24} />} 
            active={currentView === ViewState.CLIPS} 
            onClick={() => setView(ViewState.CLIPS)} 
          />
          <MobileNavItem 
            icon={<Grid size={24} />} 
            active={currentView === ViewState.APPS} 
            onClick={() => setView(ViewState.APPS)} 
          />
          <MobileNavItem 
            icon={<MessageSquare size={24} />} 
            active={currentView === ViewState.CHAT} 
            onClick={() => setView(ViewState.CHAT)} 
          />
          <MobileNavItem 
            icon={<User size={24} />} 
            active={currentView === ViewState.PROFILE} 
            onClick={() => setView(ViewState.PROFILE)} 
          />
      </div>
    </>
  );
};

const NavItem = ({ icon, label, active, onClick, badge }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, badge?: number }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm' 
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
    </span>
    <span className="flex-1 text-left">{label}</span>
    {badge && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
    )}
  </button>
);

const MobileNavItem = ({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all ${
      active ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm' : 'text-gray-400 dark:text-gray-500'
    }`}
  >
    {icon}
  </button>
);
