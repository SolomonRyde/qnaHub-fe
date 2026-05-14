import React, { useState } from "react";
import { Icons } from "./Icons";

export default function SubcategoryRow({
  subcategory,
  onEdit,
  onDelete,
  loading,
  editing,
  setEditing,
  getEditValue,
  setEditValue,
}) {
  const [showActions, setShowActions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isEditing =
    editing.type === "subcategory" && editing.id === subcategory.id;
  const editValue = getEditValue(subcategory.id, subcategory.sub_category_name);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit({ id: subcategory.id, sub_category_name: editValue.trim() });
      setEditing({ type: null, id: null });
    }
  };

  const handleCancel = () => {
    setEditing({ type: null, id: null });
  };

  // Delete confirmation
  if (confirmDelete) {
    return (
      <tr className="border-b border-border bg-destructive/10">
        <td className="py-3 px-5 pl-20" colSpan={5}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-destructive">
              Delete "{subcategory.sub_category_name}"?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 text-xs font-medium text-foreground bg-muted rounded-lg hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(subcategory.id);
                  setConfirmDelete(false);
                }}
                disabled={loading}
                className="px-3 py-1 text-xs font-semibold text-destructive-foreground bg-destructive rounded-lg hover:bg-destructive/90 disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  // Edit mode row
  if (isEditing) {
    return (
      <tr className="border-b border-border bg-primary/10">
        <td className="py-3 px-5 pl-20" colSpan={5}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-500 dark:text-purple-400 flex-shrink-0">
              <Icons.Subcategory />
            </div>
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(subcategory.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              onBlur={handleCancel}
              placeholder="Enter subcategory name..."
              className="flex-1 border border-input rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-card text-foreground placeholder:text-muted-foreground/70"
            />
            <button
              onClick={handleSave}
              disabled={loading || !editValue.trim()}
              className="px-3 py-1.5 text-xs font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-60"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-medium text-foreground bg-muted rounded-lg hover:bg-muted/80"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Normal view
  return (
    <tr
      className="border-b border-border hover:bg-muted/30 transition-colors group/sub"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <td className="py-3 px-5">
        <div className="flex items-center gap-2 pl-14">
          <span className="w-4" />
          <div className="w-5 h-5 rounded-sm bg-purple-500/10 flex items-center justify-center text-purple-500 dark:text-purple-400 flex-shrink-0">
            <Icons.Subcategory />
          </div>
        </div>
      </td>
      <td className="py-3 px-5"></td>
      <td className="py-3 px-5">
        <div className="flex items-center">
          <span
            className="text-sm text-foreground"
            title={subcategory.sub_category_name}
          >
            {subcategory.sub_category_name.length > 40
              ? `${subcategory.sub_category_name.slice(0, 40)}...`
              : subcategory.sub_category_name}
          </span>
        </div>
      </td>
      <td className="py-3 px-5">
        <div
          className={`flex items-center gap-1 transition-opacity ${showActions ? "opacity-100" : "opacity-0"}`}
        >
          <button
            onClick={() =>
              setEditing({ type: "subcategory", id: subcategory.id })
            }
            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Edit Subcategory"
          >
            <Icons.Edit />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            title="Delete Subcategory"
          >
            <Icons.Trash />
          </button>
        </div>
      </td>
    </tr>
  );
}
