
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div>
            <h4 className="font-medium mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground">
              <button 
                onClick={() => navigate('/privacy-policy')}
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => navigate('/terms-of-service')}
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="hover:text-foreground transition-colors"
              >
                About Us
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-4 md:mt-8 pt-4 md:pt-8 text-center text-xs md:text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pocket Pastor. All rights reserved.</p>
          <p className="mt-1 md:mt-2">
            <em>Pocket Pastor's guidance is for inspirational purposes only and is not a replacement for a relationship with God, the Word of God, and professional pastoral care.</em>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
