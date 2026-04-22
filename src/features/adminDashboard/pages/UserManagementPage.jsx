import React, { useState, useMemo } from "react";
import {
  Users,
  CheckCircle,
  Ban,
  UserPlus,
  Plus,
  Download,
  Search as SearchIcon,
  ChevronDown,
  Layers,
  X,
  Trash2,
  Edit2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Skull,
  ArchiveRestore,
  Trash,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { cn } from "../../../lib/utils";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { usePurgeUser } from "../hooks/usePurgeUser";
import { useRestoreUser } from "../hooks/useRestoreUser";
import { useUpdateUserRole } from "../hooks/useUpdateUserRole"; // ✅ NEW IMPORT
import {
  getUserDisplayStatus,
  getStatusClasses,
  getStatusIcon,
  isDeleted,
  canSoftDelete,
  canSelectForBulkDelete,
  canSelectForBulkPurge,
  canRestore,
  canSelectForBulkRestore,
} from "../../../lib/userStatus";
import {
  PaginationControls,
  RoleBadge,
  StatsCard,
  StatusBadge,
} from "../components/StatsCard";
import { useAuth } from "../../../context/AuthContext";
import { useUserById } from "../hooks/useUserById";

// --- Subcomponents ---

// ✅ NEW: Edit User Modal Component with useUserById
const EditUserModal = ({ isOpen, onClose, user, onSave, isPending }) => {
  // ✅ Fetch fresh data from API
  const {
    user: freshUser,
    isLoading: isLoadingUser,
    isError,
  } = useUserById(user?.id);

  // ✅ Use fresh data if available, fallback to prop
  const currentUser = freshUser || user;

  // ✅ Local state for editable role
  const [role, setRole] = useState("");

  // ✅ Sync local state when fresh user data loads
  React.useEffect(() => {
    if (currentUser?.role) {
      setRole(currentUser.role);
    }
  }, [currentUser]);

  // ✅ Show loading state
  if (!isOpen || !user) return null;

  if (isLoadingUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-card border border-border rounded-xl p-8 max-w-lg w-full shadow-xl flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (isError || !currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-card border border-red-500/50 rounded-xl p-6 max-w-lg w-full shadow-xl">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Error Loading User</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Could not fetch user details. Please try again.
          </p>
          <div className="flex justify-end mt-6">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (role !== currentUser.role) {
      onSave(currentUser.id, role);
    } else {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-xl p-6 max-w-lg w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Edit User Role
          </h3>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* ID */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-muted-foreground">
              ID
            </label>
            <div className="col-span-2">
              <Input value={currentUser.id} disabled className="bg-muted/50" />
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <div className="col-span-2">
              <Input
                value={currentUser.name || ""}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <div className="col-span-2">
              <Input
                value={currentUser.email || ""}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-muted-foreground">
              Phone
            </label>
            <div className="col-span-2">
              <Input
                value={currentUser.phone_number || ""}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>

          {/* Role - EDITABLE */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-muted-foreground">
              Role
            </label>
            <div className="col-span-2">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isPending}
                className="h-10 px-3 rounded-lg border border-border bg-muted/50 text-sm w-full focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="user">User</option>
              </select>
              {/* Show indicator if role changed */}
              {role !== currentUser.role && (
                <p className="text-xs text-primary mt-1">
                  ● Role changed from {currentUser.role}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <div className="col-span-2">
              <Input
                value={currentUser.status === 1 ? "Active" : "Inactive"}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>

          {/* Last Login */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-muted-foreground">
              Last Login
            </label>
            <div className="col-span-2">
              <Input
                value={formatDate(currentUser.last_login)}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>

          {/* Created At */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-sm font-medium text-muted-foreground">
              Created At
            </label>
            <div className="col-span-2">
              <Input
                value={formatDate(currentUser.created_at)}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || role === currentUser.role}
            className="min-w-[100px]"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SoftDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  count = 1,
  isPending,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-orange-500/10 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {count === 1 ? "Delete User?" : `Delete ${count} Users?`}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {count === 1
                ? `Are you sure you want to delete ${userName}? `
                : `Are you sure you want to delete ${count} selected users? `}
              This is a soft delete. Users can be restored from Trash.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="min-w-[100px]"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
              </>
            ) : count === 1 ? (
              "Delete"
            ) : (
              `Delete ${count}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const PurgeModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  count = 1,
  isPending,
  isAlreadyDeleted = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border-2 border-red-500/50 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-red-500/20 text-red-600 animate-pulse">
            <Skull className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-600">
              {count === 1
                ? "PERMANENTLY Delete?"
                : `PERMANENTLY Delete ${count}?`}
            </h3>
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                ⚠️ This action is PERMANENT and cannot be undone.
              </p>
              {isAlreadyDeleted && (
                <p className="text-xs text-muted-foreground mt-1">
                  {count === 1
                    ? `${userName} is already in Trash.`
                    : `These users are already in Trash.`}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {count === 1
                  ? `${userName} will be completely removed.`
                  : `${count} users will be completely removed.`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="min-w-[120px] bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Skull className="h-4 w-4 mr-2" />{" "}
                {count === 1 ? "Permanently Delete" : `Delete ${count}`}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const RestoreModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  count = 1,
  isPending,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-green-500/10 text-green-600">
            <ArchiveRestore className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {count === 1 ? "Restore User?" : `Restore ${count} Users?`}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {count === 1
                ? `Are you sure you want to restore ${userName}? `
                : `Are you sure you want to restore ${count} selected users? `}
              They will regain access to the system.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="min-w-[100px] bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Restoring...
              </>
            ) : count === 1 ? (
              "Restore"
            ) : (
              `Restore ${count}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Row Actions Dropdown - UPDATED WITH onEdit PROP
const RowActionsDropdown = ({
  user,
  onSoftDelete,
  onPurge,
  onRestore,
  onEdit, // ✅ NEW PROP
  isSoftDeleting,
  isPurging,
  isRestoring,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const userIsDeleted = isDeleted(user);
  const canDelete = canSoftDelete(user);
  const canRestoreThis = canRestore(user);

  console.log("USER FROM ROWACTIONS", user);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
        title="More actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-30 py-1">
            {/* ✅ EDIT BUTTON - Now calls onEdit */}
            {/* ✅ EDIT BUTTON - Disabled if user status is inactive (0) */}
            <button
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2",
                user.status === 0
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : "hover:bg-accent text-foreground",
              )}
              disabled={user.status === 0}
              title={
                user.status === 0
                  ? "Cannot edit inactive users"
                  : "Edit user role"
              }
              onClick={() => {
                // Prevent action if disabled
                if (user.status === 0) return;

                setIsOpen(false);
                onEdit?.(user);
              }}
            >
              <Edit2 className="h-4 w-4" />
              {user.status === 0 ? "Edit User (Inactive)" : "Edit User"}
            </button>

            {/* RESTORE BUTTON */}
            {canRestoreThis && (
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2 text-green-600 hover:bg-green-500/10"
                disabled={isRestoring}
                onClick={() => {
                  setIsOpen(false);
                  onRestore?.(user.id, user.name);
                }}
              >
                {isRestoring ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArchiveRestore className="h-4 w-4" />
                )}{" "}
                Restore
              </button>
            )}

            {/* Soft Delete */}
            {canDelete ? (
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2 text-orange-600 hover:bg-orange-500/10"
                disabled={isSoftDeleting}
                onClick={() => {
                  setIsOpen(false);
                  onSoftDelete(user.id, user.name);
                }}
              >
                {isSoftDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}{" "}
                Delete
              </button>
            ) : (
              !userIsDeleted && (
                <button
                  className="w-full text-left px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed flex items-center gap-2"
                  disabled
                  title="Only active users can be deleted"
                >
                  <Trash2 className="h-4 w-4" /> Inactive
                </button>
              )
            )}

            {/* Purge */}
            <button
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2",
                isPurging
                  ? "text-muted-foreground"
                  : "text-red-600 hover:bg-red-500/10 font-medium",
              )}
              disabled={isPurging}
              onClick={() => {
                setIsOpen(false);
                onPurge(user.id, user.name, userIsDeleted);
              }}
            >
              {isPurging ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Skull className="h-4 w-4" />
              )}{" "}
              {userIsDeleted ? "Purge from Trash" : "Permanently Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// --- Main Component ---
export default function UserManagementPage() {
  const { stats, isLoading: statsLoading } = useDashboardStats();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const testUser = useAuth();
  console.log("Test User", testUser);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, role, statusFilter]);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const {
    users,
    deletedUsers,
    total,
    totalPages,
    isLoading: isLoadingUsers,
    isFetching,
  } = useUsers({
    page: currentPage,
    search: debouncedSearch,
    role,
    status: statusFilter,
  });
  console.log("Role from useUsers", role);

  // ✅ Initialize mutations
  const softDeleteMutation = useDeleteUser();
  const purgeMutation = usePurgeUser();
  const restoreMutation = useRestoreUser();
  const updateRoleMutation = useUpdateUserRole(); // ✅ NEW: Edit role hook

  // ✅ NEW: Edit modal state
  const [editModal, setEditModal] = useState({
    open: false,
    user: null,
  });

  const [softDeleteModal, setSoftDeleteModal] = useState({
    open: false,
    userIds: [],
    userName: "",
    count: 0,
  });
  const [purgeModal, setPurgeModal] = useState({
    open: false,
    userIds: [],
    userName: "",
    count: 0,
    isAlreadyDeleted: false,
  });
  const [restoreModal, setRestoreModal] = useState({
    open: false,
    userIds: [],
    userName: "",
    count: 0,
  });

  const [bulkActionMode, setBulkActionMode] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showTrash, setShowTrash] = useState(false);

  React.useEffect(() => {
    setSelectedUsers([]);
  }, [currentPage, search, role, statusFilter, bulkActionMode, showTrash]);

  React.useEffect(() => {
    if (bulkActionMode && selectedUsers.length > 0) {
      const eligibleUsers =
        bulkActionMode === "delete"
          ? selectedUsers.filter((id) => {
              const user = users.find((u) => u.id === id);
              return user && canSelectForBulkDelete(user);
            })
          : bulkActionMode === "restore"
            ? selectedUsers.filter((id) => {
                const user = users.find((u) => u.id === id);
                return user && canSelectForBulkRestore(user);
              })
            : selectedUsers;

      if (eligibleUsers.length === 0) {
        setBulkActionMode(null);
        setSelectedUsers([]);
      } else if (eligibleUsers.length !== selectedUsers.length) {
        setSelectedUsers(eligibleUsers);
      }
    }
  }, [users, bulkActionMode, selectedUsers]);

  const toggleSelectUser = (id) =>
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );

  const toggleSelectAll = () => {
    const list = showTrash ? deletedUsers : users;
    const eligibleIds =
      bulkActionMode === "purge"
        ? list.filter(canSelectForBulkPurge).map((u) => u.id)
        : bulkActionMode === "delete"
          ? list.filter(canSelectForBulkDelete).map((u) => u.id)
          : bulkActionMode === "restore"
            ? list.filter(canSelectForBulkRestore).map((u) => u.id)
            : [];

    setSelectedUsers((prev) => {
      const allSelected =
        eligibleIds.length > 0 && eligibleIds.every((id) => prev.includes(id));
      return allSelected
        ? prev.filter((id) => !eligibleIds.includes(id))
        : [...new Set([...prev, ...eligibleIds])];
    });
  };

  // ✅ Handlers for single actions
  const handleRestore = (userId, userName) => {
    setRestoreModal({
      open: true,
      userIds: [userId],
      userName: userName,
      count: 1,
    });
  };

  const handleSoftDelete = (id, name) =>
    setSoftDeleteModal({
      open: true,
      userIds: [id],
      userName: name,
      count: 1,
    });

  const handlePurge = (id, name, isAlreadyDeleted) =>
    setPurgeModal({
      open: true,
      userIds: [id],
      userName: name,
      count: 1,
      isAlreadyDeleted,
    });

  // ✅ NEW: Edit handlers
  const handleEditUser = (user) => {
    setEditModal({ open: true, user });
  };

  const handleUpdateRole = (id, role) => {
    updateRoleMutation.updateRole({ id, role });
    setEditModal({ open: false, user: null });
  };

  const handleBulkAction = () => {
    if (selectedUsers.length === 0) return;

    if (bulkActionMode === "purge") {
      setPurgeModal({
        open: true,
        userIds: selectedUsers,
        userName: "",
        count: selectedUsers.length,
        isAlreadyDeleted: false,
      });
    } else if (bulkActionMode === "delete") {
      setSoftDeleteModal({
        open: true,
        userIds: selectedUsers,
        userName: "",
        count: selectedUsers.length,
      });
    } else if (bulkActionMode === "restore") {
      setRestoreModal({
        open: true,
        userIds: selectedUsers,
        userName: "",
        count: selectedUsers.length,
      });
    }
  };

  const confirmSoftDelete = () => {
    if (softDeleteModal.userIds.length > 0) {
      softDeleteMutation.mutate(softDeleteModal.userIds);
    }
    setSoftDeleteModal({
      open: false,
      userIds: [],
      userName: "",
      count: 0,
    });
  };

  const confirmPurge = () => {
    if (purgeModal.userIds.length > 0) {
      purgeMutation.mutate(purgeModal.userIds);
    }
    setPurgeModal({
      open: false,
      userIds: [],
      userName: "",
      count: 0,
      isAlreadyDeleted: false,
    });
    if (bulkActionMode) {
      setBulkActionMode(null);
      setSelectedUsers([]);
    }
  };

  const confirmRestore = () => {
    if (restoreModal.userIds.length > 0) {
      restoreMutation.restore(restoreModal.userIds);
    }
    setRestoreModal({
      open: false,
      userIds: [],
      userName: "",
      count: 0,
    });
    if (bulkActionMode === "restore") {
      setBulkActionMode(null);
      setSelectedUsers([]);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setRole("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const currentList = showTrash ? deletedUsers : users;
  const startItem =
    currentList.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, currentList.length);

  const hasActiveFilters = search || role !== "all" || statusFilter !== "all";

  const isBulkMode = bulkActionMode !== null;
  const bulkModeLabel =
    bulkActionMode === "purge"
      ? "Purge"
      : bulkActionMode === "delete"
        ? "Delete"
        : bulkActionMode === "restore"
          ? "Restore"
          : "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {showTrash ? "🗑️ Trash" : "User Management"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {showTrash
              ? "Manage deleted users: restore or permanently delete."
              : "Control and organize your digital curating team."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-card border-border hover:bg-accent text-foreground rounded-full px-6"
          >
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={statsLoading ? "..." : stats.total_users?.toLocaleString()}
          icon={Users}
          iconColor="primary"
        />
        <StatsCard
          title="Active"
          value={statsLoading ? "..." : stats.active_users?.toLocaleString()}
          icon={CheckCircle}
          iconColor="success"
        />
        <StatsCard
          title="Inactive"
          value={statsLoading ? "..." : stats.inactive_users?.toLocaleString()}
          icon={Ban}
          iconColor="danger"
        />
        <StatsCard
          title="New Signups last 7 days"
          value={statsLoading ? "..." : stats.new_signups_7d?.toLocaleString()}
          icon={UserPlus}
          iconColor="success"
        />
      </div>

      {/* Trash View */}
      {showTrash ? (
        <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-card">
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
                <Trash className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Deleted Users
                </h3>
                <p className="text-sm text-muted-foreground">
                  {deletedUsers.length} user(s) can be restored or permanently
                  deleted.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTrash(false)}
            >
              <X className="h-4 w-4 mr-1" /> Close
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {deletedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No deleted users found.
                    </td>
                  </tr>
                ) : (
                  deletedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/30 transition-colors opacity-80"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-sm font-semibold text-red-600">
                            {user.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2) || "??"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate line-through">
                              {user.name}
                            </p>
                            <p className="text-muted-foreground text-xs truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge user={user} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-2 text-green-600 hover:bg-green-500/10 rounded-full transition-colors"
                            title="Restore user"
                            onClick={() => handleRestore(user.id, user.name)}
                            disabled={restoreMutation.isLoading}
                          >
                            {restoreMutation.isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ArchiveRestore className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-500/10 rounded-full transition-colors"
                            title="Permanently delete"
                            onClick={() =>
                              handlePurge(user.id, user.name, true)
                            }
                            disabled={purgeMutation.isPending}
                          >
                            {purgeMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Skull className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Main Users Table */
        <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-card">
          {/* Filters & Bulk Actions */}
          <div className="p-4 border-b border-border bg-card flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:flex-none sm:w-64">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 w-full bg-muted/50 border-border focus-visible:ring-primary"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Role Filter */}
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-border bg-muted/50 text-sm"
                >
                  <option value="all">Role: All</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="user">User</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-border bg-muted/50 text-sm"
                >
                  <option value="all">Status: All</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" /> Reset
                  </Button>
                )}

                {isBulkMode ? (
                  // 🔸 BULK MODE ACTIVE
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg border-2",
                      bulkActionMode === "purge"
                        ? "bg-red-500/10 dark:bg-red-500/20 border-red-500/30"
                        : bulkActionMode === "restore"
                          ? "bg-green-500/10 dark:bg-green-500/20 border-green-500/30"
                          : "bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/30",
                    )}
                  >
                    {bulkActionMode === "purge" ? (
                      <Skull className="h-4 w-4 text-red-600" />
                    ) : bulkActionMode === "restore" ? (
                      <ArchiveRestore className="h-4 w-4 text-green-600" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-orange-600" />
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        bulkActionMode === "purge"
                          ? "text-red-700 dark:text-red-400"
                          : bulkActionMode === "restore"
                            ? "text-green-700 dark:text-green-400"
                            : "text-orange-700 dark:text-orange-400",
                      )}
                    >
                      {bulkModeLabel} Mode • {selectedUsers.length} selected
                    </span>
                    <Button
                      onClick={handleBulkAction}
                      variant={
                        bulkActionMode === "purge"
                          ? "destructive"
                          : bulkActionMode === "restore"
                            ? "default"
                            : "default"
                      }
                      size="sm"
                      className={cn(
                        "h-7 text-xs px-2",
                        bulkActionMode === "purge"
                          ? "bg-red-600 hover:bg-red-700"
                          : bulkActionMode === "restore"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-orange-600 hover:bg-orange-700",
                      )}
                      disabled={
                        selectedUsers.length === 0 ||
                        (bulkActionMode === "purge"
                          ? purgeMutation.isPending
                          : bulkActionMode === "restore"
                            ? restoreMutation.isLoading
                            : softDeleteMutation.isPending)
                      }
                    >
                      {bulkActionMode === "purge" && purgeMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : bulkActionMode === "restore" &&
                        restoreMutation.isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : bulkActionMode === "delete" &&
                        softDeleteMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : bulkActionMode === "purge" ? (
                        `Permanently Delete ${
                          selectedUsers.length > 0
                            ? `(${selectedUsers.length})`
                            : ""
                        }`
                      ) : bulkActionMode === "restore" ? (
                        `Restore ${
                          selectedUsers.length > 0
                            ? `(${selectedUsers.length})`
                            : ""
                        }`
                      ) : (
                        `Delete ${
                          selectedUsers.length > 0
                            ? `(${selectedUsers.length})`
                            : ""
                        }`
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setBulkActionMode(null);
                        setSelectedUsers([]);
                      }}
                      className={cn(
                        "h-7 w-7 p-0",
                        bulkActionMode === "purge"
                          ? "text-red-600 hover:bg-red-100"
                          : bulkActionMode === "restore"
                            ? "text-green-600 hover:bg-green-100"
                            : "text-orange-600 hover:bg-orange-100",
                      )}
                      disabled={
                        bulkActionMode === "purge"
                          ? purgeMutation.isPending
                          : bulkActionMode === "restore"
                            ? restoreMutation.isLoading
                            : softDeleteMutation.isPending
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  // 🔸 NORMAL MODE
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-primary/10 text-primary hover:bg-primary/20 border-0 h-9 px-3"
                      disabled={
                        users.filter(canSelectForBulkDelete).length === 0
                      }
                      title="Select active users to soft delete"
                      onClick={() => {
                        setBulkActionMode("delete");
                        setSelectedUsers([]);
                        console.log("SELECTED USERS", selectedUsers);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" /> Bulk Delete
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-9 px-3",
                        deletedUsers.length > 0
                          ? "border-green-200 text-green-600 hover:bg-green-500/10"
                          : "border-gray-200 text-gray-400 cursor-not-allowed",
                      )}
                      disabled={deletedUsers.length === 0}
                      title={
                        deletedUsers.length > 0
                          ? "Select deleted users to restore"
                          : "No deleted users to restore"
                      }
                      onClick={() => {
                        if (deletedUsers.length > 0) {
                          setBulkActionMode("restore");
                          setSelectedUsers([]);
                        }
                      }}
                    >
                      <ArchiveRestore className="h-4 w-4 mr-1.5" /> Bulk Restore
                      {deletedUsers.length > 0 && (
                        <span className="ml-1 text-xs">
                          ({deletedUsers.length})
                        </span>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-500/10 h-9 px-3"
                      onClick={() => {
                        setBulkActionMode("purge");
                        setSelectedUsers([]);
                      }}
                    >
                      <Skull className="h-4 w-4 mr-1.5" /> Bulk Purge
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  {isBulkMode && (
                    <th className="w-12 py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={
                          currentList.length > 0 &&
                          currentList.every((u) => selectedUsers.includes(u.id))
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4 accent-primary"
                        disabled={
                          purgeMutation.isPending ||
                          softDeleteMutation.isPending ||
                          restoreMutation.isLoading
                        }
                      />
                    </th>
                  )}
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {isLoadingUsers ? (
                  [...Array(5)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      {isBulkMode && (
                        <td className="py-4 px-6">
                          <div className="h-4 w-4 bg-muted rounded mx-auto" />
                        </td>
                      )}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-muted rounded" />
                            <div className="h-3 w-24 bg-muted rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-5 w-16 bg-muted rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-5 w-20 bg-muted rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 w-24 bg-muted rounded" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-8 bg-muted rounded-full" />
                          <div className="h-8 w-8 bg-muted rounded-full" />
                          <div className="h-8 w-8 bg-muted rounded-full" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : currentList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isBulkMode ? 7 : 6}
                      className="py-16 text-center"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-muted/50">
                          <Users className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-foreground">
                          {hasActiveFilters
                            ? "No matching users found"
                            : "No users found"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {hasActiveFilters
                            ? "Try adjusting your filters"
                            : "Get started by adding a new user"}
                        </p>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetFilters}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" /> Reset
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentList.map((user) => {
                    const isSoftDeleting =
                      softDeleteMutation.isPending &&
                      softDeleteModal.userIds.includes(user.id);
                    const isPurging =
                      purgeMutation.isPending &&
                      purgeModal.userIds.includes(user.id);
                    const isRestoring =
                      restoreMutation.isLoading &&
                      restoreModal.userIds.includes(user.id);
                    const userIsDeleted = isDeleted(user);
                    const canDeleteThis = canSoftDelete(user);

                    return (
                      <tr
                        key={user.id}
                        className={cn(
                          "hover:bg-muted/30 transition-colors",
                          userIsDeleted && "opacity-60",
                          (isSoftDeleting || isPurging || isRestoring) &&
                            "animate-pulse",
                        )}
                      >
                        {isBulkMode && (
                          <td className="py-4 px-6 text-center">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleSelectUser(user.id)}
                              className="rounded border-border text-primary focus:ring-primary h-4 w-4 accent-primary"
                              disabled={
                                (bulkActionMode === "delete" &&
                                  !canDeleteThis) ||
                                (bulkActionMode === "restore" &&
                                  !canRestore(user)) ||
                                purgeMutation.isPending ||
                                softDeleteMutation.isPending ||
                                restoreMutation.isLoading
                              }
                              title={
                                bulkActionMode === "purge"
                                  ? "Any user can be purged"
                                  : bulkActionMode === "restore"
                                    ? "Only deleted users can be restored"
                                    : !canDeleteThis
                                      ? "Only active users can be soft deleted"
                                      : ""
                              }
                            />
                          </td>
                        )}

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0",
                                userIsDeleted
                                  ? "bg-red-500/10 text-red-600"
                                  : "bg-primary/10 text-primary",
                              )}
                            >
                              {user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2) || "??"}
                            </div>
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  "font-semibold text-sm truncate",
                                  userIsDeleted &&
                                    "line-through text-muted-foreground",
                                )}
                              >
                                {user.name}
                              </p>
                              <p className="text-muted-foreground text-xs truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <RoleBadge role={user.role} />
                        </td>

                        <td className="py-4 px-6">
                          <StatusBadge user={user} />
                        </td>

                        <td className="py-4 px-6 text-sm text-muted-foreground whitespace-nowrap">
                          {user.lastLogin}
                        </td>

                        <td className="py-4 px-6 text-right">
                          {/* ✅ UPDATED: Pass onEdit prop */}
                          <RowActionsDropdown
                            user={user}
                            onEdit={handleEditUser} // ✅ NEW PROP
                            onSoftDelete={handleSoftDelete}
                            onPurge={handlePurge}
                            onRestore={handleRestore}
                            isSoftDeleting={isSoftDeleting}
                            isPurging={isPurging}
                            isRestoring={isRestoring}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">{startItem}</span>{" "}
              to <span className="font-medium text-foreground">{endItem}</span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {currentList.length?.toLocaleString()}
              </span>{" "}
              results
            </p>
            <div className="flex items-center gap-4">
              {isFetching && !isLoadingUsers && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" /> Updating...
                </span>
              )}
              <PaginationControls
                currentPage={currentPage}
                totalPages={Math.ceil(currentList.length / ITEMS_PER_PAGE) || 1}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Modals */}
      <SoftDeleteModal
        isOpen={softDeleteModal.open}
        onClose={() =>
          setSoftDeleteModal({
            open: false,
            userIds: [],
            userName: "",
            count: 0,
          })
        }
        onConfirm={confirmSoftDelete}
        userName={softDeleteModal.userName}
        count={softDeleteModal.count}
        isPending={softDeleteMutation.isPending}
      />
      <PurgeModal
        isOpen={purgeModal.open}
        onClose={() =>
          setPurgeModal({
            open: false,
            userIds: [],
            userName: "",
            count: 0,
            isAlreadyDeleted: false,
          })
        }
        onConfirm={confirmPurge}
        userName={purgeModal.userName}
        count={purgeModal.count}
        isPending={purgeMutation.isPending}
        isAlreadyDeleted={purgeModal.isAlreadyDeleted}
      />
      <RestoreModal
        isOpen={restoreModal.open}
        onClose={() =>
          setRestoreModal({
            open: false,
            userIds: [],
            userName: "",
            count: 0,
          })
        }
        onConfirm={confirmRestore}
        userName={restoreModal.userName}
        count={restoreModal.count}
        isPending={restoreMutation.isLoading}
      />

      {/* ✅ NEW: Edit User Modal */}
      <EditUserModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        user={editModal.user}
        onSave={handleUpdateRole}
        isPending={updateRoleMutation.isPending}
      />
    </div>
  );
}
