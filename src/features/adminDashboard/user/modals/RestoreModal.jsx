import { ArchiveRestore, Loader2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";

export const RestoreModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  count = 1,
  isPending,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-green-500/10 text-green-600">
            <ArchiveRestore className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {count === 1 ? "Restore User?" : `Restore ${count} Users?`}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {count === 1
                ? `Are you sure you want to restore ${userName}? `
                : `Are you sure you want to restore ${count} selected users? `}
              They will regain access to the system.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="min-w-[100px] bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Restoring...
              </>
            ) : count === 1 ? (
              "Restore"
            ) : (
              `Restore ${count}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
