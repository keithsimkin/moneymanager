import { useState, useRef } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, FileJson, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ExportImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportImportDialog({ open, onOpenChange }: ExportImportDialogProps) {
  const { exportData, exportTransactionsCSV, importData } = useFinance();
  const [importStrategy, setImportStrategy] = useState<'merge' | 'replace'>('merge');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setImportError('Failed to export data. Please try again.');
    }
  };

  const handleExportCSV = () => {
    try {
      const csvData = exportTransactionsCSV();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setImportError('Failed to export transactions. Please try again.');
    }
  };

  const handleImportClick = () => {
    setImportError(null);
    setImportSuccess(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    try {
      const text = await file.text();
      importData(text, importStrategy);
      setImportSuccess(true);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      if (error instanceof Error) {
        setImportError(error.message);
      } else {
        setImportError('Failed to import data. Please check the file format and try again.');
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDialogChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setImportError(null);
      setImportSuccess(false);
      setImportStrategy('merge');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export & Import Data</DialogTitle>
          <DialogDescription>
            Backup your financial data or import from a previous export.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Export Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Export Data</h3>
            <div className="grid gap-2">
              <Button
                onClick={handleExportJSON}
                variant="outline"
                className="w-full justify-start"
              >
                <FileJson className="mr-2 h-4 w-4" />
                Export to JSON
                <Download className="ml-auto h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground px-1">
                Export all data (accounts, transactions, budgets, goals) as JSON
              </p>
            </div>

            <div className="grid gap-2">
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="w-full justify-start"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export Transactions to CSV
                <Download className="ml-auto h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground px-1">
                Export transactions only in spreadsheet format
              </p>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Import Data</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="import-strategy">Import Strategy</Label>
              <Select
                value={importStrategy}
                onValueChange={(value) => setImportStrategy(value as 'merge' | 'replace')}
              >
                <SelectTrigger id="import-strategy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merge">Merge with existing data</SelectItem>
                  <SelectItem value="replace">Replace all data</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {importStrategy === 'merge'
                  ? 'Add imported items to existing data (keeps both)'
                  : 'Replace all existing data with imported data'}
              </p>
            </div>

            <Button
              onClick={handleImportClick}
              variant="outline"
              className="w-full justify-start"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import from JSON
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Import file"
            />
          </div>

          {/* Success Message */}
          {importSuccess && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Data imported successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {importError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
