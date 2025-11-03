
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DangerZoneSectionProps {
  deleteLoading: boolean;
  onDeleteAccount: () => void;
}

export const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({
  deleteLoading,
  onDeleteAccount
}) => {
  return (
    <div className="pt-6 border-t">
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Danger Zone
        </h3>
        <p className="text-red-700 dark:text-red-300 mb-4">
          Once you delete your account, there is no going back. This will permanently delete:
        </p>
        <ul className="text-red-700 dark:text-red-300 mb-4 list-disc list-inside space-y-1">
          <li>All your chat conversations and history</li>
          <li>Your favorite verses and bookmarks</li>
          <li>Personal notes and highlights</li>
          <li>Account preferences and settings</li>
          <li>Credits and subscription data</li>
        </ul>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 size={16} />
              Delete My Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers. You will receive a confirmation
                email after deletion.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteAccount}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteLoading ? "Deleting..." : "Proceed with Account Deletion"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
