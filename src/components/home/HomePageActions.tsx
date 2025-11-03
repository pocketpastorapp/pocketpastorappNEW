
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface HomePageActionsProps {
  isInstallable: boolean;
  onInstallClick: () => void;
}

export const HomePageActions = ({ isInstallable, onInstallClick }: HomePageActionsProps) => {
  const navigate = useNavigate();

  const navigateToChat = () => {
    navigate('/chat');
  };

  return (
    <>
      {/* Start Chatting Button - always shown */}
      <Button size="lg" onClick={navigateToChat} className="gap-2 text-lg py-6 px-10 mt-2" style={{
        backgroundColor: "#184482"
      }}>
        <span className="mr-1">💬</span>
        Start Chatting
      </Button>
      
      {/* Secondary Actions */}
      {isInstallable && (
        <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6 animate-fade-in-up" style={{
          animationDelay: "0.5s"
        }}>
          <Button size="lg" variant="secondary" onClick={onInstallClick} className="gap-2 text-white hover:bg-opacity-90" style={{
            backgroundColor: "#184482"
          }}>
            <Download className="h-5 w-5" />
            Install App
          </Button>
        </div>
      )}
    </>
  );
};
