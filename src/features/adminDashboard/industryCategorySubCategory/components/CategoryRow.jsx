import React, { useState } from "react";
import { Icons } from "./Icons";
import SubcategoryRow from "./SubcategoryRow";

export default function CategoryRow({
  category,
  industryId,
  onEdit,
  onDelete,
  onEditSub,
  onDeleteSub,
  updateLoading,
  deleteSubLoading,
  editing,
  setEditing,
  getEditValue,
  setEditValue,
}) {
  const [open, setOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const subs = category.subcategories || [];
  const subCount = subs.length;

  const isEditing = editing.type === "category" && editing.id === category.id;
  const editValue = getEditValue(category.id, category.category_name);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit({ id: category.id, category_name: editValue.trim() });
      setEditing({ type: null, id: null });
    }
  };

  const handleCancel = () => {
    setEditing({ type: null, id: null });
  };

  // Delete confirmation
  if (confirmDelete) {
    return (
      <>
        <tr className="border-b border-border bg-destructive/10">
          <td className="py-3 px-5 pl-10" colSpan={5}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-destructive">
                Delete "{category.category_name}" and {subCount} subcategory
                {subCount !== 1 ? "s" : ""}?
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
                    onDelete(category.id);
                    setConfirmDelete(false);
                  }}
                  disabled={updateLoading}
                  className="px-3 py-1 text-xs font-semibold text-destructive-foreground bg-destructive rounded-lg hover:bg-destructive/90 disabled:opacity-60"
                >
                  {updateLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </td>
        </tr>
        {open &&
          subs.map((sub) => (
            <SubcategoryRow
              key={sub.id}
              subcategory={sub}
              onEdit={onEditSub}
              onDelete={onDeleteSub}
              loading={deleteSubLoading}
              editing={editing}
              setEditing={setEditing}
              getEditValue={getEditValue}
              setEditValue={setEditValue}
            />
          ))}
      </>
    );
  }

  // Edit mode row
  if (isEditing) {
    return (
      <>
        <tr className="border-b border-border bg-primary/10">
          <td className="py-3 px-5" colSpan={5}>
            <div className="flex items-center gap-3 pl-6">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400 flex-shrink-0">
                <Icons.Category />
              </div>
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(category.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
                onBlur={handleCancel}
                placeholder="Enter category name..."
                className="flex-1 border border-input rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-card text-foreground placeholder:text-muted-foreground/70"
              />
              <button
                onClick={handleSave}
                disabled={updateLoading || !editValue.trim()}
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
        {open &&
          subs.map((sub) => (
            <SubcategoryRow
              key={sub.id}
              subcategory={sub}
              onEdit={onEditSub}
              onDelete={onDeleteSub}
              loading={deleteSubLoading}
              editing={editing}
              setEditing={setEditing}
              getEditValue={getEditValue}
              setEditValue={setEditValue}
            />
          ))}
      </>
    );
  }

  // Normal view
  return (
    <>
      <tr
        className={`border-b border-border hover:bg-muted/20 transition-colors group/cat ${!open && "border-b-0"}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <td className="py-3 px-5">
          <div className="flex items-center gap-2 pl-6">
            <button
              onClick={() => setOpen((v) => !v)}
              className={`p-1 rounded transition-colors ${subCount > 0 ? "text-muted-foreground hover:text-foreground hover:bg-muted" : "invisible"}`}
            >
              <Icons.ChevronRight open={open} />
            </button>
            <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400 flex-shrink-0">
              <Icons.Category />
            </div>
          </div>
        </td>

        <td className="py-3 px-5">
          <span
            className="text-sm font-medium text-foreground"
            title={category.category_name}
          >
            {category.category_name.length > 45
              ? `${category.category_name.slice(0, 45)}...`
              : category.category_name}
          </span>
        </td>

        <td className="py-3 px-5">
          {subCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
              {subCount} {subCount === 1 ? "sub" : "subs"}
            </span>
          )}
        </td>

        <td className="py-3 px-5">
          <div
            className={`flex items-center gap-1 transition-opacity ${showActions ? "opacity-100" : "opacity-0"}`}
          >
            <button
              onClick={() => setEditing({ type: "category", id: category.id })}
              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Edit Category"
            >
              <Icons.Edit />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Delete Category"
            >
              <Icons.Trash />
            </button>
          </div>
        </td>
      </tr>

      {open &&
        subs.map((sub) => (
          <SubcategoryRow
            key={sub.id}
            subcategory={sub}
            onEdit={onEditSub}
            onDelete={onDeleteSub}
            loading={deleteSubLoading}
            editing={editing}
            setEditing={setEditing}
            getEditValue={getEditValue}
            setEditValue={setEditValue}
          />
        ))}
    </>
  );
}
