import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { RecurringTransactionDialog } from './RecurringTransactionDialog';

describe('RecurringTransactionDialog', () => {
  it('should render edit dialog with correct text', () => {
    const onOpenChange = vi.fn();
    const onThisInstance = vi.fn();
    const onAllInstances = vi.fn();

    render(
      <RecurringTransactionDialog
        open={true}
        onOpenChange={onOpenChange}
        action="edit"
        onThisInstance={onThisInstance}
        onAllInstances={onAllInstances}
      />
    );

    expect(screen.getByText('Edit Recurring Transaction')).toBeInTheDocument();
    expect(screen.getByText(/edit only this instance or all future instances/i)).toBeInTheDocument();
    expect(screen.getByText('This Instance Only')).toBeInTheDocument();
    expect(screen.getByText('All Future Instances')).toBeInTheDocument();
  });

  it('should render delete dialog with correct text', () => {
    const onOpenChange = vi.fn();
    const onThisInstance = vi.fn();
    const onAllInstances = vi.fn();

    render(
      <RecurringTransactionDialog
        open={true}
        onOpenChange={onOpenChange}
        action="delete"
        onThisInstance={onThisInstance}
        onAllInstances={onAllInstances}
      />
    );

    expect(screen.getByText('Delete Recurring Transaction')).toBeInTheDocument();
    expect(screen.getByText(/delete only this instance or all future instances/i)).toBeInTheDocument();
  });

  it('should call onThisInstance when "This Instance Only" is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onThisInstance = vi.fn();
    const onAllInstances = vi.fn();

    render(
      <RecurringTransactionDialog
        open={true}
        onOpenChange={onOpenChange}
        action="edit"
        onThisInstance={onThisInstance}
        onAllInstances={onAllInstances}
      />
    );

    const thisInstanceButton = screen.getByText('This Instance Only');
    await user.click(thisInstanceButton);

    expect(onThisInstance).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should call onAllInstances when "All Future Instances" is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onThisInstance = vi.fn();
    const onAllInstances = vi.fn();

    render(
      <RecurringTransactionDialog
        open={true}
        onOpenChange={onOpenChange}
        action="delete"
        onThisInstance={onThisInstance}
        onAllInstances={onAllInstances}
      />
    );

    const allInstancesButton = screen.getByText('All Future Instances');
    await user.click(allInstancesButton);

    expect(onAllInstances).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should call onOpenChange when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onThisInstance = vi.fn();
    const onAllInstances = vi.fn();

    render(
      <RecurringTransactionDialog
        open={true}
        onOpenChange={onOpenChange}
        action="edit"
        onThisInstance={onThisInstance}
        onAllInstances={onAllInstances}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalled();
    expect(onThisInstance).not.toHaveBeenCalled();
    expect(onAllInstances).not.toHaveBeenCalled();
  });
});
