export interface User {
  id: string;
  name: string;
  email: string;
  recentlyViewed: string[];
  favorites: string[];
}

export type MemberRole = 'owner' | 'editor' | 'viewer';

export interface BoardMember {
  userId: string;
  role: MemberRole;
  addedAt: Date;
}

export interface Board {
  id: string;
  title: string;
  background: string;
  ownerId: string;
  members: BoardMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
  createdAt: Date;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  boardId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
