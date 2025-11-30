import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClockIcon as Clock } from '@heroicons/react/24/outline';
import type { SpendingHeatmap } from '@/hooks/useAdvancedAnalytics';

interface SpendingHeatmapCardProps {
  data: SpendingHeatmap;
}

export function SpendingHeatmapCard({ data }: SpendingHeatmapCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const maxDayValue = Math.max(...Object.values(data.dayOfWeek));
  const maxTimeValue = Math.max(...Object.values(data.timeOfDay));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Spending Heatmap
        </CardTitle>
        <CardDescription>When you spend the most</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-3">By Day of Week</p>
          <div className="space-y-2">
            {Object.entries(data.dayOfWeek).map(([day, amount]) => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-sm w-24">{day}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${maxDayValue > 0 ? (amount / maxDayValue) * 100 : 0}%` }}
                  >
                    {amount > 0 && (
                      <span className="text-xs font-medium text-white">
                        {formatCurrency(amount)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Peak spending: <span className="font-medium">{data.peakSpendingDay}</span>
          </p>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">By Time of Day</p>
          <div className="space-y-2">
            {Object.entries(data.timeOfDay).map(([time, amount]) => (
              <div key={time} className="flex items-center gap-3">
                <span className="text-sm w-24">{time}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-teal-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${maxTimeValue > 0 ? (amount / maxTimeValue) * 100 : 0}%` }}
                  >
                    {amount > 0 && (
                      <span className="text-xs font-medium text-white">
                        {formatCurrency(amount)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Peak spending: <span className="font-medium">{data.peakSpendingTime}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
