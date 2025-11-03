
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmailService, EmailTemplate } from '@/services/emailService';
import { toast } from 'sonner';
import { Mail, Send } from 'lucide-react';

const EmailManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    template: '' as EmailTemplate,
    name: '',
    title: '',
    content: '',
    verse: '',
    reference: '',
    reflection: ''
  });

  const handleSendEmail = async () => {
    if (!formData.to || !formData.template) {
      toast.error('Please fill in email and template');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      
      switch (formData.template) {
        case 'welcome':
          result = await EmailService.sendWelcomeEmail(formData.to, formData.name);
          break;
        case 'devotional':
          result = await EmailService.sendDevotionalEmail(
            formData.to,
            formData.title,
            formData.content,
            formData.verse,
            formData.reference
          );
          break;
        case 'verse-of-day':
          result = await EmailService.sendVerseOfDayEmail(
            formData.to,
            formData.verse,
            formData.reference,
            formData.reflection
          );
          break;
        default:
          toast.error('Invalid template selected');
          return;
      }

      if (result.success) {
        toast.success('Email sent successfully!');
        // Reset form
        setFormData({
          to: '',
          template: '' as EmailTemplate,
          name: '',
          title: '',
          content: '',
          verse: '',
          reference: '',
          reflection: ''
        });
      } else {
        toast.error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-pastor-navy" />
          <CardTitle>Email Manager</CardTitle>
        </div>
        <CardDescription>
          Send custom Pocket Pastor emails to users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="to">Recipient Email</Label>
            <Input
              id="to"
              type="email"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              placeholder="user@example.com"
            />
          </div>
          <div>
            <Label htmlFor="template">Email Template</Label>
            <Select value={formData.template} onValueChange={(value: EmailTemplate) => setFormData({ ...formData, template: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">Welcome Email</SelectItem>
                <SelectItem value="devotional">Daily Devotional</SelectItem>
                <SelectItem value="verse-of-day">Verse of the Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.template === 'welcome' && (
          <div>
            <Label htmlFor="name">User Name (Optional)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
        )}

        {formData.template === 'devotional' && (
          <>
            <div>
              <Label htmlFor="title">Devotional Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Today's Spiritual Reflection"
              />
            </div>
            <div>
              <Label htmlFor="content">Devotional Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your devotional message here..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="verse">Bible Verse (Optional)</Label>
                <Textarea
                  id="verse"
                  value={formData.verse}
                  onChange={(e) => setFormData({ ...formData, verse: e.target.value })}
                  placeholder="For God so loved the world..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="reference">Verse Reference (Optional)</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="John 3:16"
                />
              </div>
            </div>
          </>
        )}

        {formData.template === 'verse-of-day' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="verse">Bible Verse *</Label>
                <Textarea
                  id="verse"
                  value={formData.verse}
                  onChange={(e) => setFormData({ ...formData, verse: e.target.value })}
                  placeholder="For I know the plans I have for you..."
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reference">Verse Reference *</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="Jeremiah 29:11"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reflection">Reflection (Optional)</Label>
              <Textarea
                id="reflection"
                value={formData.reflection}
                onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                placeholder="Add a reflection on today's verse..."
                rows={3}
              />
            </div>
          </>
        )}

        <Button 
          onClick={handleSendEmail} 
          disabled={isLoading}
          className="w-full"
          style={{ backgroundColor: "#184482" }}
        >
          <Send className="h-4 w-4 mr-2" />
          {isLoading ? 'Sending...' : 'Send Email'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailManager;
