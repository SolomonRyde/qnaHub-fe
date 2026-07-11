import React from "react";
import { X } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { StatusBadge } from "../../../../../components/ui/StatusBadge";
import { SummaryPill } from "../../../../../components/ui/SummaryPill";
import { formatDate, formatTime } from "../../../../../lib/utils";

export function ImportDetailsModal(props) {
  const {
    isImportDetailsOpen,
    setIsImportDetailsOpen,
    selectedImportDetails,
    setSelectedImportDetails,
    setStagingImportId,
    setActiveTab,
    loadStaging,
  } = props;

  if (!isImportDetailsOpen || !selectedImportDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="text-xl font-bold">
              Import Details #{selectedImportDetails.id}
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedImportDetails.file_name}
            </p>
          </div>
          <button
            onClick={() => {
              setIsImportDetailsOpen(false);
              setSelectedImportDetails(null);
            }}
            className="rounded-full p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-5">
            <SummaryPill
              label="Total"
              value={selectedImportDetails.total_rows}
              className="border-gray-200 bg-white"
            />
            <SummaryPill
              label="Valid"
              value={selectedImportDetails.valid_rows}
              className="border-green-200 bg-green-50 text-green-700"
            />
            <SummaryPill
              label="Missing"
              value={selectedImportDetails.missing_rows}
              className="border-yellow-200 bg-yellow-50 text-yellow-700"
            />
            <SummaryPill
              label="Error"
              value={selectedImportDetails.error_rows}
              className="border-red-200 bg-red-50 text-red-700"
            />
            <SummaryPill
              label="Duplicate"
              value={selectedImportDetails.duplicate_rows}
              className="border-orange-200 bg-orange-50 text-orange-700"
            />
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Uploaded By</p>
                <p className="font-semibold">
                  {selectedImportDetails.uploaded_by}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Stage</p>
                <StatusBadge
                  value={String(
                    selectedImportDetails.current_stage,
                  ).toLowerCase()}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-semibold">
                  {formatDate(selectedImportDetails.created_at)}{" "}
                  {formatTime(selectedImportDetails.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated At</p>
                <p className="font-semibold">
                  {formatDate(selectedImportDetails.updated_at)}{" "}
                  {formatTime(selectedImportDetails.updated_at)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsImportDetailsOpen(false);
                setSelectedImportDetails(null);
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                const id = selectedImportDetails.id;
                setIsImportDetailsOpen(false);
                setSelectedImportDetails(null);
                setStagingImportId(String(id));
                setActiveTab("staging");
                loadStaging({ import_id: id });
              }}
            >
              View Staging Questions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
