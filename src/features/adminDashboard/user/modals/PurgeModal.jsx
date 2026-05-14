import { Loader2, Skull } from "lucide-react";
import { Button } from "../../../../components/ui/Button";

export const PurgeModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  count = 1,
  isPending,
  isAlreadyDeleted = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border-2 border-red-500/50 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-red-500/20 text-red-600 animate-pulse">
            <Skull className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-600">
              {count === 1
                ? "PERMANENTLY Delete?"
                : `PERMANENTLY Delete ${count}?`}
            </h3>
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                ⚠️ This action is PERMANENT and cannot be undone.
              </p>
              {isAlreadyDeleted && (
                <p className="text-xs text-muted-foreground mt-1">
                  {count === 1
                    ? `${userName} is already in Trash.`
                    : `These users are already in Trash.`}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {count === 1
                  ? `${userName} will be completely removed.`
                  : `${count} users will be completely removed.`}
              </p>
            </div>
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
            className="min-w-[120px] bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Skull className="h-4 w-4 mr-2" />{" "}
                {count === 1 ? "Permanently Delete" : `Delete ${count}`}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
