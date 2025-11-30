import type { ForwardRefExoticComponent, SVGProps } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-3">
          <Icon className="size-6 text-muted-foreground" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
      )}
      
      <div className="flex gap-3">
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
