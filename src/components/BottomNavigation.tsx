import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, BookOpen, Star } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Don't show bottom navigation if user is not logged in
  if (!user) {
    return null;
  }

  // Determine if the current route is active
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Navigation items - Home, Chat, Bible, Favorites
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/bible", icon: BookOpen, label: "Bible" },
    { path: "/favorites", icon: Star, label: "Favorites" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border pb-safe"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-20 gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg"
              >
                {/* Animated pill background for active state */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/20 rounded-xl border border-primary/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon with bounce animation */}
                <motion.div
                  className={`relative z-10 transition-colors duration-200 ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: active ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon size={24} strokeWidth={1.5} />
                </motion.div>

                {/* Label with fade */}
                <motion.span
                  className={`relative z-10 text-xs font-medium transition-colors duration-200 ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;
