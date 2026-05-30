import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { cn } from "../../../../../lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  totalItems = 0,
  showPageSizeSelector = true,
  pageSizes = [10, 20, 50, 100],
}) {
  // Generate page numbers to display (with ellipsis for large ranges)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first, last, and current with ellipsis
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageSizeChange = (e) => {
    onPageChange(1, parseInt(e.target.value)); // Reset to page 1 when changing page size
  };

  const showingFrom = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const showingTo = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
      {/* Info */}
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">{showingFrom}</span>
        {" - "}
        <span className="font-medium text-foreground">{showingTo}</span>
        {" of "}
        <span className="font-medium text-foreground">{totalItems}</span>
        {showPageSizeSelector && (
          <>
            {" • "}
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="ml-1 px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}/page
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1">
        {/* First */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1, pageSize)}
          disabled={currentPage === 1}
          className={cn(
            "h-8 w-8 disabled:cursor-not-allowed disabled:opacity-50",
          )}
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Previous */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1, pageSize)}
          disabled={currentPage === 1}
          className={cn(
            "h-8 w-8 disabled:cursor-not-allowed disabled:opacity-50",
          )}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page, pageSize)}
                className={cn(
                  "h-8 w-8 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
                  currentPage === page &&
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {page}
              </Button>
            ),
          )}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1, pageSize)}
          disabled={currentPage === totalPages}
          className={cn(
            "h-8 w-8 disabled:cursor-not-allowed disabled:opacity-50",
          )}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages, pageSize)}
          disabled={currentPage === totalPages}
          className={cn(
            "h-8 w-8 disabled:cursor-not-allowed disabled:opacity-50",
          )}
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
