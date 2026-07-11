import React from "react";
import { Upload } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/utils";
import { useManageQuestions } from "../questions/hooks/useManageQuestions";
import { MainDbTab } from "../questions/components/tabs/MainDbTab";
import { StagingTab } from "../questions/components/tabs/StagingTab";
import { HistoryTab } from "../questions/components/tabs/HistoryTab";
import { PushPreviewModal } from "../questions/components/modals/PushPreviewModal";
import { CsvImportModal } from "../questions/components/modals/CsvImportModal";
import { ImportDetailsModal } from "../questions/components/modals/ImportDetailsModal";

export default function ManageQuestionsPage() {
  const methods = useManageQuestions();
  console.log("from main page: ", methods.filteredStagingQuestions);
  const { activeTab, setActiveTab, setIsImportModalOpen, setImportStep } =
    methods;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Questions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload, validate, stage, review, and manage all your questions.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-11 rounded-xl"
          onClick={() => {
            setIsImportModalOpen(true);
            setImportStep(1);
          }}
        >
          <Upload className="mr-2 h-4 w-4" /> Import CSV
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-background shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <div className="flex gap-6">
            {[
              ["main", "Main DB"],
              ["staging", "Staging"],
              ["history", "Import History"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "border-b-2 px-1 pb-3 text-sm font-semibold transition-colors",
                  activeTab === key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "main" && <MainDbTab {...methods} />}
          {activeTab === "staging" && <StagingTab {...methods} />}
          {activeTab === "history" && <HistoryTab {...methods} />}
        </div>
      </div>

      <CsvImportModal {...methods} />
      <PushPreviewModal {...methods} />
      <ImportDetailsModal {...methods} />
    </div>
  );
}
