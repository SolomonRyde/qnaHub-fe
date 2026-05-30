import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  MoreVertical,
  Eye,
  Pencil,
  Archive,
  Trash2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "../../lib/utils";

export function ActionDropdown({
  exam,
  onPreview,
  onEdit,
  onStatusChange,
  onDelete,
  disabled = false,
  isLoading = false,
}) {
  const [open, setOpen] = useState(false);

  // ✅ Safe destructuring
  const { id, status = "draft", exam_title, slug } = exam || {};

  // ✅ Define options by their TARGET status (value)
  // This allows us to match the current status correctly
  const statusOptions = [
    {
      value: "published",
      label: "Publish",
      icon: CheckCircle2,
      className: "text-emerald-600",
    },
    {
      value: "archived",
      label: "Archive",
      icon: Archive,
      className: "text-amber-600",
    },
    {
      value: "draft",
      label: "Restore to Draft",
      icon: CheckCircle2,
      className: "text-blue-600",
    },
  ];

  const handleAction = async (action, value) => {
    setOpen(false);
    switch (action) {
      case "preview":
        onPreview?.(slug);
        break;
      case "edit":
        onEdit?.(exam);
        break;
      case "status":
        await onStatusChange?.(id, value);
        break;
      case "delete":
        onDelete?.(id);
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            disabled && "opacity-50 cursor-not-allowed",
            isLoading && "cursor-wait",
          )}
          disabled={disabled || isLoading}
          aria-label="Open exam actions"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[200px] bg-popover border border-border rounded-lg shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
          sideOffset={5}
          align="end"
        >
          {/* Preview */}
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none"
            onClick={() => handleAction("preview")}
          >
            <Eye className="w-4 h-4" />
            Preview
          </DropdownMenu.Item>

          {/* Edit */}
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none"
            onClick={() => handleAction("edit")}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          {/* ✅ FIXED: Status Change Submenu */}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer focus:bg-accent outline-none w-full">
              <CheckCircle2 className="w-4 h-4" />
              Change Status
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="z-50 min-w-[180px] bg-popover border border-border rounded-lg shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
                sideOffset={2}
                alignOffset={-4}
              >
                {/* ✅ Iterate all options */}
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  // ✅ Compare TARGET value with CURRENT status
                  const isCurrentStatus = option.value === status;

                  // ✅ Dynamic label: Show Status Name if current, else Action Name
                  const displayLabel = isCurrentStatus
                    ? status.charAt(0).toUpperCase() + status.slice(1)
                    : option.label;

                  return (
                    <DropdownMenu.Item
                      key={option.value}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md outline-none",
                        option.className,
                        // ✅ Style current status differently
                        isCurrentStatus
                          ? "opacity-50 cursor-default bg-transparent"
                          : "cursor-pointer focus:bg-accent focus:text-accent-foreground",
                      )}
                      onClick={() =>
                        !isCurrentStatus && handleAction("status", option.value)
                      }
                      disabled={isCurrentStatus}
                    >
                      <Icon className="w-4 h-4" />
                      {displayLabel}

                      {/* ✅ Show (current) label */}
                      {isCurrentStatus && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          (current)
                        </span>
                      )}
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          {/* Delete */}
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer focus:bg-destructive/10 focus:text-destructive outline-none text-destructive"
            onClick={() => handleAction("delete")}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
