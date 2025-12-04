import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon as Search,
  XMarkIcon as X,
  CalendarIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import type { FilterOptions } from '@/types';
import { CATEGORIES } from '@/utils/categories';
import { useFinance } from '@/contexts/FinanceContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface AdvancedFilterOptions extends FilterOptions {
  minAmount?: number;
  maxAmount?: number;
  isRecurring?: boolean;
  accountIds?: string[];
}

interface AdvancedFilterBarProps {
  onFilterChange: (filters: AdvancedFilterOptions) => void;
  showAdvanced?: boolean;
}

export function AdvancedFilterBar({ onFilterChange, showAdvanced = true }: AdvancedFilterBarProps) {
  const { accounts } = useFinance();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  // Basic filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense' | ''>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Advanced filters
  const [minAmount, setMinAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(10000);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState<boolean | undefined>(undefined);
  
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Apply filters immediately for non-search changes
  useEffect(() => {
    applyFilters();
  }, [category, type, startDate, endDate, minAmount, maxAmount, selectedAccounts, isRecurring]);

  const applyFilters = () => {
    const filters: AdvancedFilterOptions = {};

    if (searchTerm.trim()) {
      filters.searchTerm = searchTerm.trim();
    }

    if (category) {
      filters.category = category;
    }

    if (type) {
      filters.type = type;
    }

    if (startDate) {
      filters.startDate = startDate.toISOString();
    }

    if (endDate) {
      filters.endDate = endDate.toISOString();
    }

    if (minAmount > 0) {
      filters.minAmount = minAmount;
    }

    if (maxAmount < 10000) {
      filters.maxAmount = maxAmount;
    }

    if (selectedAccounts.length > 0) {
      filters.accountIds = selectedAccounts;
    }

    if (isRecurring !== undefined) {
      filters.isRecurring = isRecurring;
    }

    onFilterChange(filters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setType('');
    setStartDate(undefined);
    setEndDate(undefined);
    setMinAmount(0);
    setMaxAmount(10000);
    setSelectedAccounts([]);
    setIsRecurring(undefined);
    onFilterChange({});
  };

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const hasActiveFilters =
    searchTerm ||
    category ||
    type ||
    startDate ||
    endDate ||
    minAmount > 0 ||
    maxAmount < 10000 ||
    selectedAccounts.length > 0 ||
    isRecurring !== undefined;

  const activeFilterCount = [
    searchTerm,
    category,
    type,
    startDate,
    endDate,
    minAmount > 0,
    maxAmount < 10000,
    selectedAccounts.length > 0,
    isRecurring !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="grid gap-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category || undefined} onValueChange={(value) => setCategory(value)}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <Select value={type || undefined} onValueChange={(value) => setType(value as 'income' | 'expense' | '')}>
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date Filter */}
        <div className="grid gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setStartCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      {showAdvanced && (
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                Advanced Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>

          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* End Date Filter */}
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setEndCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Amount Range */}
              <div className="grid gap-2 sm:col-span-2">
                <Label>Amount Range: ${minAmount} - ${maxAmount}</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(Number(e.target.value))}
                    className="w-24"
                    min={0}
                  />
                  <Slider
                    value={[minAmount, maxAmount]}
                    onValueChange={([min, max]) => {
                      setMinAmount(min);
                      setMaxAmount(max);
                    }}
                    min={0}
                    max={10000}
                    step={50}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(Number(e.target.value))}
                    className="w-24"
                    max={10000}
                  />
                </div>
              </div>
            </div>

            {/* Account Selection */}
            <div className="grid gap-2">
              <Label>Accounts</Label>
              <div className="flex flex-wrap gap-2">
                {accounts.map((account) => (
                  <Badge
                    key={account.id}
                    variant={selectedAccounts.includes(account.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleAccount(account.id)}
                  >
                    {account.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recurring Filter */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="recurring">Recurring Transactions Only</Label>
                <p className="text-sm text-muted-foreground">
                  Show only recurring transactions
                </p>
              </div>
              <Switch
                id="recurring"
                checked={isRecurring === true}
                onCheckedChange={(checked) => setIsRecurring(checked ? true : undefined)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Active Filters Summary */}
      {!isAdvancedOpen && hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <FunnelIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchTerm && <Badge variant="secondary">Search: {searchTerm}</Badge>}
          {category && <Badge variant="secondary">Category: {category}</Badge>}
          {type && <Badge variant="secondary">Type: {type}</Badge>}
          {startDate && <Badge variant="secondary">From: {format(startDate, 'PP')}</Badge>}
          {endDate && <Badge variant="secondary">To: {format(endDate, 'PP')}</Badge>}
          {minAmount > 0 && <Badge variant="secondary">Min: ${minAmount}</Badge>}
          {maxAmount < 10000 && <Badge variant="secondary">Max: ${maxAmount}</Badge>}
          {selectedAccounts.length > 0 && (
            <Badge variant="secondary">{selectedAccounts.length} account(s)</Badge>
          )}
          {isRecurring && <Badge variant="secondary">Recurring only</Badge>}
        </div>
      )}
    </div>
  );
}
