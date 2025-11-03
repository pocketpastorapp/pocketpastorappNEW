
import { Button } from "@/components/ui/button";

interface PasswordResetSectionProps {
  showPasswordReset: boolean;
  resetEmailSent: boolean;
  isResettingPassword: boolean;
  failedAttempts: number;
  onPasswordReset: () => void;
}

const PasswordResetSection = ({
  showPasswordReset,
  resetEmailSent,
  isResettingPassword,
  failedAttempts,
  onPasswordReset
}: PasswordResetSectionProps) => {
  return (
    <>
      {/* Password Reset Success Message */}
      {resetEmailSent && (
        <div className="mt-6 p-4 border rounded-lg bg-green-50 dark:bg-green-900/10">
          <div className="text-sm text-green-800 dark:text-green-200">
            <strong>Password reset email sent!</strong> Please check your inbox and spam folder if you don't see it within a few minutes.
          </div>
        </div>
      )}

      {/* Password Reset Section */}
      {showPasswordReset && !resetEmailSent && (
        <div className="mt-6 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
          <div className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
            <strong>Too many failed login attempts.</strong> Would you like to reset your password?
          </div>
          <Button
            onClick={onPasswordReset}
            disabled={isResettingPassword}
            variant="outline"
            className="w-full"
          >
            {isResettingPassword ? 'Sending reset email...' : 'Reset Password'}
          </Button>
        </div>
      )}

      {/* Failed attempts indicator */}
      {failedAttempts > 0 && failedAttempts < 5 && !resetEmailSent && (
        <div className="text-sm text-red-600 dark:text-red-400 text-center">
          Failed attempts: {failedAttempts}/5
        </div>
      )}
    </>
  );
};

export default PasswordResetSection;
