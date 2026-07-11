import React from "react";
import { Upload, RefreshCw, CheckCircle2, X, Search } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { Input } from "../../../../../components/ui/Input";
import { StatusBadge } from "../../../../../components/ui/StatusBadge";
import { SummaryPill } from "../../../../../components/ui/SummaryPill";
import { cn } from "../../../../../lib/utils";

export function CsvImportModal(props) {
  const {
    isImportModalOpen,
    setIsImportModalOpen,
    importStep,
    setImportStep,
    selectedCsvFile,
    setSelectedCsvFile,
    csvPreviewSummary,
    csvPreviewSearch,
    setCsvPreviewSearch,
    csvPreviewStatus,
    setCsvPreviewStatus,
    filteredCsvPreviewRows,
    isCsvUploading,
    handleCsvFile,
    confirmCsvImportToStaging,
  } = props;

  if (!isImportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-6">
          <h2 className="text-2xl font-bold">Bulk Import Questions (CSV)</h2>
          <button
            onClick={() => {
              setIsImportModalOpen(false);
              setImportStep(1);
              setSelectedCsvFile(null);
            }}
            className="rounded-full p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-8 grid grid-cols-4 items-center gap-3">
            {[
              [1, "Upload"],
              [2, "Processing"],
              [3, "Preview"],
              [4, "Done"],
            ].map(([step, label], index) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full font-bold",
                    importStep >= step
                      ? "bg-green-600 text-white"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {importStep > step ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={cn(
                    "font-semibold",
                    importStep === step
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
                {index < 3 && <div className="h-px flex-1 bg-border" />}
              </div>
            ))}
          </div>

          {importStep === 1 && (
            <div>
              <h3 className="text-2xl font-bold">Upload CSV File</h3>
              <label className="mt-8 flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-green-50/30 p-8 text-center hover:bg-green-50">
                <div className="rounded-full bg-green-100 p-6 text-green-700">
                  <Upload className="h-10 w-10" />
                </div>
                <h4 className="mt-5 text-xl font-bold">
                  Drag & drop your CSV file here
                </h4>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCsvFile}
                />
              </label>
            </div>
          )}

          {importStep === 2 && (
            <div className="py-20 text-center">
              <RefreshCw className="mx-auto h-12 w-12 animate-spin text-green-600" />
              <h3 className="mt-4 text-xl font-bold">Processing CSV...</h3>
            </div>
          )}

          {importStep === 3 && (
            <div>
              <h3 className="text-2xl font-bold">Preview Import Data</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <SummaryPill
                  label="Total"
                  value={csvPreviewSummary.total}
                  className="border-border bg-white"
                />
                <SummaryPill
                  label="Valid"
                  value={csvPreviewSummary.valid}
                  className="border-green-200 bg-green-50 text-green-700"
                />
                <SummaryPill
                  label="Invalid"
                  value={csvPreviewSummary.invalid}
                  className="border-red-200 bg-red-50 text-red-700"
                />
                <SummaryPill
                  label="Duplicates"
                  value={csvPreviewSummary.duplicate}
                  className="border-yellow-200 bg-yellow-50 text-yellow-700"
                />
              </div>
              <div className="mt-6 max-h-[420px] overflow-auto rounded-xl border border-border">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Question</th>
                      <th className="px-4 py-3 text-left">Answer</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCsvPreviewRows.map((row) => (
                      <tr key={row.row_no} className="border-t border-border">
                        <td className="px-4 py-3">{row.row_no}</td>
                        <td className="max-w-[400px] px-4 py-3 font-medium">
                          {row.question || "-"}
                        </td>
                        <td className="px-4 py-3 font-bold">
                          {row.correct_answer || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge value={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImportStep(1);
                    setSelectedCsvFile(null);
                  }}
                >
                  Choose Another
                </Button>
                <Button
                  onClick={confirmCsvImportToStaging}
                  disabled={isCsvUploading || csvPreviewSummary.valid === 0}
                >
                  {isCsvUploading ? "Importing..." : "Import Valid Rows"}
                </Button>
              </div>
            </div>
          )}

          {importStep === 4 && (
            <div className="py-20 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
              <h3 className="mt-4 text-2xl font-bold">Import Completed</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
