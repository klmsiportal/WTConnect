

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Sparkles, Image as ImageIcon, Video, Send, Loader2, Edit2, Play, Trash2, Check, PenTool, FileText } from 'lucide-react';
import { Post, User, Comment } from '../types';
import { Button } from './Button';
import { generatePostEnhancement, generateImage, generateVideo, summarizeText, draftPostFromTopic } from '../services/geminiService';
import { Stories } from './Stories';

interface FeedProps {
  currentUser: User;
  users: User[];
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  isFreeMode: boolean;
}

export const Feed: React.FC<FeedProps> = ({ currentUser, users, posts, setPosts, isFreeMode }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState<{url: string, type: 'image' | 'video'} | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // Summarization State
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);

  // Edit State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  // Media Gen Options
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9'>('16:9');

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
          likedByMe: !post.likedByMe
        };
      }
      return post;
    }));
  };

  const handleEnhance = async () => {
    if (!newPostContent.trim()) return;
    setIsEnhancing(true);
    const enhanced = await generatePostEnhancement(newPostContent);
    setNewPostContent(enhanced);
    setIsEnhancing(false);
  };

  const handleDraft = async () => {
      const topic = prompt("Enter a topic or idea (e.g. 'Monday Motivation'):");
      if(!topic) return;
      setIsDrafting(true);
      const draft = await draftPostFromTopic(topic);
      setNewPostContent(draft);
      setIsDrafting(false);
  }

  const handleSummarize = async (postId: string, content: string) => {
      setLoadingSummary(postId);
      const summary = await summarizeText(content);
      setSummaries(prev => ({...prev, [postId]: summary}));
      setLoadingSummary(null);
  }

  const handleGenerateImage = async () => {
      if (!newPostContent.trim()) {
        alert("Please enter a prompt first.");
        return;
      }
      setIsGeneratingMedia(true);
      const url = await generateImage(newPostContent, aspectRatio === '1:1' ? '1:1' : '16:9');
      if (url) setGeneratedMedia({ url, type: 'image' });
      setIsGeneratingMedia(false);
      setShowMediaOptions(false);
  }

  const handleGenerateVideo = async () => {
    if (!newPostContent.trim()) {
        alert("Please enter a prompt first.");
        return;
    }
    setIsGeneratingMedia(true);
    // Veo supports 16:9 or 9:16
    const url = await generateVideo(newPostContent, aspectRatio === '1:1' ? '16:9' : aspectRatio); 
    if (url) setGeneratedMedia({ url, type: 'video' });
    setIsGeneratingMedia(false);
    setShowMediaOptions(false);
  }

  const handlePost = () => {
    if (!newPostContent.trim() && !generatedMedia) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: newPostContent,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      likedByMe: false,
      type: generatedMedia?.type === 'video' ? 'generated_video' : generatedMedia?.type === 'image' ? 'generated_image' : 'text',
      image: generatedMedia?.type === 'image' ? generatedMedia.url : undefined,
      video: generatedMedia?.type === 'video' ? generatedMedia.url : undefined
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setGeneratedMedia(null);
  };

  const handleDeletePost = (postId: string) => {
      if(confirm("Are you sure you want to delete this post?")) {
          setPosts(prev => prev.filter(p => p.id !== postId));
      }
  }

  const startEditPost = (post: Post) => {
      setEditingPostId(post.id);
      setEditContent(post.content);
  }

  const saveEditPost = () => {
      if (!editingPostId) return;
      setPosts(prev => prev.map(p => p.id === editingPostId ? {...p, content: editContent} : p));
      setEditingPostId(null);
      setEditContent('');
  }

  const handleAddComment = (postId: string) => {
      if(!commentText.trim()) return;
      setPosts(prev => prev.map(post => {
          if (post.id === postId) {
              return {
                  ...post,
                  comments: [...post.comments, {
                      id: Date.now().toString(),
                      userId: currentUser.id,
                      text: commentText,
                      timestamp: 'Just now'
                  }]
              }
          }
          return post;
      }));
      setCommentText('');
  }

  const getUser = (id: string) => users.find(u => u.id === id) || currentUser;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 pb-24 md:pb-8">
      {/* Stories Carousel - Hide in Free Mode to save data */}
      {!isFreeMode && <Stories currentUser={currentUser} users={users} />}

      {/* Create Post Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6 transition-colors">
        <div className="flex gap-4">
          <img src={currentUser.avatar} alt="Me" className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700" />
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
              className="w-full border-none focus:ring-0 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-lg h-20 p-0 bg-transparent"
            />
            
            {generatedMedia && !isFreeMode && (
                <div className="relative mt-2 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <button onClick={() => setGeneratedMedia(null)} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 z-10">
                        <span className="sr-only">Remove</span>
                        <Trash2 size={16} />
                    </button>
                    {generatedMedia.type === 'image' ? (
                        <img src={generatedMedia.url} className="w-full h-64 object-cover" />
                    ) : (
                        <video src={generatedMedia.url} controls className="w-full h-64 object-cover" />
                    )}
                </div>
            )}

            {showMediaOptions && !isFreeMode && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">AI Generation Tools</p>
                    <div className="flex gap-2 mb-3">
                        <button onClick={() => setAspectRatio('1:1')} className={`px-3 py-1 text-xs rounded-full border ${aspectRatio === '1:1' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300'}`}>Square (1:1)</button>
                        <button onClick={() => setAspectRatio('16:9')} className={`px-3 py-1 text-xs rounded-full border ${aspectRatio === '16:9' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300'}`}>Landscape (16:9)</button>
                    </div>
                    <div className="flex gap-2">
                         <Button size="sm" onClick={handleGenerateImage} disabled={isGeneratingMedia} className="flex-1">
                            {isGeneratingMedia ? <Loader2 className="animate-spin mr-2" size={16} /> : <ImageIcon size={16} className="mr-2" />}
                            Gen Image (Pro)
                         </Button>
                         <Button size="sm" onClick={handleGenerateVideo} disabled={isGeneratingMedia} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 border-none hover:from-purple-700 hover:to-indigo-700 text-white">
                            {isGeneratingMedia ? <Loader2 className="animate-spin mr-2" size={16} /> : <Video size={16} className="mr-2" />}
                            Gen Video (Veo)
                         </Button>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex gap-1">
                <button onClick={() => isFreeMode ? alert("Disable Free Mode to generate media") : setShowMediaOptions(!showMediaOptions)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 rounded-full transition-colors" title="Generate Media">
                  <ImageIcon size={20} />
                </button>
                 <button 
                  onClick={handleDraft}
                  disabled={isDrafting}
                  className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Draft with AI"
                >
                  {isDrafting ? <Loader2 className="animate-spin" size={20} /> : <PenTool size={20} />}
                </button>
                 <button 
                  onClick={handleEnhance}
                  disabled={isEnhancing || !newPostContent}
                  className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Enhance Text"
                >
                  {isEnhancing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                </button>
              </div>
              <Button onClick={handlePost} disabled={!newPostContent.trim() && !generatedMedia} className="px-6 rounded-full">
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => {
          const author = getUser(post.userId);
          const isExpanded = expandedPostId === post.id;
          const isEditing = editingPostId === post.id;
          const isMe = post.userId === currentUser.id;
          const isLongPost = post.content.length > 150;

          return (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        {author.name}
                        {author.isVerified && <span className="text-blue-500 text-xs">✓</span>}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                  </div>
                </div>
                {isMe && (
                    <div className="flex items-center gap-1">
                        <button onClick={() => startEditPost(post)} className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDeletePost(post.id)} className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-gray-700">
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
              </div>

              <div className="px-4 pb-3">
                {isEditing ? (
                    <div className="flex gap-2 mb-2">
                        <textarea 
                            value={editContent} 
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button onClick={saveEditPost} className="bg-green-500 text-white p-2 rounded-lg"><Check size={20} /></button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                        {summaries[post.id] && (
                            <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-sm text-indigo-800 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-800">
                                <span className="font-bold mr-1">AI Summary:</span> {summaries[post.id]}
                            </div>
                        )}
                        {isLongPost && !summaries[post.id] && (
                            <button 
                                onClick={() => handleSummarize(post.id, post.content)}
                                className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1 hover:underline"
                            >
                                {loadingSummary === post.id ? <Loader2 className="animate-spin" size={14} /> : <FileText size={14} />}
                                Summarize this
                            </button>
                        )}
                    </>
                )}
              </div>

              {/* Media Content - Hide in Free Mode unless user taps to view (not impl here, just hiding) */}
              {!isFreeMode && post.image && (
                <div className="mt-1 bg-gray-100 dark:bg-gray-900">
                  <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[600px]" />
                </div>
              )}
              {isFreeMode && post.image && (
                 <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-8 text-center text-gray-500">
                     <ImageIcon className="mx-auto mb-2" />
                     <p className="text-sm">Image hidden (Free Mode)</p>
                 </div>
              )}

              {!isFreeMode && post.video && (
                  <div className="mt-1 bg-black">
                      <video src={post.video} controls className="w-full h-auto max-h-[600px]" />
                  </div>
              )}

              <div className="p-3 px-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between mt-1">
                <div className="flex gap-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${post.likedByMe ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart size={20} fill={post.likedByMe ? "currentColor" : "none"} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm font-medium">{post.comments.length}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {isExpanded && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="space-y-4 mb-4">
                          {post.comments.length === 0 && <p className="text-sm text-gray-400 text-center">No comments yet. Be the first!</p>}
                          {post.comments.map(comment => {
                              const commentAuthor = getUser(comment.userId);
                              return (
                                  <div key={comment.id} className="flex gap-3">
                                      <img src={commentAuthor.avatar} className="w-8 h-8 rounded-full" />
                                      <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none shadow-sm flex-1">
                                          <p className="font-semibold text-xs text-gray-900 dark:text-white mb-1">{commentAuthor.name}</p>
                                          <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                      <div className="flex gap-2">
                          <img src={currentUser.avatar} className="w-8 h-8 rounded-full" />
                          <div className="flex-1 relative">
                              <input 
                                type="text" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                placeholder="Write a comment..." 
                                className="w-full rounded-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pl-4 pr-10 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                              />
                              <button onClick={() => handleAddComment(post.id)} className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 dark:text-indigo-400">
                                  <Send size={16} />
                              </button>
                          </div>
                      </div>
                  </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
