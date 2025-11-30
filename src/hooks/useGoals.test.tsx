import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { FinanceProvider, useFinance } from '../contexts/FinanceContext';
import { useGoals } from './useGoals';

// Test component that uses both contexts
function TestComponent() {
  const { addGoal, goals } = useFinance();
  const {
    getGoalProgress,
    contributeToGoal,
    updateGoalStatuses,
    getAllGoalProgress,
    getActiveGoals,
    getAchievedGoals,
    getOverdueGoals,
    goalExists,
  } = useGoals();

  return (
    <div>
      <div data-testid="goals-count">{goals.length}</div>
      <div data-testid="active-goals-count">{getActiveGoals().length}</div>
      <div data-testid="achieved-goals-count">{getAchievedGoals().length}</div>
      <div data-testid="overdue-goals-count">{getOverdueGoals().length}</div>
      
      <button
        onClick={() =>
          addGoal({
            name: 'Emergency Fund',
            targetAmount: 10000,
            currentAmount: 0,
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            status: 'active',
          })
        }
        data-testid="add-goal"
      >
        Add Goal
      </button>
      
      <button
        onClick={() =>
          addGoal({
            name: 'Vacation Fund',
            targetAmount: 5000,
            currentAmount: 4000,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            status: 'active',
          })
        }
        data-testid="add-near-complete-goal"
      >
        Add Near Complete Goal
      </button>
      
      <button
        onClick={() =>
          addGoal({
            name: 'Overdue Goal',
            targetAmount: 1000,
            currentAmount: 500,
            deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            status: 'active',
          })
        }
        data-testid="add-overdue-goal"
      >
        Add Overdue Goal
      </button>
      
      <button
        onClick={() => {
          if (goals.length > 0) {
            contributeToGoal(goals[0].id, 1000);
          }
        }}
        data-testid="contribute-to-first-goal"
      >
        Contribute to First Goal
      </button>
      
      <button
        onClick={() => {
          if (goals.length > 1) {
            contributeToGoal(goals[1].id, 1000);
          }
        }}
        data-testid="contribute-to-second-goal"
      >
        Contribute to Second Goal
      </button>
      
      <button
        onClick={() => updateGoalStatuses()}
        data-testid="update-statuses"
      >
        Update Statuses
      </button>
      
      {goals.length > 0 && (
        <>
          <div data-testid="first-goal-progress">
            {JSON.stringify(getGoalProgress(goals[0].id))}
          </div>
          <div data-testid="first-goal-exists">
            {goalExists(goals[0].id) ? 'true' : 'false'}
          </div>
        </>
      )}
      
      {goals.length > 1 && (
        <div data-testid="second-goal-progress">
          {JSON.stringify(getGoalProgress(goals[1].id))}
        </div>
      )}
      
      <div data-testid="all-goal-progress">
        {JSON.stringify(getAllGoalProgress())}
      </div>
    </div>
  );
}

