
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-2 px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Go Back</span>
          </Button>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>

        <div className="prose max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Account Information</h3>
                <p>When you create an account, we collect your email address and name to provide our services.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Usage Data</h3>
                <p>We collect information about how you use Pocket Pastor, including chat messages, favorite verses, notes, and app interactions to improve our services.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Device Information</h3>
                <p>We may collect information about your device, including browser type, operating system, and IP address for security and analytics purposes.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our AI pastoral counseling services</li>
              <li>To personalize your experience and save your preferences</li>
              <li>To communicate with you about your account and our services</li>
              <li>To improve our app and develop new features</li>
              <li>To ensure the security and integrity of our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="mb-4">We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your explicit consent</li>
              <li>To trusted service providers who assist in operating our app (like Supabase for data storage)</li>
              <li>When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access, update, or delete your personal information</li>
              <li>Export your data</li>
              <li>Opt out of certain communications</li>
              <li>Request deletion of your account and all associated data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
            <p>We use essential cookies to maintain your session and preferences. We do not use tracking cookies for advertising purposes.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
            <p>Pocket Pastor is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through the app's support channels.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;
