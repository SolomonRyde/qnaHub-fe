import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";

const MobileFilterDrawer = ({
  trigger,
  onFilterChange,
  initialFilters = {},
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 top-[60%] z-50 bg-card rounded-t-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 md:hidden border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Filters</h2>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto max-h-[60vh] pb-10">
            <Sidebar
              className="border-none"
              onFilterChange={onFilterChange}
              initialFilters={initialFilters}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-card border-t border-border">
            <Dialog.Close asChild>
              <button className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
                Show Results
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MobileFilterDrawer;
