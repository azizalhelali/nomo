export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  platform: 'instagram' | 'twitter' | 'tiktok' | 'linkedin';
  handle: string;
  avatar?: string;
  bio?: string;
  followers?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  profileId: string;
  content: string;
  media?: string[];
  status: 'draft' | 'scheduled' | 'published' | 'pending';
  scheduledAt?: string;
  publishedAt?: string;
  engagements?: {
    likes: number;
    comments: number;
    shares: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
}
