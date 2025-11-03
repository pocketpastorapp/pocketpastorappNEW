
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User } from "lucide-react";
import { HomePageLayoutSettings } from "@/components/settings/HomePageLayoutSettings";
import { AccountInformationSettings } from "@/components/settings/AccountInformationSettings";
import { DangerZoneSection } from "@/components/settings/DangerZoneSection";
import { SecurityNotification } from "@/components/SecurityNotification";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import { useAccountDeletion } from "@/hooks/useAccountDeletion";

const AccountSettingsPage: React.FC = () => {
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
        <h1 className="text-2xl font-bold mb-6 text-center">Account Settings</h1>
        
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
            <SecurityNotification />
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
