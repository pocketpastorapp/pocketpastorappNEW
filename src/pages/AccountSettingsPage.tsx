
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomePageLayoutSettings } from "@/components/settings/HomePageLayoutSettings";
import { AccountInformationSettings } from "@/components/settings/AccountInformationSettings";
import { DangerZoneSection } from "@/components/settings/DangerZoneSection";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import { useAccountDeletion } from "@/hooks/useAccountDeletion";

const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    homeSettings,
    accountData,
    accountLoading,
    handleHomeSettingsChange,
    handleAccountDataChange,
    handleSaveAccountData,
    handleCancelAccountData
  } = useAccountSettings();

  const { deleteLoading, handleDeleteAccount } = useAccountDeletion();

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>
        
        <Tabs defaultValue="homepage" className="space-y-6">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="homepage" className="flex items-center gap-2">
                <Home size={16} />
                Home Page Layout
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User size={16} />
                Account
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="homepage">
            <HomePageLayoutSettings
              homeSettings={homeSettings}
              onSettingsChange={handleHomeSettingsChange}
            />
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <AccountInformationSettings
              accountData={accountData}
              accountLoading={accountLoading}
              onAccountDataChange={handleAccountDataChange}
              onSaveAccountData={handleSaveAccountData}
              onCancelAccountData={handleCancelAccountData}
            />
            <DangerZoneSection
              deleteLoading={deleteLoading}
              onDeleteAccount={handleDeleteAccount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AccountSettingsPage;
