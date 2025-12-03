
export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  isOnline?: boolean;
  bio?: string;
  location?: string;
  work?: string;
  skills?: string[];
  education?: string;
  connections?: number;
  coverImage?: string;
  isVerified?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  likedByMe: boolean;
  type: 'text' | 'image' | 'video' | 'generated_image' | 'generated_video';
}

export interface Story {
    id: string;
    userId: string;
    image: string;
    viewed: boolean;
}

export interface Clip {
    id: string;
    userId: string;
    videoUrl: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
    songName: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAi?: boolean;
  image?: string;
  audio?: string;
  senderName?: string; 
}

export interface ChatSession {
  id: string;
  userId?: string; 
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
  participants?: string[]; 
  lastMessage: string;
  unread: number;
  messages: Message[];
}

export interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  genre: string;
  rating: string;
  url: string; // Placeholder for stream
}

export interface TVChannel {
  id: string;
  name: string;
  category: string;
  currentShow: string;
  thumbnail: string;
  streamUrl: string;
}

export interface Scholarship {
  id: string;
  title: string;
  amount: string;
  deadline: string;
  description: string;
  organization: string;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  snippet: string;
}

export interface Gig {
    id: string;
    title: string;
    pay: string;
    type: 'Remote' | 'On-site';
    description: string;
}

export interface MarketplaceItem {
    id: string;
    title: string;
    price: string;
    image: string;
    location: string;
    seller: string;
}

export interface Notification {
    id: string;
    type: 'like' | 'comment' | 'friend_req' | 'system';
    text: string;
    time: string;
    read: boolean;
    user?: User;
}

export enum ViewState {
  FEED = 'FEED',
  CLIPS = 'CLIPS',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE',
  NOTIFICATIONS = 'NOTIFICATIONS',
  EXPLORE = 'EXPLORE',
  APPS = 'APPS',
  MENU = 'MENU'
}