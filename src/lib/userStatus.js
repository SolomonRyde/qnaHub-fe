// src/lib/userStatus.js

/**
 * 🔥 CORE: Get display status with priority
 * is_deleted=1 → "Deleted" (overrides everything)
 * else: status=1 → "Active", status=0 → "Inactive"
 */
export function getUserDisplayStatus(user) {
  if (!user) return "Unknown";
  if (user.is_deleted === 1) return "Deleted";
  if (user.status === 1 || user.status === "Active") return "Active";
  return "Inactive";
}

export function getStatusClasses(status) {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400";
    case "Inactive":
      return "bg-red-400 text-white border-border";
    case "Deleted":
      return "bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
}

export function getStatusIcon(status) {
  switch (status) {
    case "Active":
      return "🟢";
    case "Inactive":
      return "⚪";
    case "Deleted":
      return "🗑️";
    default:
      return "⚪";
  }
}

// 🔥 HELPER FUNCTIONS - STRICTLY BACKEND ALIGNED

export const isDeleted = (user) => user?.is_deleted === 1;

/**
 * ✅ FIX #1: Show Delete button ONLY for Active, non-deleted users
 * - Hides if is_deleted === 1
 * - Hides if status === 0 (already inactive)
 */
export const canSoftDelete = (user) => {
  return user?.is_deleted === 0 && user?.status === 1;
};

/**
 * ✅ FIX #2: Bulk Delete selection ONLY for Active, non-deleted users
 * - Inactive users are already status=0, so soft delete is redundant
 */
export const canSelectForBulkDelete = (user) => {
  return user?.is_deleted === 0 && user?.status === 1;
};

/**
 * Purge has NO restrictions - ANY user can be permanently deleted
 */
export const canSelectForBulkPurge = (user) => true;
export const canPurge = (user) => true;

/**
 * Normalize user for UI consistency
 */
export function normalizeUser(u) {
  if (!u) return null;
  return {
    ...u,
    id: u.id,
    name: u.name || "",
    email: u.email || "",
    role: (u.role || "USER").toUpperCase(),
    status: u.status, // Keep as-is (1=Active, 0=Inactive)
    is_deleted: u.is_deleted === 1 ? 1 : 0,
    displayStatus: getUserDisplayStatus(u),
    lastLogin: u.last_login ? formatDate(u.last_login) : "Never",
    avatarSeed: u.name || "U",
  };
}

function formatDate(date) {
  if (!date) return "Never";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// src/lib/userStatus.js - ADD THESE HELPERS AT THE END

/**
 * ✅ Can restore: ONLY for deleted users (is_deleted === 1)
 */
export const canRestore = (user) => {
  return user?.is_deleted === 1;
};

/**
 * ✅ Bulk restore selection: ONLY for deleted users
 */
export const canSelectForBulkRestore = (user) => {
  return user?.is_deleted === 1;
};

/**
 * Get appropriate action label based on user state
 */
export function getUserActionLabel(user) {
  if (isDeleted(user)) return "Restore";
  if (user?.status === 0) return "Activate";
  if (user?.status === 1) return "Deactivate";
  return "Manage";
}
