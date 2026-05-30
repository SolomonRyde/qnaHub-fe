import React from "react";
import { Link } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";

export function EmptyState({ search, onClearFilters }) {
  return (
    <div className="text-center py-16 bg-card border border-border rounded-xl">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No exams found
      </h3>
      <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
        {search || onClearFilters
          ? "Try adjusting your search or filters"
          : "Get started by creating your first exam"}
      </p>
      {search || onClearFilters ? (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button size="sm" asChild>
          <Link to="#">Create Your First Exam</Link>
        </Button>
      )}
    </div>
  );
}
