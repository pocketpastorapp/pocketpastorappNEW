
export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  isFavorite?: boolean;
  sessionId?: string;
}

export interface ChatContextType {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  isProcessing: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  currentSpeakingId: string | null;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  handleSendMessage: (e?: React.FormEvent) => Promise<void>;
  toggleFavorite: (id: string, isFavorite: boolean) => Promise<void>;
  toggleSpeechRecognition: () => void;
  handleSpeak: (id: string, text: string) => void;
  handlePause: () => void;
  handleResume: () => void;
  handleSkipForward: () => void;
  handleSkipBackward: () => void;
  handleSeek: (position: number) => void;
  audioDuration: number;
  audioProgress: number;
  isPaused: boolean;
  currentSessionId?: string | null;
  error?: string | null;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
  startNewSession?: () => Promise<void>;
}

export interface ChatSession {
  id: string;
  preview: string;
  date: string;
  messages: number;
  lastMessageTime: string;
}
