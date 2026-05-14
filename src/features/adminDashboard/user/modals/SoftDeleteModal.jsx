import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";

export const SoftDeleteModal = ({
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
          <div className="p-2 rounded-full bg-orange-500/10 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {count === 1 ? "Delete User?" : `Delete ${count} Users?`}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {count === 1
                ? `Are you sure you want to delete ${userName}? `
                : `Are you sure you want to delete ${count} selected users? `}
              This is a soft delete. Users can be restored from Trash.
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
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="min-w-[100px]"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
              </>
            ) : count === 1 ? (
              "Delete"
            ) : (
              `Delete ${count}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
