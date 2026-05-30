import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { cn } from "../../../../../lib/utils";

export function MobileFilterSheet({
  trigger,
  filters,
  onFilterChange,
  onClear,
  open,
  onOpenChange,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 top-[60%] z-50 bg-card rounded-t-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Filters</h2>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6 overflow-y-auto max-h-[60vh] pb-10">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <div className="space-y-2">
                {["draft", "published", "archived"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      checked={filters.status === status}
                      onChange={() =>
                        onFilterChange(
                          "status",
                          filters.status === status ? null : status,
                        )
                      }
                      className="w-4 h-4 text-primary border-border rounded"
                    />
                    <span className="text-sm capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Difficulty
              </label>
              <div className="space-y-2">
                {["easy", "intermediate", "hard"].map((diff) => (
                  <label
                    key={diff}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      checked={filters.difficulty === diff}
                      onChange={() =>
                        onFilterChange(
                          "difficulty",
                          filters.difficulty === diff ? null : diff,
                        )
                      }
                      className="w-4 h-4 text-primary border-border rounded"
                    />
                    <span className="text-sm capitalize">{diff}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-card border-t border-border flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClear}>
              Clear All
            </Button>
            <Dialog.Close asChild>
              <Button className="flex-1">Show Results</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
