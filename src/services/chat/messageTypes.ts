
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DbMessage {
  id?: string;
  user_id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  is_favorite?: boolean;
  session_id?: string;
}
