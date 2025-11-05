import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { History, Settings, X, LogOut, Coins, Palette, Sun, Moon, MessageSquare, BookOpen, Star } from "lucide-react";
import { CreditDisplay } from "./CreditDisplay";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/components/theme-provider";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";

interface AppHeaderProps {
  variant?: "default" | "chat";
}

const AppHeader = ({ variant = "default" }: AppHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Determine if the current route is active
  const isActive = (path: string) => location.pathname === path;

  // Menu items
  const menuItems = [
    { path: "/chat", icon: <MessageSquare size={18} />, label: "Chat" },
    { path: "/bible", icon: <BookOpen size={18} />, label: "Bible" },
    { path: "/favorites", icon: <Star size={18} />, label: "Favorites" },
    { path: "/history", icon: <History size={18} />, label: "History" },
    { path: "/settings", icon: <Palette size={18} />, label: "Customize" },
  ];

  // Choose logo based on theme
  const logoSrc = theme === "dark"
    ? "/lovable-uploads/c91e29ee-84ca-453f-b22c-aa78fcd09686.png"
    : "/lovable-uploads/1731a846-1f40-4f13-80e1-04eea0460535.png";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="border-b bg-background fixed top-0 left-0 right-0 z-30 pt-safe">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-lg flex items-center">
              <img src={logoSrc} alt="Pocket Pastor" className="h-8 w-auto mr-2" />
            </Link>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {user && <CreditDisplay />}

            {user && (
              <>
                {/* Settings Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-auto min-w-40 max-w-64">
                    {/* Theme Toggle */}
                    <div className="px-2 py-2">
                      <div className="flex items-center gap-3">
                        {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                        <Switch
                          checked={theme === "dark"}
                          onCheckedChange={toggleTheme}
                          style={{
                            backgroundColor: theme === "dark" ? "#184482" : undefined
                          }}
                          className="data-[state=checked]:bg-[#184482]"
                        />
                      </div>
                    </div>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem>
                      <Link to="/history" className="w-full flex items-center gap-2">
                        <History size={16} />
                        <span>History</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/settings" className="w-full flex items-center gap-2">
                        <Palette size={16} />
                        <span>Customize</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/credits" className="w-full flex items-center gap-2">
                        <Coins size={16} />
                        <span>Credits</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/account-settings" className="w-full flex items-center gap-2">
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {/* User Profile Section - moved to bottom */}
                    <div className="px-2 py-3">
                      <div className="text-sm font-medium text-foreground">
                        {profile?.name || user.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>

                    <DropdownMenuItem onClick={logout} className="flex items-center gap-2">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!user && (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-pastor-navy text-pastor-navy hover:bg-gray-100"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <Link to="/" className="font-bold text-xl flex items-center">
                <img src={logoSrc} alt="Pocket Pastor" className="h-8 w-auto mr-2" />
                Pocket Pastor
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              {user && menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 p-2 rounded-md ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {user ? (
                <Button variant="outline" onClick={logout} className="mt-4">
                  Logout
                </Button>
              ) : (
                <Link to="/login" className="mt-4">
                  <Button variant="default" className="w-full">Login</Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;
