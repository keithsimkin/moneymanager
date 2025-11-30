import { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import type { Goal, GoalProgress } from '../types';

/**
 * Custom hook for goal operations and progress calculations
 * 
 * Provides:
 * - Goal progress calculation
 * - Contribution functionality
 * - Status update logic (achieved, overdue)
 * - Time remaining calculation
 * 
 * Requirements: 8.2, 8.3, 8.4, 8.5
 */
export function useGoals() {
  const { goals, updateGoal } = useFinance();

  /**
   * Calculate progress for a specific goal
   * 
   * Requirements:
   * - 8.2: Update current amount and recalculate progress percentage
   * - 8.3: Display current amount, target amount, percentage complete, and time remaining
   */
  const getGoalProgress = useMemo(() => {
    return (goalId: string): GoalProgress | null => {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) {
        return null;
      }

      // Calculate percentage: (current / target) × 100
      const percentage = goal.targetAmount > 0 
        ? (goal.currentAmount / goal.targetAmount) * 100 
        : 0;

      // Calculate remaining amount
      const remaining = goal.targetAmount - goal.currentAmount;

      // Calculate days remaining until deadline
      const now = new Date();
      const deadlineDate = new Date(goal.deadline);
      const timeDiff = deadlineDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      return {
        goal,
        percentage,
        remaining,
        daysRemaining,
      };
    };
  }, [goals]);

  /**
   * Contribute to a goal
   * 
   * Requirement 8.2: When a user contributes to a goal, update the current amount 
   * and recalculate progress percentage
   */
  const contributeToGoal = useMemo(() => {
    return (goalId: string, amount: number): void => {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) {
        return;
      }

      const newCurrentAmount = goal.currentAmount + amount;
      
      // Update the goal with new current amount
      // Status will be updated by updateGoalStatuses
      updateGoal(goalId, {
        currentAmount: newCurrentAmount,
      });
    };
  }, [goals, updateGoal]);

  /**
   * Update goal statuses based on progress and deadlines
   * 
   * Requirements:
   * - 8.4: When a goal reaches 100% completion, mark it as achieved
   * - 8.5: When a goal deadline passes without completion, mark it as overdue
   */
  const updateGoalStatuses = useMemo(() => {
    return (): void => {
      for (const goal of goals) {
        const progress = getGoalProgress(goal.id);
        if (!progress) continue;

        let newStatus: Goal['status'] = goal.status;

        // Check if goal is achieved (100% or more)
        if (progress.percentage >= 100) {
          newStatus = 'achieved';
        } 
        // Check if goal is overdue (deadline passed and not achieved)
        else if (progress.daysRemaining < 0) {
          newStatus = 'overdue';
        } 
        // Otherwise, it's active
        else {
          newStatus = 'active';
        }

        // Update status if it changed
        if (newStatus !== goal.status) {
          updateGoal(goal.id, { status: newStatus });
        }
      }
    };
  }, [goals, getGoalProgress, updateGoal]);

  /**
   * Get all goal progress data
   */
  const getAllGoalProgress = useMemo(() => {
    return (): GoalProgress[] => {
      return goals
        .map((goal) => getGoalProgress(goal.id))
        .filter((progress): progress is GoalProgress => progress !== null);
    };
  }, [goals, getGoalProgress]);

  /**
   * Get active goals (not achieved or overdue)
   */
  const getActiveGoals = useMemo(() => {
    return (): Goal[] => {
      return goals.filter((goal) => goal.status === 'active');
    };
  }, [goals]);

  /**
   * Get achieved goals
   */
  const getAchievedGoals = useMemo(() => {
    return (): Goal[] => {
      return goals.filter((goal) => goal.status === 'achieved');
    };
  }, [goals]);

  /**
   * Get overdue goals
   */
  const getOverdueGoals = useMemo(() => {
    return (): Goal[] => {
      return goals.filter((goal) => goal.status === 'overdue');
    };
  }, [goals]);

  /**
   * Check if a goal exists
   */
  const goalExists = useMemo(() => {
    return (goalId: string): boolean => {
      return goals.some((goal) => goal.id === goalId);
    };
  }, [goals]);

  return {
    getGoalProgress,
    contributeToGoal,
    updateGoalStatuses,
    getAllGoalProgress,
    getActiveGoals,
    getAchievedGoals,
    getOverdueGoals,
    goalExists,
  };
}
