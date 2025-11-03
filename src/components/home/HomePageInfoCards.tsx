
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface HomePageInfoCardsProps {
  show: boolean;
}

export const HomePageInfoCards = ({ show }: HomePageInfoCardsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const navigateToChat = () => {
    navigate('/chat');
  };

  const navigateToBible = () => {
    navigate('/bible');
  };

  if (!show) return null;

  return (
    <div className="grid gap-3 md:gap-8 grid-cols-1 md:grid-cols-3 animate-fade-in-up mt-2 md:mt-4" style={{
      animationDelay: "0.2s"
    }}>
      <div 
        onClick={navigateToChat}
        className={`bg-card rounded-xl shadow-sm border flex flex-col items-center text-center gap-2 md:gap-4 cursor-pointer transition-opacity hover:opacity-80 ${isMobile ? 'p-3' : 'p-6'}`}
      >
        <div className={`bg-pastor-purple/10 rounded-full flex items-center justify-center ${isMobile ? 'p-2' : 'p-3'}`} style={{
          backgroundColor: "rgba(24, 68, 130, 0.1)"
        }}>
          <span className={isMobile ? "text-2xl" : "text-3xl"}>💬</span>
        </div>
        <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>Biblical Guidance</h2>
        <p className="text-muted-foreground text-sm md:text-base">Receive scripture-based answers to your spiritual questions and concerns.</p>
      </div>
      
      <div 
        onClick={navigateToBible}
        className={`bg-card rounded-xl shadow-sm border flex flex-col items-center text-center gap-2 md:gap-4 cursor-pointer transition-opacity hover:opacity-80 ${isMobile ? 'p-3' : 'p-6'}`}
      >
        <div className={`bg-pastor-blue p-2 md:p-3 rounded-full flex items-center justify-center`}>
          <span className={isMobile ? "text-2xl" : "text-3xl"}>📚</span>
        </div>
        <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>Scripture Study</h2>
        <p className="text-muted-foreground text-sm md:text-base">Explore biblical teachings with verse references for deeper understanding.</p>
      </div>
      
      <div 
        onClick={navigateToChat}
        className={`bg-card rounded-xl shadow-sm border flex flex-col items-center text-center gap-2 md:gap-4 cursor-pointer transition-opacity hover:opacity-80 ${isMobile ? 'p-3' : 'p-6'}`}
      >
        <div className={`bg-pastor-peach p-2 md:p-3 rounded-full flex items-center justify-center`}>
          <span className={isMobile ? "text-2xl" : "text-3xl"}>🙏</span>
        </div>
        <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>Prayer Support</h2>
        <p className="text-muted-foreground text-sm md:text-base">Request prayers and receive spiritual comfort during difficult times.</p>
      </div>
    </div>
  );
};
