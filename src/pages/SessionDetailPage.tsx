
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useSessionDetails } from "@/hooks/useSessionDetails";
import SessionHeader from "@/components/history/SessionHeader";
import SessionContent from "@/components/history/SessionContent";
import { useChatSpeech } from "@/hooks/chat/use-chat-speech";
import { useSpeechActions } from "@/hooks/chat/use-speech-actions";
import AudioPlayer from "@/components/chat/AudioPlayer";

const SessionDetailPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { 
    messages, 
    isLoading, 
    isDeleting, 
    sessionTitle, 
    handleDeleteSession 
  } = useSessionDetails(sessionId);
  
  // Speech functionality for history view
  const { isSpeaking, setIsSpeaking, currentSpeakingId, setCurrentSpeakingId } = useChatSpeech();
  const speechActions = useSpeechActions({ setIsSpeaking, setCurrentSpeakingId });
  
  // Updated bubble colors for history pages as requested
  const bubbleColors = {
    userBubble: "#848484",   // Gray for user messages
    botBubble: "#505050"     // Darker gray for bot messages
  };
  
  return (
    <Layout>
      <div className="w-full flex flex-col">
        <SessionHeader 
          title={sessionTitle}
          onBack={() => window.history.back()}
          onDelete={handleDeleteSession}
          isDeleting={isDeleting}
        />
        
        <SessionContent 
          messages={messages}
          isLoading={isLoading}
          bubbleColors={bubbleColors}
          speechActions={speechActions}
          currentSpeakingId={currentSpeakingId}
        />

        {/* Audio Player - show when speaking */}
        {isSpeaking && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
            <AudioPlayer
              isPlaying={!speechActions.isPaused}
              duration={speechActions.audioDuration}
              currentTime={speechActions.audioProgress}
              onPause={speechActions.handlePause}
              onPlay={speechActions.handleResume}
              onSeek={speechActions.handleSeek}
              onSkipBackward={speechActions.handleSkipBackward}
              onSkipForward={speechActions.handleSkipForward}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SessionDetailPage;
