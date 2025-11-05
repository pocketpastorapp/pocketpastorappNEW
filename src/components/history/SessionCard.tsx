import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatSession } from "@/types/chat-types";

interface SessionCardProps {
  session: ChatSession;
  onDelete: (sessionId: string, e: React.MouseEvent) => Promise<void>;
  isDeleting: string | null;
}

const SessionCard = ({ session, onDelete, isDeleting }: SessionCardProps) => {
  const navigate = useNavigate();

  const handleSessionClick = () => {
    navigate(`/history/${session.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card
        className="cursor-pointer hover:bg-accent/50 hover:border-primary/50 hover:shadow-lg transition-all duration-200 relative"
        onClick={handleSessionClick}
      >
      <CardContent className="flex items-start p-4">
        <div className="mr-4 mt-1">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="font-medium line-clamp-2">{session.preview}</div>
          <div className="flex justify-between mt-2">
            <div className="text-xs text-muted-foreground">{formatDate(session.date)}</div>
            <div className="text-xs text-muted-foreground">{session.messages} messages</div>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 ml-2"
                disabled={isDeleting === session.id}
              >
                {isDeleting === session.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                ) : (
                  <MoreVertical className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border shadow-lg">
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center"
                onClick={(e) => onDelete(session.id, e)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete chat history
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default SessionCard;
