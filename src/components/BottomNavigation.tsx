import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, BookOpen, Star } from "lucide-react";
import { useAuth } from "@/context/auth-context";

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
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 pb-safe">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-20 gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                  active
                    ? "text-white scale-110"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                <Icon size={24} strokeWidth={1.5} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
