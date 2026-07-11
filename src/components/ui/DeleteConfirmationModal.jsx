import React from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  variant = "red",
  isDeleting = false,
}) {
  if (!isOpen) return null;

  const variantClasses = {
    red: {
      button: "bg-red-600 hover:bg-red-700 text-white",
      icon: "bg-red-100 text-red-600",
    },
    orange: {
      button: "bg-orange-600 hover:bg-orange-700 text-white",
      icon: "bg-orange-100 text-orange-600",
    },
  };

  const classes = variantClasses[variant] || variantClasses.red;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-5">
          <div className="flex items-center gap-3">
            <div className={cn("rounded-full p-2", classes.icon)}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            disabled={isDeleting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border p-5">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className={classes.button}
          >
            {isDeleting ? (
              <>
                <Trash2 className="mr-2 h-4 w-4 animate-pulse" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {confirmText}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
