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
import { cn } from "../../../lib/utils";
import { useDashboardStats } from "../user/hooks/useDashboardStats";
import { useUsers } from "../user/hooks/useUsers";
import { useDeleteUser } from "../user/hooks/useDeleteUser";
import { usePurgeUser } from "../user/hooks/usePurgeUser";
import { useRestoreUser } from "../user/hooks/useRestoreUser";
import { useUpdateUserRole } from "../user/hooks/useUpdateUserRole"; // ✅ NEW IMPORT
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
import { PaginationControls } from "../user/components/PaginationControls";
import { RoleBadge } from "../user/components/RoleBadge";
import { StatCard } from "../../../components/ui/StatCard";
import { StatusBadge } from "../user/components/StatusBadge";

import { useAuth } from "../../../context/AuthContext";
import { useUserById } from "../user/hooks/useUserById";

import { EditUserModal } from "../user/modals/EditUserModal";
import { SoftDeleteModal } from "../user/modals/SoftDeleteModal";
import { PurgeModal } from "../user/modals/PurgeModal";
import { RestoreModal } from "../user/modals/RestoreModal";
import { RowActionsDropdown } from "../user/components/RowActionsDropdown";

// --- Subcomponents ---

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
        {/* <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-card border-border hover:bg-accent text-foreground rounded-full px-6"
          >
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={statsLoading ? "..." : stats.total_users?.toLocaleString()}
          icon={Users}
          iconColor="primary"
          badge={{
            text: "All Accounts",
            variant: "success",
          }}
          trend="+12% this month"
        />

        <StatCard
          title="Active Users"
          value={statsLoading ? "..." : stats.active_users?.toLocaleString()}
          icon={CheckCircle}
          iconColor="success"
          badge={{
            text: "Healthy",
            variant: "success",
          }}
          trend="Currently active"
        />

        <StatCard
          title="Inactive Users"
          value={statsLoading ? "..." : stats.inactive_users?.toLocaleString()}
          icon={Ban}
          iconColor="danger"
          badge={{
            text: "Needs Attention",
            variant: "warning",
          }}
          trend="No recent activity"
        />

        <StatCard
          title="New Signups"
          value={statsLoading ? "..." : stats.new_signups_7d?.toLocaleString()}
          icon={UserPlus}
          iconColor="success"
          badge={{
            text: "Growing",
            variant: "success",
          }}
          trend="Last 7 days"
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
                        <StatusBadge role={user.role} />
                        {/* <RoleBadge role={user.role} /> */}
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
