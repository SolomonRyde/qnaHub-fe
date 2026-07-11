import React from "react";
import { X } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { SummaryPill } from "../../../../../components/ui/SummaryPill";

export function PushPreviewModal(props) {
  const {
    isPushPreviewModalOpen,
    setIsPushPreviewModalOpen,
    pushPreviewSummary,
    isPushing,
    confirmPushToMainDb,
  } = props;

  if (!isPushPreviewModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h3 className="text-xl font-bold">Push to Main DB - Preview</h3>
          <button
            onClick={() => setIsPushPreviewModalOpen(false)}
            className="rounded-full p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
            <SummaryPill
              label="Total Staging"
              value={pushPreviewSummary.overallCount}
              className="border-border bg-white"
            />
            <SummaryPill
              label="Ready"
              value={pushPreviewSummary.readyToPush}
              className="border-blue-200 bg-blue-50 text-blue-700"
            />
            <SummaryPill
              label="In Main DB"
              value={pushPreviewSummary.alreadyInMainDb}
              className="border-yellow-200 bg-yellow-50 text-yellow-700"
            />
            <SummaryPill
              label="Final Distinct"
              value={pushPreviewSummary.distinctCount}
              className="border-green-200 bg-green-50 text-green-700"
            />
            <SummaryPill
              label="Errors"
              value={pushPreviewSummary.errorCount}
              className="border-red-200 bg-red-50 text-red-700"
            />
          </div>
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            You are about to push{" "}
            <strong>{pushPreviewSummary.distinctCount}</strong> distinct
            questions to Main DB.
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPushPreviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPushToMainDb}
              disabled={isPushing || pushPreviewSummary.distinctCount === 0}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isPushing ? "Pushing..." : "Confirm & Push"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
