
import { useNavigate } from "react-router-dom";

interface HomePageLogoProps {
  show: boolean;
}

export const HomePageLogo = ({ show }: HomePageLogoProps) => {
  const navigate = useNavigate();

  const navigateToChat = () => {
    navigate('/chat');
  };

  if (!show) return null;

  return (
    <div 
      onClick={navigateToChat} 
      className="flex flex-col items-center cursor-pointer transition-opacity hover:opacity-80"
    >
      <div className="h-24 w-24 rounded-full flex items-center justify-center animate-fade-in" style={{
        backgroundColor: "#184482"
      }}>
        <img src="/lovable-uploads/a19ecfc3-8955-4b81-943f-6ee46e455161.png" alt="Cross Logo" className="h-14 w-11" />
      </div>
    </div>
  );
};
