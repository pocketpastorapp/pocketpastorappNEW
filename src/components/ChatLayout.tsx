import { motion } from "framer-motion";
import AppHeader from "./AppHeader";
import BottomNavigation from "./BottomNavigation";

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader variant="chat" />

      {/* Main Content with page transition animation */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 container mx-auto px-4 py-6 mt-14 pb-40"
      >
        {children}
      </motion.main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ChatLayout;
