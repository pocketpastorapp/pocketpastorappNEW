
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SessionList from "@/components/history/SessionList";
import { useChatSessions } from "@/hooks/useChatSessions";


const HistoryPage = () => {
  const navigate = useNavigate();
  const { 
    sessions, 
    isLoading, 
    isDeleting, 
    handleDeleteSession,
    fetchChatSessions
  } = useChatSessions();
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="mr-4 rounded-full"
              onClick={() => navigate('/chat')}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Chat</span>
            </Button>
            <h1 className="text-3xl font-bold">Chat History</h1>
          </div>
        </div>
        
        <SessionList
          sessions={sessions}
          isLoading={isLoading}
          isDeleting={isDeleting}
          onDeleteSession={handleDeleteSession}
        />
      </div>
    </Layout>
  );
};

export default HistoryPage;
