
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Story, User } from '../types';

interface StoriesProps {
    currentUser: User;
    users: User[];
}

export const Stories: React.FC<StoriesProps> = ({ currentUser, users }) => {
    const [viewingStory, setViewingStory] = useState<Story | null>(null);

    // Mock Stories
    const stories: Story[] = [
        { id: 's1', userId: 'u2', image: 'https://picsum.photos/id/1015/400/800', viewed: false },
        { id: 's2', userId: 'u3', image: 'https://picsum.photos/id/1016/400/800', viewed: false },
        { id: 's3', userId: 'u2', image: 'https://picsum.photos/id/1018/400/800', viewed: true },
    ];

    const getUser = (id: string) => users.find(u => u.id === id) || currentUser;

    return (
        <div className="mb-6 relative">
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {/* Create Story Card */}
                <div className="flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden relative cursor-pointer group shadow-sm bg-white border border-gray-200">
                    <img src={currentUser.avatar} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-0 inset-x-0 h-16 bg-white flex flex-col items-center justify-end pb-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center absolute -top-4 shadow-sm">
                            <Plus size={20} className="text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-900">Create Story</span>
                    </div>
                </div>

                {/* Friend Stories */}
                {stories.map(story => {
                    const author = getUser(story.userId);
                    return (
                        <div 
                            key={story.id} 
                            onClick={() => setViewingStory(story)}
                            className="flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden relative cursor-pointer group shadow-sm"
                        >
                            <div className={`absolute inset-0 border-4 rounded-xl z-10 pointer-events-none ${story.viewed ? 'border-gray-200' : 'border-indigo-600'}`}></div>
                            <img src={story.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
                            <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-indigo-600 p-0.5 bg-white z-20">
                                <img src={author.avatar} className="w-full h-full rounded-full object-cover" />
                            </div>
                            <span className="absolute bottom-2 left-2 text-white text-xs font-bold z-20 shadow-black drop-shadow-md">{author.name.split(' ')[0]}</span>
                        </div>
                    );
                })}
            </div>

            {/* Story Viewer Modal */}
            {viewingStory && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    <button onClick={() => setViewingStory(null)} className="absolute top-4 right-4 text-white p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                        <X size={24} />
                    </button>
                    <div className="h-full md:h-[90vh] aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden relative">
                         <img src={viewingStory.image} className="w-full h-full object-cover" />
                         <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex items-center gap-3">
                            <img src={getUser(viewingStory.userId).avatar} className="w-10 h-10 rounded-full border-2 border-white" />
                            <span className="text-white font-bold">{getUser(viewingStory.userId).name}</span>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
}
