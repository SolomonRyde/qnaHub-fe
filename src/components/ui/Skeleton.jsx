import React from "react";
import { cn } from "../../lib/utils";

/**
 * Skeleton component for loading states
 * Uses animated gradient pulse effect
 *
 * @param {Object} props
 * @param {string} props.className - Additional Tailwind classes
 * @param {number} props.width - Fixed width in pixels (optional)
 * @param {number} props.height - Fixed height in pixels (optional)
 * @param {string} props.variant - 'rect' | 'circle' | 'text' | 'rounded'
 */
export function Skeleton({
  className,
  width,
  height,
  variant = "rect",
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variant === "circle" && "rounded-full",
        variant === "text" && "rounded h-4 w-full max-w-[200px]",
        variant === "rounded" && "rounded-lg",
        variant === "rect" && "rounded",
        width && `w-[${width}px]`,
        height && `h-[${height}px]`,
        className,
      )}
      {...props}
    />
  );
}

/**
 * Skeleton.Text - Pre-styled for text lines
 */
Skeleton.Text = function SkeletonText({ className, lines = 1, ...props }) {
  return (
    <div className="space-y-2" {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            i === lines - 1 && "w-3/4", // Last line shorter for natural look
            className,
          )}
        />
      ))}
    </div>
  );
};

/**
 * Skeleton.Avatar - Pre-styled for avatar images
 */
Skeleton.Avatar = function SkeletonAvatar({
  className,
  size = "md",
  ...props
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <Skeleton
      variant="circle"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
};

/**
 * Skeleton.Card - Pre-styled for card loading states
 */
Skeleton.Card = function SkeletonCard({
  className,
  showImage = true,
  showTitle = true,
  showDescription = true,
  showFooter = true,
  ...props
}) {
  return (
    <div className={cn("space-y-4 p-4", className)} {...props}>
      {showImage && <Skeleton className="w-full h-40 rounded-lg" />}

      <div className="space-y-3">
        {showTitle && <Skeleton variant="text" className="w-3/4 h-5" />}
        {showDescription && <Skeleton.Text lines={2} />}
      </div>

      {showFooter && (
        <div className="flex items-center justify-between pt-2 border-t border-muted">
          <Skeleton className="w-16 h-6 rounded" />
          <Skeleton className="w-20 h-8 rounded" />
        </div>
      )}
    </div>
  );
};

/**
 * Skeleton.Table - Pre-styled for table loading states
 */
Skeleton.Table = function SkeletonTable({
  className,
  rows = 5,
  columns = 6,
  ...props
}) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b border-muted">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1 max-w-[120px]" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4 flex-1 max-w-[120px]"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
