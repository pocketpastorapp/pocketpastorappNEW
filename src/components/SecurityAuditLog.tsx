import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';

interface SecurityAuditEvent {
  id: string;
  event_type: string;
  event_details: any;
  created_at: string;
  ip_address?: unknown;
  user_agent?: unknown;
  user_id?: string;
}

export const SecurityAuditLog = () => {
  const [events, setEvents] = useState<SecurityAuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching security events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching security events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    if (eventType.includes('suspicious') || eventType.includes('failure')) {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    if (eventType.includes('security') || eventType.includes('audit')) {
      return <Shield className="h-4 w-4 text-primary" />;
    }
    return <Info className="h-4 w-4 text-muted-foreground" />;
  };

  const getEventBadgeVariant = (eventType: string) => {
    if (eventType.includes('suspicious') || eventType.includes('failure')) {
      return 'destructive';
    }
    if (eventType.includes('success') || eventType.includes('created')) {
      return 'default';
    }
    return 'secondary';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading security events...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No security events found
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  {getEventIcon(event.event_type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getEventBadgeVariant(event.event_type) as any}>
                        {event.event_type.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(event.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    {event.event_details && Object.keys(event.event_details).length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {JSON.stringify(event.event_details)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};