
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

interface UserAccountData {
  name: string;
  email: string;
  password: string;
  gender: string;
}

interface AccountInformationSettingsProps {
  accountData: UserAccountData;
  accountLoading: boolean;
  onAccountDataChange: (field: keyof UserAccountData, value: string) => void;
  onSaveAccountData: () => void;
  onCancelAccountData: () => void;
}

export const AccountInformationSettings: React.FC<AccountInformationSettingsProps> = ({
  accountData,
  accountLoading,
  onAccountDataChange,
  onSaveAccountData,
  onCancelAccountData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Update your personal information and account settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={accountData.name}
              onChange={(e) => onAccountDataChange('name', e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={accountData.email}
              onChange={(e) => onAccountDataChange('email', e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select 
              value={accountData.gender} 
              onValueChange={(value) => onAccountDataChange('gender', value)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={accountData.password}
              onChange={(e) => onAccountDataChange('password', e.target.value)}
              placeholder="Enter new password (leave blank to keep current)"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button 
              onClick={onSaveAccountData}
              disabled={accountLoading}
              className="flex items-center gap-2"
              style={{ backgroundColor: "#184482" }}
            >
              <Save size={16} />
              {accountLoading ? "Saving..." : "Save"}
            </Button>
            
            <Button 
              onClick={onCancelAccountData}
              disabled={accountLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
