
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Define the type for chat bubble colors
export type ChatBubbleColors = {
  userBubble: string;
  botBubble: string;
};

// Default colors for chat bubbles
export const DEFAULT_BUBBLE_COLORS: ChatBubbleColors = {
  userBubble: "#848484", // Default user bubble color (gray)
  botBubble: "#7B93FF"   // Default Pocket Pastor bubble color (light blue)
};

interface ChatSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatSettings = ({ open, onOpenChange }: ChatSettingsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <h2 className="text-lg font-semibold mb-4">Chat Settings</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You can customize chat appearance from your profile menu.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatSettings;
