import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Shield, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
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
          <h1 className="text-3xl font-bold">About Pocket Pastor</h1>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg leading-relaxed">
              Pocket Pastor is designed to make spiritual guidance and Bible study accessible to everyone, anywhere, at any time. 
              We believe that technology can be a powerful tool for spiritual growth when used with wisdom and discernment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">AI Spiritual Guidance</h3>
                  <p className="text-muted-foreground">
                    Thoughtful, biblically-grounded conversations powered by advanced AI technology.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Bible Study Tools</h3>
                  <p className="text-muted-foreground">
                    Multiple Bible versions, verse highlighting, bookmarking, and personal note-taking.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Privacy Focused</h3>
                  <p className="text-muted-foreground">
                    Your spiritual conversations and personal notes are kept private and secure.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Always Available</h3>
                  <p className="text-muted-foreground">
                    Access spiritual guidance 24/7, whether you're at home, traveling, or in need of quick encouragement.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Important Note</h2>
            <p className="leading-relaxed">
              While Pocket Pastor provides thoughtful spiritual guidance, it is not a replacement for human pastoral care, 
              professional counseling, or medical advice. We encourage users to maintain connections with their local faith 
              communities and seek professional help when needed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="leading-relaxed">
              We are committed to providing a respectful, safe, and spiritually enriching environment for all users, 
              regardless of their denominational background or level of faith. Our goal is to support your spiritual 
              journey with wisdom, compassion, and biblical truth.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="leading-relaxed mb-4">
              Ready to begin your spiritual journey with Pocket Pastor? Start by creating an account and exploring 
              our features. Whether you're looking for daily encouragement, Bible study assistance, or answers to 
              life's big questions, we're here to help.
            </p>
            <Button 
              onClick={() => navigate('/chat')} 
              className="mt-4"
              style={{ backgroundColor: "#184482" }}
            >
              Start Your Spiritual Journey
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
