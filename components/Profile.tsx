

import React, { useState } from 'react';
import { User, Post } from '../types';
import { MapPin, Briefcase, Link as LinkIcon, Edit3, UserPlus, BookOpen, Award, Users, Check, BadgeCheck, Camera, Loader2, X } from 'lucide-react';
import { generateImage } from '../services/geminiService';

interface ProfileProps {
    currentUser: User;
    posts: Post[];
    isMe: boolean;
}

export const Profile: React.FC<ProfileProps> = ({ currentUser, posts, isMe }) => {
    const [connected, setConnected] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [generatingCover, setGeneratingCover] = useState(false);
    const [coverImage, setCoverImage] = useState(currentUser.coverImage || '');
    
    // Filter posts for this user
    const userPosts = posts.filter(p => p.userId === currentUser.id);

    const handleGenerateCover = async () => {
        const prompt = window.prompt("Describe your dream cover photo:");
        if (!prompt) return;
        setGeneratingCover(true);
        const url = await generateImage(prompt, '16:9');
        if(url) setCoverImage(url);
        setGeneratingCover(false);
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="h-64 relative bg-gray-200 dark:bg-gray-700">
                    {coverImage ? (
                        <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
                    )}
                    
                    {isMe && (
                        <div className="absolute bottom-4 right-4 flex gap-2">
                             <button 
                                onClick={handleGenerateCover}
                                className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                {generatingCover ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                                AI Cover
                            </button>
                        </div>
                    )}
                </div>
                <div className="px-8 pb-8 relative">
                    <div className="-mt-20 mb-6 flex flex-col md:flex-row justify-between items-end">
                        <div className="relative">
                            <img src={currentUser.avatar} alt="Profile" className="w-40 h-40 rounded-full border-[6px] border-white dark:border-gray-800 shadow-xl object-cover" />
                            <div className="absolute bottom-4 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800"></div>
                        </div>
                        <div className="flex gap-3 mb-4 mt-4 md:mt-0">
                            {isMe ? (
                                <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-full font-semibold transition-colors">
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-full font-semibold transition-colors">
                                        Message
                                    </button>
                                    <button 
                                        onClick={() => setConnected(!connected)}
                                        className={`${connected ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-colors`}
                                    >
                                        {connected ? <><Check size={18} /> Connected</> : <><UserPlus size={18} /> Connect</>}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                            {currentUser.name}
                            {currentUser.isVerified && <BadgeCheck className="text-blue-500" size={32} fill="currentColor" />}
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400">{currentUser.work}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <p className="text-sm text-gray-400">{currentUser.connections || 500}+ connections</p>
                            {isMe && !currentUser.isVerified && (
                                <button onClick={() => setShowVerificationModal(true)} className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                    Get Verified
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-1 space-y-6">
                            {/* Intro */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Intro</h3>
                                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                    <p className="leading-relaxed">{currentUser.bio}</p>
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} className="text-gray-400" />
                                        <span>{currentUser.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Briefcase size={20} className="text-gray-400" />
                                        <span>{currentUser.work}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <LinkIcon size={20} className="text-gray-400" />
                                        <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">website.com</a>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Award className="text-indigo-600 dark:text-indigo-400" size={20} /> Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentUser.skills?.map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium">
                                            {skill}
                                        </span>
                                    )) || <p className="text-gray-400 text-sm">No skills added yet.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            {userPosts.length > 0 ? (
                                <div className="space-y-4">
                                     {/* Simple Feed View for Profile */}
                                    {userPosts.map(p => (
                                        <div key={p.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
                                            <p className="text-gray-800 dark:text-gray-200 mb-2">{p.content}</p>
                                            {p.image && <img src={p.image} className="w-full rounded-lg" />}
                                            <div className="mt-2 text-xs text-gray-400">{p.timestamp} • {p.likes} likes</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center py-12">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                            <Edit3 size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No posts yet</h3>
                                        <p className="text-gray-500 dark:text-gray-400">Share what's on your mind to get started.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            {showVerificationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 relative">
                         <button onClick={() => setShowVerificationModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white">
                             <X size={24} />
                         </button>
                         <div className="text-center mb-6">
                             <BadgeCheck className="text-blue-500 w-16 h-16 mx-auto mb-4" />
                             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Get Verified</h2>
                             <p className="text-gray-500 dark:text-gray-400 mt-2">Get the blue tick and stand out.</p>
                         </div>

                         <div className="space-y-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm border border-blue-100 dark:border-blue-900">
                             <p className="font-bold text-blue-800 dark:text-blue-300">Instructions:</p>
                             <ol className="list-decimal pl-4 space-y-2 text-blue-900 dark:text-blue-200">
                                 <li>Send <strong>$9.99 USD</strong> via Mobile Money to: <br/> <span className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded select-all">+231889183557</span></li>
                                 <li>Take a screenshot of the transaction.</li>
                                 <li>Send proof to:
                                     <ul className="list-disc pl-4 mt-1">
                                         <li>Whatsapp: +231889183557</li>
                                         <li>Email: sokpahakinsaye@gmail.com</li>
                                     </ul>
                                 </li>
                             </ol>
                         </div>
                         
                         <button onClick={() => {alert("Request sent! Pending manual review."); setShowVerificationModal(false);}} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                             I have sent the payment
                         </button>
                    </div>
                </div>
            )}
        </div>
    );
};
