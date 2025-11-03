
import Layout from "@/components/Layout";
import { useHomePageSettings } from "@/hooks/useHomePageSettings";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { HomePageContent } from "@/components/home/HomePageContent";

const HomePage = () => {
  const { homeSettings, isLoadingSettings } = useHomePageSettings();
  const { isInstallable, handleInstallClick } = usePWAInstall();
  
  return (
    <Layout>
      <HomePageContent 
        isLoadingSettings={isLoadingSettings}
        homeSettings={homeSettings}
        isInstallable={isInstallable}
        onInstallClick={handleInstallClick}
      />
    </Layout>
  );
};

export default HomePage;
