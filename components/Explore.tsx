

import React, { useState, useEffect } from 'react';
import { Tv, CloudSun, GraduationCap, Newspaper, Play, DollarSign, Briefcase, TrendingUp, ShoppingBag, MapPin, Film, Music, Gamepad } from 'lucide-react';
import { getGroundingInfo } from '../services/geminiService';
import { Scholarship, TVChannel, NewsItem, Gig, MarketplaceItem, Movie } from '../types';

export const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tv' | 'cinema' | 'news' | 'scholarships' | 'money' | 'market'>('cinema');
  const [weather, setWeather] = useState<any>(null);
  const [news, setNews] = useState<NewsItem[]>([]);

  // Mock Data
  const movies: Movie[] = [
      { id: 'mv1', title: 'Sci-Fi Odyssey', thumbnail: 'https://picsum.photos/id/1/400/600', genre: 'Sci-Fi', rating: '4.8', url: '#' },
      { id: 'mv2', title: 'Action Hero', thumbnail: 'https://picsum.photos/id/10/400/600', genre: 'Action', rating: '4.5', url: '#' },
      { id: 'mv3', title: 'Comedy Night', thumbnail: 'https://picsum.photos/id/22/400/600', genre: 'Comedy', rating: '4.2', url: '#' },
      { id: 'mv4', title: 'Liberia Rising', thumbnail: 'https://picsum.photos/id/55/400/600', genre: 'Documentary', rating: '5.0', url: '#' }
  ];

  const channels: TVChannel[] = [
    { id: '1', name: 'WT News 24', category: 'News', currentShow: 'Global Update', thumbnail: 'https://picsum.photos/id/100/300/200', streamUrl: '#' },
    { id: '2', name: 'Tech TV', category: 'Tech', currentShow: 'Future of AI', thumbnail: 'https://picsum.photos/id/180/300/200', streamUrl: '#' },
    { id: '3', name: 'Nature Now', category: 'Documentary', currentShow: 'Ocean Depths', thumbnail: 'https://picsum.photos/id/200/300/200', streamUrl: '#' },
    { id: '4', name: 'Sports Live', category: 'Sports', currentShow: 'Championship Finals', thumbnail: 'https://picsum.photos/id/204/300/200', streamUrl: '#' },
  ];

  const scholarships: Scholarship[] = [
    { id: '1', title: 'Global Tech Future Grant', amount: '$10,000', deadline: 'Oct 30, 2025', organization: 'TechFoundation', description: 'For students pursuing CS degrees.' },
    { id: '2', title: 'Creative Arts Fund', amount: '$5,000', deadline: 'Dec 15, 2025', organization: 'ArtsWorld', description: 'Supporting digital artists.' },
    { id: '3', title: 'Women in STEM', amount: '$15,000', deadline: 'Nov 01, 2025', organization: 'STEM Coalition', description: 'Empowering women in science.' },
  ];

  const gigs: Gig[] = [
      { id: 'g1', title: 'Social Media Manager', pay: '$500/mo', type: 'Remote', description: 'Manage WTConnect pages for small business.' },
      { id: 'g2', title: 'Content Creator', pay: '$50/video', type: 'Remote', description: 'Create engaging short-form videos.' },
      { id: 'g3', title: 'Data Entry', pay: '$15/hr', type: 'Remote', description: 'Simple data entry tasks available now.' }
  ];

  const marketItems: MarketplaceItem[] = [
      { id: 'm1', title: 'iPhone 14 Pro Max', price: '$899', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=2070', location: 'Monrovia, Liberia', seller: 'John Doe' },
      { id: 'm2', title: 'MacBook Air M2', price: '$950', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1926', location: 'Monrovia, Liberia', seller: 'Jane Smith' },
      { id: 'm3', title: 'Gaming PC Setup', price: '$1200', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1974', location: 'Ganta, Liberia', seller: 'Tech World' },
      { id: 'm4', title: 'Canon EOS R5', price: '$2500', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1638', location: 'Monrovia, Liberia', seller: 'Photo Pro' },
  ];

  useEffect(() => {
    const loadDynamicContent = async () => {
      // Use Gemini Grounding for Weather
      const weatherData = await getGroundingInfo("What is the current weather in Monrovia, Liberia? Provide a short 1 sentence summary and temperature.");
      setWeather(weatherData.text);

      // Use Gemini Grounding for News
      const newsData = await getGroundingInfo("Top 5 trending tech news headlines today with source links.");
      if (newsData.chunks) {
          const items = newsData.chunks.map((c: any) => ({
              title: c.web?.title || "News Update",
              source: "Web Source",
              url: c.web?.uri || "#",
              snippet: "Click to read more."
          }));
          setNews(items.slice(0, 5));
      }
    };
    loadDynamicContent();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-gray-900 dark:text-white">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2">
            <h2 className="text-2xl font-bold mb-6 px-4">Explore Hub</h2>
             <button onClick={() => setActiveTab('cinema')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'cinema' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'}`}>
                <Film size={20} /> <span className="font-medium">Cinema & Games</span>
            </button>
            <button onClick={() => setActiveTab('market')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'market' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'}`}>
                <ShoppingBag size={20} /> <span className="font-medium">Marketplace</span>
            </button>
            <button onClick={() => setActiveTab('tv')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'tv' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'}`}>
                <Tv size={20} /> <span className="font-medium">Free TV Channels</span>
            </button>
            <button onClick={() => setActiveTab('news')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'news' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'}`}>
                <Newspaper size={20} /> <span className="font-medium">News & Weather</span>
            </button>
            <button onClick={() => setActiveTab('scholarships')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'scholarships' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'}`}>
                <GraduationCap size={20} /> <span className="font-medium">Scholarships</span>
            </button>
             <button onClick={() => setActiveTab('money')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'money' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'}`}>
                <DollarSign size={20} /> <span className="font-medium">Earn Money</span>
            </button>
            
            {/* Weather Widget */}
            <div className="mt-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                    <CloudSun size={24} />
                    <span className="font-bold">Weather Update</span>
                </div>
                <p className="text-sm opacity-90">{weather || "Loading forecast..."}</p>
                <p className="text-xs mt-2 opacity-75">Powered by Gemini Grounding</p>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">

            {activeTab === 'cinema' && (
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Public Cinema (Free)</h2>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {movies.map(m => (
                            <div key={m.id} className="relative aspect-[2/3] bg-gray-900 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
                                <img src={m.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-3">
                                    <h3 className="text-white font-bold text-sm">{m.title}</h3>
                                    <p className="text-gray-300 text-xs">{m.genre} • {m.rating}★</p>
                                </div>
                                <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">FREE</div>
                            </div>
                        ))}
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-purple-900 rounded-2xl p-6 text-white relative overflow-hidden">
                             <Music size={120} className="absolute -right-6 -bottom-6 opacity-20" />
                             <h3 className="text-2xl font-bold mb-2">WT Music</h3>
                             <p className="opacity-80 mb-4">Stream unlimited trending songs.</p>
                             <button className="bg-white text-purple-900 px-6 py-2 rounded-full font-bold text-sm">Listen Now</button>
                         </div>
                         <div className="bg-orange-600 rounded-2xl p-6 text-white relative overflow-hidden">
                             <Gamepad size={120} className="absolute -right-6 -bottom-6 opacity-20" />
                             <h3 className="text-2xl font-bold mb-2">Arcade</h3>
                             <p className="opacity-80 mb-4">Play instant games without download.</p>
                             <button className="bg-white text-orange-600 px-6 py-2 rounded-full font-bold text-sm">Play Now</button>
                         </div>
                     </div>
                </div>
            )}

            {activeTab === 'market' && (
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Today's Picks</h2>
                        <button className="text-indigo-600 font-medium dark:text-indigo-400">Sell Item</button>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {marketItems.map(item => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                <div className="h-48 relative bg-gray-200">
                                    <img src={item.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2">{item.title}</h3>
                                        <span className="font-bold text-gray-900 dark:text-white">{item.price}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                        <MapPin size={12} /> {item.location}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Sold by {item.seller}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            )}

            {activeTab === 'tv' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {channels.map(channel => (
                        <div key={channel.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-gray-100 dark:border-gray-700">
                            <div className="relative h-48 bg-gray-200">
                                <img src={channel.thumbnail} alt={channel.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg transform group-hover:scale-110 transition-transform">
                                        <Play size={24} className="text-indigo-600" />
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">LIVE</div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{channel.name}</h3>
                                <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-1">{channel.currentShow}</p>
                                <p className="text-gray-500 text-xs">{channel.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'scholarships' && (
                <div className="space-y-4">
                     <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">WTConnect Scholarship Program</h3>
                        <p className="text-indigo-700 dark:text-indigo-400">Apply for exclusive grants funded by our community. Over $1M awarded annually.</p>
                     </div>
                     {scholarships.map(item => (
                         <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between md:items-center gap-4">
                             <div>
                                 <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h4>
                                 <p className="text-sm text-gray-500 mb-2">{item.organization}</p>
                                 <p className="text-gray-700 dark:text-gray-300 text-sm max-w-xl">{item.description}</p>
                             </div>
                             <div className="text-right min-w-[150px]">
                                 <div className="text-2xl font-bold text-green-600">{item.amount}</div>
                                 <div className="text-xs text-red-500 font-medium mb-3">Deadline: {item.deadline}</div>
                                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 w-full">Apply Now</button>
                             </div>
                         </div>
                     ))}
                </div>
            )}

            {activeTab === 'news' && (
                <div className="space-y-6">
                    {news.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">Fetching latest news via Gemini Grounding...</p>
                    ) : (
                        news.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                                    <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-indigo-600 hover:underline">{item.title}</a>
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{item.source}</span>
                                    <span>Just now</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'money' && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2"><TrendingUp size={24} /> WTConnect Monetization</h3>
                        <p className="text-green-800 dark:text-green-400">Earn money directly through the platform. Eligible in Liberia and 100+ countries.</p>
                        <div className="flex gap-4 mt-4">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center flex-1">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">$0.00</span>
                                <span className="text-xs text-gray-500">Current Balance</span>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center flex-1">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">0</span>
                                <span className="text-xs text-gray-500">Referrals</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Available Gigs</h3>
                    <div className="grid gap-4">
                        {gigs.map(gig => (
                            <div key={gig.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{gig.title}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <Briefcase size={14} /> {gig.type}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{gig.description}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-indigo-600 dark:text-indigo-400 text-lg">{gig.pay}</span>
                                    <button className="mt-2 bg-gray-900 dark:bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800">Apply</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
