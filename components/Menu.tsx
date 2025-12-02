
import React from 'react';
import { 
  Users, Heart, Briefcase, Calendar, Clock, Bookmark, Gamepad, Video, 
  ShoppingBag, Star, Zap, MapPin, Flag, Gift, Music, Coffee, BookOpen, 
  Smile, Sun, Shield, Settings, HelpCircle, LogOut, Grid, TrendingUp,
  Activity, Award, BarChart, Bell, Camera, Cast, Cloud, Code, Compass,
  Cpu, CreditCard, Database, Disc, DollarSign, Eye, FileText, Film,
  Folder, Globe, Headphones, Image, Key, Layers, Layout, LifeBuoy,
  Link, List, Lock, Mail, Mic, Monitor, Moon, MousePointer, Navigation
} from 'lucide-react';
import { User } from '../types';

interface MenuProps {
  currentUser: User;
  onLogout: () => void;
}

export const Menu: React.FC<MenuProps> = ({ currentUser, onLogout }) => {
  const features = [
    { icon: <Users className="text-blue-500" />, label: "Friends", desc: "Connect with people" },
    { icon: <Users className="text-blue-600" />, label: "Groups", desc: "Join communities" },
    { icon: <ShoppingBag className="text-blue-500" />, label: "Marketplace", desc: "Buy and sell" },
    { icon: <Video className="text-blue-500" />, label: "Watch", desc: "Videos & Shows" },
    { icon: <Clock className="text-blue-500" />, label: "Memories", desc: "Look back" },
    { icon: <Bookmark className="text-purple-500" />, label: "Saved", desc: "Your items" },
    { icon: <Flag className="text-orange-500" />, label: "Pages", desc: "Manage pages" },
    { icon: <Calendar className="text-red-500" />, label: "Events", desc: "Discover events" },
    { icon: <Gamepad className="text-blue-500" />, label: "Gaming", desc: "Play instant games" },
    { icon: <Briefcase className="text-orange-600" />, label: "Jobs", desc: "Find a career" },
    { icon: <Heart className="text-pink-500" />, label: "Dating", desc: "Find love" },
    { icon: <Star className="text-yellow-500" />, label: "Favorites", desc: "Manage favorites" },
    { icon: <Zap className="text-yellow-600" />, label: "Offers", desc: "Discounts" },
    { icon: <MapPin className="text-green-500" />, label: "Nearby", desc: "Find friends" },
    { icon: <Gift className="text-teal-500" />, label: "Fundraisers", desc: "Give support" },
    { icon: <Music className="text-pink-600" />, label: "Music", desc: "Stream songs" },
    { icon: <Coffee className="text-brown-500" />, label: "Campus", desc: "Student life" },
    { icon: <BookOpen className="text-blue-800" />, label: "Guides", desc: "Learning" },
    { icon: <Smile className="text-yellow-400" />, label: "Avatars", desc: "Create yourself" },
    { icon: <Sun className="text-orange-400" />, label: "Weather", desc: "Forecast" },
    { icon: <Activity className="text-red-500" />, label: "Health", desc: "Wellness center" },
    { icon: <Award className="text-purple-600" />, label: "Awards", desc: "Achievements" },
    { icon: <BarChart className="text-green-600" />, label: "Ads Manager", desc: "Promote business" },
    { icon: <Bell className="text-gray-600" />, label: "Alerts", desc: "Crisis response" },
    { icon: <Camera className="text-indigo-500" />, label: "Live", desc: "Go Live" },
    { icon: <Cast className="text-blue-400" />, label: "Cast", desc: "Stream to TV" },
    { icon: <Cloud className="text-sky-500" />, label: "Drive", desc: "Cloud storage" },
    { icon: <Code className="text-slate-700" />, label: "Devs", desc: "Developer tools" },
    { icon: <Compass className="text-red-400" />, label: "Discover", desc: "Explore more" },
    { icon: <CreditCard className="text-green-700" />, label: "WTPay", desc: "Secure payments" },
    { icon: <Database className="text-indigo-800" />, label: "Data", desc: "Analytics" },
    { icon: <Disc className="text-pink-400" />, label: "Podcasts", desc: "Listen now" },
    { icon: <DollarSign className="text-green-500" />, label: "Monetization", desc: "Creator studio" },
    { icon: <Eye className="text-blue-300" />, label: "View", desc: "VR Mode" },
    { icon: <FileText className="text-gray-500" />, label: "Docs", desc: "Document editor" },
    { icon: <Film className="text-red-600" />, label: "Movies", desc: "Cinema hub" },
    { icon: <Globe className="text-blue-500" />, label: "Climate", desc: "Science center" },
    { icon: <Headphones className="text-purple-400" />, label: "Audio", desc: "Audio rooms" },
    { icon: <Image className="text-green-400" />, label: "Gallery", desc: "Photos" },
    { icon: <Key className="text-yellow-600" />, label: "Pass", desc: "Security check" },
    { icon: <Layers className="text-indigo-400" />, label: "Stack", desc: "Tech news" },
    { icon: <Layout className="text-orange-300" />, label: "Design", desc: "Creative tools" },
    { icon: <LifeBuoy className="text-red-400" />, label: "Help", desc: "Support center" },
    { icon: <Link className="text-gray-400" />, label: "Sync", desc: "Cross-platform" },
    { icon: <List className="text-blue-400" />, label: "Lists", desc: "Todo & Tasks" },
    { icon: <Lock className="text-slate-500" />, label: "Privacy", desc: "Checkup" },
    { icon: <Mail className="text-red-500" />, label: "Newsletter", desc: "Subscriptions" },
    { icon: <Mic className="text-purple-500" />, label: "Voice", desc: "Voice commands" },
    { icon: <Monitor className="text-gray-700" />, label: "Studio", desc: "Dashboard" },
    { icon: <Navigation className="text-green-500" />, label: "Trips", desc: "Travel guide" }
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h1>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
             <Settings size={24} className="text-gray-700 dark:text-gray-200" />
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
           <img src={currentUser.avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
           <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{currentUser.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">View your profile</p>
           </div>
        </div>

        {/* Shortcuts Grid */}
        <h2 className="font-semibold text-gray-600 dark:text-gray-400 mb-3 ml-1">All Shortcuts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {features.map((feature, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3">
                    <div className="self-start">
                        {React.cloneElement(feature.icon as React.ReactElement, { size: 28 })}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{feature.label}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Help & Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm mb-8">
           <button className="w-full flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
               <HelpCircle className="text-gray-500" />
               <span className="font-medium text-gray-900 dark:text-white">Help & Support</span>
           </button>
           <button className="w-full flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
               <Settings className="text-gray-500" />
               <span className="font-medium text-gray-900 dark:text-white">Settings & Privacy</span>
           </button>
           <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
            >
               <LogOut className="text-red-500" />
               <span className="font-medium text-red-600">Log Out</span>
           </button>
        </div>

        <p className="text-center text-xs text-gray-400 pb-8">
            WTConnect from Meta AI • © 2025
        </p>
      </div>
    </div>
  );
};
