
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChatSession } from "@/types/chat-types";
import SessionCard from "./SessionCard";

interface SessionListProps {
  sessions: ChatSession[];
  isLoading: boolean;
  isDeleting: string | null;
  onDeleteSession: (sessionId: string, e: React.MouseEvent) => Promise<void>;
}

const SessionList = ({ 
  sessions, 
  isLoading, 
  isDeleting, 
  onDeleteSession 
}: SessionListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-muted-foreground">Loading chat history...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">You don't have any chat history yet.</p>
        <Button onClick={() => navigate("/chat")} className="mt-4">
          Start a conversation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onDelete={onDeleteSession}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default SessionList;
