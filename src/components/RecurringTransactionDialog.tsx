import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RecurringTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'edit' | 'delete';
  onThisInstance: () => void;
  onAllInstances: () => void;
}

export function RecurringTransactionDialog({
  open,
  onOpenChange,
  action,
  onThisInstance,
  onAllInstances,
}: RecurringTransactionDialogProps) {
  const actionText = action === 'edit' ? 'Edit' : 'Delete';
  const actionTextLower = action === 'edit' ? 'edit' : 'delete';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{actionText} Recurring Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            This is a recurring transaction. Would you like to {actionTextLower} only this instance or all future instances?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onThisInstance();
              onOpenChange(false);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            This Instance Only
          </AlertDialogAction>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onAllInstances();
              onOpenChange(false);
            }}
            className="bg-destructive hover:bg-destructive/90"
          >
            All Future Instances
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
