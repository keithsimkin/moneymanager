import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Copy, Activity } from 'lucide-react';
import type { Anomaly } from '@/hooks/useAdvancedAnalytics';
import { format } from 'date-fns';

interface AnomalyDetectionCardProps {
  data: Anomaly[];
}

export function AnomalyDetectionCard({ data }: AnomalyDetectionCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'spike': return <AlertTriangle className="h-4 w-4" />;
      case 'duplicate': return <Copy className="h-4 w-4" />;
      case 'suspicious': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'high') return <Badge variant="destructive">High</Badge>;
    if (severity === 'medium') return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          Anomaly Detection
        </CardTitle>
        <CardDescription>Unusual transactions flagged by AI</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((anomaly) => (
              <div 
                key={anomaly.id} 
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getIcon(anomaly.type)}
                    <span className="font-medium capitalize">{anomaly.type}</span>
                  </div>
                  {getSeverityBadge(anomaly.severity)}
                </div>
                
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{anomaly.transaction.description}</p>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>{anomaly.transaction.category}</span>
                    <span className="font-bold text-foreground">
                      {formatCurrency(anomaly.transaction.amount)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(anomaly.transaction.date), 'MMM dd, yyyy')}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                  {anomaly.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium">No anomalies detected</p>
            <p className="text-sm mt-1">All transactions look normal</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
