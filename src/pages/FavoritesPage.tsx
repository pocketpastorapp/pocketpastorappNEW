import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/auth-context";
import FavoriteCard from "@/components/favorites/FavoriteCard";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    favorites,
    isLoading
  } = useFavorites(user);

  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="icon"
            className="mr-4"
            onClick={() => navigate('/chat')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Chat</span>
          </Button>
          <h1 className="text-3xl font-bold">Saved Favorites</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">You haven't saved any favorites yet.</p>
            <p className="text-sm mt-2">Chat with Pocket Pastor and click the heart icon to save messages.</p>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {favorites.map((message) => (
              <motion.div
                key={message.id}
                variants={itemVariants}
              >
                <FavoriteCard
                  message={message}
                  onClick={() => navigate(`/favorites/${message.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
