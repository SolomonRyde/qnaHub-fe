import React from "react";
import { ChevronRight } from "lucide-react";

const ExamBreadcrumb = ({ industry, category, subcategory }) => {
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
      <span className="font-medium">{industry}</span>
      <ChevronRight className="w-3 h-3" />
      <span className="font-medium">{category}</span>
      <ChevronRight className="w-3 h-3" />
      <span className="font-medium">{subcategory}</span>
    </div>
  );
};

export default ExamBreadcrumb;
