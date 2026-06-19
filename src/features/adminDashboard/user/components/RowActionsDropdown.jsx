import { useState } from "react";
import {
  canRestore,
  canSoftDelete,
  isDeleted,
} from "../../../../lib/userStatus";
import {
  ArchiveRestore,
  Edit2,
  Loader2,
  MoreHorizontal,
  Skull,
  Trash2,
} from "lucide-react";
import { cn } from "../../../../lib/utils";

export const RowActionsDropdown = ({
  user,
  onSoftDelete,
  onPurge,
  onRestore,
  onEdit, // ✅ NEW PROP
  isSoftDeleting,
  isPurging,
  isRestoring,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const userIsDeleted = isDeleted(user);
  const canDelete = canSoftDelete(user);
  const canRestoreThis = canRestore(user);

  console.log("USER FROM ROWACTIONS", user);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
        title="More actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-30 py-1">
            {/* ✅ EDIT BUTTON - Now calls onEdit */}
            {/* ✅ EDIT BUTTON - Disabled if user status is inactive (0) */}
            <button
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2",
                user.status === 0
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : "hover:bg-accent text-foreground",
              )}
              disabled={user.status === 0}
              title={
                user.status === 0
                  ? "Cannot edit inactive users"
                  : "Edit user role"
              }
              onClick={() => {
                // Prevent action if disabled
                if (user.status === 0) return;

                setIsOpen(false);
                onEdit?.(user);
              }}
            >
              <Edit2 className="h-4 w-4" />
              {user.status === 0 ? "Edit User (Inactive)" : "Edit User"}
            </button>

            {/* RESTORE BUTTON */}
            {canRestoreThis && (
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2 text-green-600 hover:bg-green-500/10"
                disabled={isRestoring}
                onClick={() => {
                  setIsOpen(false);
                  onRestore?.(user.id, user.name);
                }}
              >
                {isRestoring ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArchiveRestore className="h-4 w-4" />
                )}{" "}
                Restore
              </button>
            )}

            {/* Soft Delete */}
            {canDelete ? (
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2 text-orange-600 hover:bg-orange-500/10"
                disabled={isSoftDeleting}
                onClick={() => {
                  setIsOpen(false);
                  onSoftDelete(user.id, user.name);
                }}
              >
                {isSoftDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}{" "}
                Delete
              </button>
            ) : (
              !userIsDeleted && (
                <button
                  className="w-full text-left px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed flex items-center gap-2"
                  disabled
                  title="Only active users can be deleted"
                >
                  <Trash2 className="h-4 w-4" /> Inactive
                </button>
              )
            )}

            {/* Purge */}
            <button
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2",
                isPurging
                  ? "text-muted-foreground"
                  : "text-red-600 hover:bg-red-500/10 font-medium",
              )}
              disabled={isPurging}
              onClick={() => {
                setIsOpen(false);
                onPurge(user.id, user.name, userIsDeleted);
              }}
            >
              {isPurging ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Skull className="h-4 w-4" />
              )}{" "}
              {userIsDeleted ? "Purge from Trash" : "Permanently Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
