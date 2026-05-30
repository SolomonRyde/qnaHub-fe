import React from "react";
import { Star } from "lucide-react";

const FeaturedBadge = () => {
  return (
    <div className="absolute top-2 left-2 z-10">
      <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-md text-xs font-semibold shadow-md">
        <Star className="w-3 h-3 fill-current" />
        {/* <span>Featured</span> */}
      </div>
    </div>
  );
};

export default FeaturedBadge;
