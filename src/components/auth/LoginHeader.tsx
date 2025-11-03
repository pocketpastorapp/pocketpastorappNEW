
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginHeader = () => {
  return (
    <CardHeader className="space-y-1">
      <div className="flex justify-center mb-4">
        <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#184482" }}>
          <img src="/lovable-uploads/da3313b1-8f4a-4b1d-979d-2f574837ec3d.png" alt="Pocket Pastor Logo" className="h-8 w-8" />
        </div>
      </div>
      <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
      <CardDescription className="text-center">
        Sign in to your Pocket Pastor account
      </CardDescription>
    </CardHeader>
  );
};

export default LoginHeader;
