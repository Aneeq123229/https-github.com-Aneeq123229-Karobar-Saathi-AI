import React from 'react';

export type Role = 'user' | 'model';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  prompt: string;
  description: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}