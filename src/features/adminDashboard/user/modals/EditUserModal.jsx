import { AlertTriangle, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/Button";
import { useUserById } from "../hooks/useUserById";
import { Input } from "../../../../components/ui/Input";

export const EditUserModal = ({ isOpen, onClose, user, onSave, isPending }) => {
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
  useEffect(() => {
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
