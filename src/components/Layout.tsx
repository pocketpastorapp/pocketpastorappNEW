import { motion } from "framer-motion";
import AppHeader from "./AppHeader";
import Footer from "./Footer";
import BottomNavigation from "./BottomNavigation";

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout = ({ children, showHeader = true, showFooter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeader && <AppHeader variant="default" />}

      {/* Main Content with page transition animation */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 pt-16 pb-28"
      >
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </motion.main>

      {/* Footer - Only show on Login and Settings pages */}
      {showFooter && <Footer />}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
