
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfServicePage = () => {
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
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>

        <div className="prose max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using Pocket Pastor, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>Pocket Pastor is an AI-powered spiritual guidance and Bible study application. Our service provides:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>AI-powered spiritual conversations and guidance</li>
              <li>Bible reading and study tools</li>
              <li>Personal note-taking and verse saving features</li>
              <li>Audio playback of conversations and verses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Important Disclaimer</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="font-semibold text-yellow-800 mb-2">⚠️ AI Guidance Limitation</p>
              <p className="text-yellow-700">
                Pocket Pastor provides AI-generated spiritual guidance for educational and inspirational purposes only. 
                It is not a replacement for professional counseling, therapy, or pastoral care from qualified human ministers. 
                For serious spiritual, emotional, or mental health concerns, please consult with qualified professionals.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Account and Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must be at least 13 years old to use this service</li>
              <li>You agree to use the service in accordance with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Share inappropriate, offensive, or harmful content</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use the service to spread misinformation or hate speech</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Credits and Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pocket Pastor operates on a credit-based system for AI conversations</li>
              <li>All purchases are final and non-refundable unless required by law</li>
              <li>Credit balances do not expire but are tied to your account</li>
              <li>We reserve the right to modify pricing with reasonable notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p>The Pocket Pastor application, including its design, code, and content, is protected by copyright and other intellectual property laws. You retain ownership of your personal content (messages, notes, etc.).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Privacy</h2>
            <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Service Availability</h2>
            <p>We strive to maintain high service availability but do not guarantee uninterrupted access. We may temporarily suspend service for maintenance or updates.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p>Pocket Pastor is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p>We may terminate or suspend your account for violations of these terms. You may delete your account at any time through the account settings.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us through the app's support channels.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfServicePage;
