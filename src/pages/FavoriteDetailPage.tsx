
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume, Trash, Copy } from "lucide-react";
import { ChatMessage } from "@/types/chat-types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatMessageContent } from "@/utils/messageFormatting";

import { useChatSpeech } from "@/hooks/chat/use-chat-speech";
import { useSpeechActions } from "@/hooks/chat/use-speech-actions";
import AudioPlayer from "@/components/chat/AudioPlayer";

const FavoriteDetailPage = () => {
  const navigate = useNavigate();
  const { messageId } = useParams();
  const [message, setMessage] = useState<ChatMessage | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    isSpeaking,
    setIsSpeaking,
    currentSpeakingId,
    setCurrentSpeakingId,
  } = useChatSpeech();

  const {
    handleSpeak,
    handlePause,
    handleResume,
    handleSkipForward,
    handleSkipBackward,
    handleSeek,
    audioDuration,
    audioProgress,
    isPaused,
  } = useSpeechActions({ setIsSpeaking, setCurrentSpeakingId });

  useEffect(() => {
    const loadMessage = async () => {
      if (!messageId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("id", messageId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          toast.error("Favorite not found");
          navigate("/favorites", { replace: true });
          return;
        }

        setMessage({
          id: data.id,
          content: data.content,
          sender: data.sender as "user" | "bot",
          timestamp: data.timestamp,
          isFavorite: !!data.is_favorite,
          sessionId: data.session_id ?? undefined,
        });
      } catch (e) {
        console.error("Failed to load favorite:", e);
        toast.error("Failed to load favorite");
        navigate("/favorites", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadMessage();
  }, [messageId, navigate]);

  const handleCopy = () => {
    if (!message) return;
    navigator.clipboard.writeText(message.content)
      .then(() => toast.success("Text copied to clipboard"))
      .catch(() => toast.error("Failed to copy text"));
  };

  const handleListen = () => {
    if (!message) return;
    handleSpeak(message.id, message.content);
  };

  const handleRemove = async () => {
    if (!message) return;
    const { error } = await supabase
      .from("chat_messages")
      .update({ is_favorite: false })
      .eq("id", message.id);
    if (error) {
      console.error("Failed to remove favorite:", error);
      toast.error("Failed to remove favorite");
      return;
    }
    toast.success("Removed from favorites");
    navigate("/favorites");
  };

  // SEO basics
  const pageTitle = useMemo(() => {
    const preview = message?.content.slice(0, 60) || "Favorite";
    return `${preview} – Favorite`;
  }, [message?.content]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="icon"
            className="mr-4"
            onClick={() => navigate("/favorites")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Favorites</span>
          </Button>
          <h1 className="text-3xl font-bold">Favorite</h1>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading…</p>
          </div>
        ) : !message ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Favorite not found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {new Date(message.timestamp).toLocaleDateString()} • {new Date(message.timestamp).toLocaleTimeString()}
            </div>

            <div className="rounded-lg border">
              <div className="p-4">
                {formatMessageContent(message.content)}
              </div>
            </div>

            {/* Audio Player - show when speaking */}
            {isSpeaking && (
              <div className="border rounded-lg p-4">
                <AudioPlayer
                  isPlaying={!isPaused}
                  duration={audioDuration}
                  currentTime={audioProgress}
                  onPause={handlePause}
                  onPlay={handleResume}
                  onSeek={handleSeek}
                  onSkipBackward={handleSkipBackward}
                  onSkipForward={handleSkipForward}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button size="icon" variant="ghost" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
              </Button>
              <Button size="icon" variant="ghost" onClick={handleListen}>
                <Volume className="h-4 w-4" />
                <span className="sr-only">Listen</span>
              </Button>
              <Button size="icon" variant="ghost" onClick={handleRemove}>
                <Trash className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoriteDetailPage;
