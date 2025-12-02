
import React from 'react';
import { Heart, MessageCircle, Share2, Music2, UserPlus } from 'lucide-react';
import { Clip, User } from '../types';

interface ClipsProps {
    users: User[];
}

export const Clips: React.FC<ClipsProps> = ({ users }) => {
    // Mock Clips
    const clips: Clip[] = [
        {
            id: 'c1',
            userId: 'u2',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
            description: 'Late night vibes in the city 🌃 #neon #citylife',
            likes: 1200,
            comments: 45,
            shares: 12,
            songName: 'Midnight City - M83'
        },
        {
            id: 'c2',
            userId: 'u3',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
            description: 'Spring is finally here! 🌸 #nature #bloom',
            likes: 3500,
            comments: 120,
            shares: 340,
            songName: 'Here Comes The Sun - Beatles'
        }
    ];

    const getUser = (id: string) => users.find(u => u.id === id) || users[0];

    return (
        <div className="h-[calc(100vh-64px)] w-full bg-black snap-y snap-mandatory overflow-y-scroll">
            {clips.map(clip => {
                const author = getUser(clip.userId);
                return (
                    <div key={clip.id} className="h-full w-full relative snap-start flex items-center justify-center bg-gray-900">
                        <video 
                            src={clip.videoUrl} 
                            className="h-full w-full md:w-auto md:max-w-lg object-cover" 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                        />
                        
                        {/* Overlay Controls */}
                        <div className="absolute bottom-0 left-0 right-0 top-0 md:max-w-lg md:mx-auto flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                            <div className="flex items-end justify-between">
                                <div className="text-white space-y-2 mb-4 w-3/4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg shadow-black drop-shadow-md">@{author.name.replace(' ', '')}</h3>
                                        <button className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">Follow</button>
                                    </div>
                                    <p className="text-sm shadow-black drop-shadow-md">{clip.description}</p>
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                        <Music2 size={14} className="animate-spin-slow" />
                                        <span>{clip.songName}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 items-center mb-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-70">
                                            <Heart className="text-white" size={24} />
                                        </div>
                                        <span className="text-white text-xs font-bold">{clip.likes}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                         <div className="w-10 h-10 rounded-full bg-gray-800 bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-70">
                                            <MessageCircle className="text-white" size={24} />
                                        </div>
                                        <span className="text-white text-xs font-bold">{clip.comments}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                         <div className="w-10 h-10 rounded-full bg-gray-800 bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-70">
                                            <Share2 className="text-white" size={24} />
                                        </div>
                                        <span className="text-white text-xs font-bold">{clip.shares}</span>
                                    </div>
                                    <div className="mt-4 w-10 h-10 rounded-full border-4 border-gray-800 overflow-hidden animate-spin-slow">
                                        <img src={author.avatar} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