describe('useGoals', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return active goals', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    // Add goal
    act(() => {
      getByTestId('add-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // Should have 1 active goal
    expect(screen.getByTestId('active-goals-count').textContent).toBe('1');
    expect(screen.getByTestId('achieved-goals-count').textContent).toBe('0');
    expect(screen.getByTestId('overdue-goals-count').textContent).toBe('0');
  });

  it('should calculate goal progress with no contributions', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    // Add goal
    act(() => {
      getByTestId('add-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // Get goal progress
    const progress = JSON.parse(
      screen.getByTestId('first-goal-progress').textContent || '{}'
    );

    expect(progress.goal.currentAmount).toBe(0);
    expect(progress.goal.targetAmount).toBe(10000);
    expect(progress.percentage).toBe(0);
    expect(progress.remaining).toBe(10000);
    expect(progress.daysRemaining).toBeGreaterThan(360); // Should be around 365 days
  });

  it('should calculate goal progress with partial contributions', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    // Add goal
    act(() => {
      getByTestId('add-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // Contribute to goal
    act(() => {
      getByTestId('contribute-to-first-goal').click();
    });

    await waitFor(() => {
      const progress = JSON.parse(
        screen.getByTestId('first-goal-progress').textContent || '{}'
      );
      expect(progress.goal.currentAmount).toBe(1000);
    });

    // Get goal progress
    const progress = JSON.parse(
      screen.getByTestId('first-goal-progress').textContent || '{}'
    );

    expect(progress.goal.currentAmount).toBe(1000);
    expect(progress.goal.targetAmount).toBe(10000);
    expect(progress.percentage).toBe(10);
    expect(progress.remaining).toBe(9000);
  });

  it('should update goal status to achieved when reaching 100%', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    // Add near complete goal (4000/5000 = 80%)
    act(() => {
      getByTestId('add-near-complete-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // Contribute to reach 100% (4000 + 1000 = 5000/5000)
    act(() => {
      getByTestId('contribute-to-first-goal').click();
    });

    await waitFor(() => {
      const progress = JSON.parse(
        screen.getByTestId('first-goal-progress').textContent || '{}'
      );
      expect(progress.goal.currentAmount).toBe(5000);
    });

    // Update statuses
    act(() => {
      getByTestId('update-statuses').click();
    });

    await waitFor(() => {
      const progress = JSON.parse(
        screen.getByTestId('first-goal-progress').textContent || '{}'
      );
      expect(progress.goal.status).toBe('achieved');
    });

    // Should have 0 active goals and 1 achieved goal
    expect(screen.getByTestId('active-goals-count').textContent).toBe('0');
    expect(screen.getByTestId('achieved-goals-count').textContent).toBe('1');
  });

  it('should update goal status to overdue when deadline passes', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    // Add overdue goal (deadline 10 days ago)
    act(() => {
      getByTestId('add-overdue-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // Check initial progress
    const initialProgress = JSON.parse(
      screen.getByTestId('first-goal-progress').textContent || '{}'
    );
    expect(initialProgress.daysRemaining).toBeLessThan(0);

    // Update statuses
    act(() => {
      getByTestId('update-statuses').click();
    });

    await waitFor(() => {
      const progress = JSON.parse(
        screen.getByTestId('first-goal-progress').textContent || '{}'
      );
      expect(progress.goal.status).toBe('overdue');
    });

    // Should have 0 active goals and 1 overdue goal
    expect(screen.getByTestId('active-goals-count').textContent).toBe('0');
    expect(screen.getByTestId('overdue-goals-count').textContent).toBe('1');
  });

  it('should calculate percentage correctly', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    // Add near complete goal (4000/5000 = 80%)
    act(() => {
      getByTestId('add-near-complete-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // Get goal progress
    const progress = JSON.parse(
      screen.getByTestId('first-goal-progress').textContent || '{}'
    );

    expect(progress.percentage).toBe(80);
    expect(progress.remaining).toBe(1000);
  });

  it('should handle multiple contributions', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    // Add goal
    act(() => {
      getByTestId('add-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // First contribution
    act(() => {
      getByTestId('contribute-to-first-goal').click();
    });

    await waitFor(() => {
      const progress = JSON.parse(
        screen.getByTestId('first-goal-progress').textContent || '{}'
      );
      expect(progress.goal.currentAmount).toBe(1000);
    });

    // Second contribution
    act(() => {
      getByTestId('contribute-to-first-goal').click();
    });

    await waitFor(() => {
      const progress = JSON.parse(
        screen.getByTestId('first-goal-progress').textContent || '{}'
      );
      expect(progress.goal.currentAmount).toBe(2000);
    });

    // Third contribution
    act(() => {
      getByTestId('contribute-to-first-goal').click();
    });

    await waitFor(() => {
      const progress = JSON.parse(
        screen.getByTestId('first-goal-progress').textContent || '{}'
      );
      expect(progress.goal.currentAmount).toBe(3000);
    });

    // Final progress check
    const progress = JSON.parse(
      screen.getByTestId('first-goal-progress').textContent || '{}'
    );

    expect(progress.goal.currentAmount).toBe(3000);
    expect(progress.percentage).toBe(30);
    expect(progress.remaining).toBe(7000);
  });

  it('should check if goal exists', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    // Add goal
    act(() => {
      getByTestId('add-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // Should exist
    expect(screen.getByTestId('first-goal-exists').textContent).toBe('true');
  });

  it('should return all goal progress', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    // Add first goal
    act(() => {
      getByTestId('add-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // Add second goal
    act(() => {
      getByTestId('add-near-complete-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('2');
    });

    const allProgress = JSON.parse(
      screen.getByTestId('all-goal-progress').textContent || '[]'
    );

    expect(allProgress).toHaveLength(2);
    expect(allProgress[0].percentage).toBe(0);
    expect(allProgress[1].percentage).toBe(80);
  });

  it('should handle contributions to different goals', async () => {
    const { getByTestId } = render(
      <FinanceProvider>
        <TestComponent />
      </FinanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('0');
    });

    // Add first goal
    act(() => {
      getByTestId('add-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('1');
    });

    // Add second goal
    act(() => {
      getByTestId('add-near-complete-goal').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('goals-count').textContent).toBe('2');
    });

    // Contribute to first goal
    act(() => {
      getByTestId('contribute-to-first-goal').click();
    });

    await waitFor(() => {
      const progress = JSON.parse(
        screen.getByTestId('first-goal-progress').textContent || '{}'
      );
      expect(progress.goal.currentAmount).toBe(1000);
    });

    // Contribute to second goal
    act(() => {
      getByTestId('contribute-to-second-goal').click();
    });

    await waitFor(() => {
      const progress = JSON.parse(
        screen.getByTestId('second-goal-progress').textContent || '{}'
      );
      expect(progress.goal.currentAmount).toBe(5000);
    });

    // Check both goals
    const firstProgress = JSON.parse(
      screen.getByTestId('first-goal-progress').textContent || '{}'
    );
    const secondProgress = JSON.parse(
      screen.getByTestId('second-goal-progress').textContent || '{}'
    );

    expect(firstProgress.goal.currentAmount).toBe(1000);
    expect(firstProgress.percentage).toBe(10);
    
    expect(secondProgress.goal.currentAmount).toBe(5000);
    expect(secondProgress.percentage).toBe(100);
  });
});
