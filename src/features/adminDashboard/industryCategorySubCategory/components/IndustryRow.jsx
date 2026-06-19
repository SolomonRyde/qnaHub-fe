import React, { useState } from "react";
import { Icons } from "./Icons";
import CategoryRow from "./CategoryRow";

export default function IndustryRow({
  industry,
  selectedRows,
  onSelectRow,
  onEdit,
  onDelete,
  onEditCat,
  onDeleteCat,
  onEditSub,
  onDeleteSub,
  updateLoading,
  deleteLoading,
  editing,
  setEditing,
  getEditValue,
  setEditValue,
}) {
  const [open, setOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const cats = industry.categories || [];
  const catCount = cats.length;
  const totalSubs = cats.reduce(
    (acc, c) => acc + (c.subcategories?.length || 0),
    0,
  );

  const isEditing = editing.type === "industry" && editing.id === industry.id;
  const editValue = getEditValue(industry.id, industry.industry_name);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit({ id: industry.id, industry_name: editValue.trim() });
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
          <td className="py-4 px-5" colSpan={5}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-destructive">
                Delete "{industry.industry_name}" and all {catCount} categories
                with {totalSubs} subcategories?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 text-sm font-medium text-foreground bg-muted rounded-lg hover:bg-muted/80"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(industry.id);
                    setConfirmDelete(false);
                  }}
                  disabled={deleteLoading}
                  className="px-3 py-1.5 text-sm font-semibold text-destructive-foreground bg-destructive rounded-lg hover:bg-destructive/90 disabled:opacity-60"
                >
                  {deleteLoading ? "Deleting..." : "Delete All"}
                </button>
              </div>
            </div>
          </td>
        </tr>
        {open &&
          cats.map((cat) => (
            <CategoryRow
              key={cat.id}
              category={cat}
              industryId={industry.id}
              onEdit={onEditCat}
              onDelete={onDeleteCat}
              onEditSub={onEditSub}
              onDeleteSub={onDeleteSub}
              updateLoading={updateLoading}
              deleteSubLoading={deleteLoading}
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
          <td className="py-4 px-5" colSpan={5}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Icons.Industry />
              </div>
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(industry.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
                onBlur={handleCancel}
                placeholder="Enter industry name..."
                className="flex-1 border border-input rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-card text-foreground placeholder:text-muted-foreground/70"
              />
              <button
                onClick={handleSave}
                disabled={updateLoading || !editValue.trim()}
                className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-60"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-foreground bg-muted rounded-lg hover:bg-muted/80"
              >
                Cancel
              </button>
            </div>
          </td>
        </tr>
        {open &&
          cats.map((cat) => (
            <CategoryRow
              key={cat.id}
              category={cat}
              industryId={industry.id}
              onEdit={onEditCat}
              onDelete={onDeleteCat}
              onEditSub={onEditSub}
              onDeleteSub={onDeleteSub}
              updateLoading={updateLoading}
              deleteSubLoading={deleteLoading}
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
        className={`border-b border-border bg-muted/30 hover:bg-muted/50 transition-colors group/ind ${!open && catCount > 0 && "border-b-0"}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <td className="py-4 px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${catCount > 0 ? "text-muted-foreground hover:text-foreground hover:bg-muted" : "invisible"}`}
            >
              <Icons.ChevronRight open={open} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
              <Icons.Industry />
            </div>
            <div className="min-w-0">
              <p
                className="text-sm font-semibold text-foreground leading-tight truncate"
                title={industry.industry_name}
              >
                {industry.industry_name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {catCount} {catCount === 1 ? "Category" : "Categories"} •{" "}
                {totalSubs} {totalSubs === 1 ? "Subcategory" : "Subcategories"}
              </p>
            </div>
          </div>
        </td>

        <td className="py-4 px-5">
          {catCount === 0 ? (
            <span className="text-sm text-muted-foreground italic">
              No categories
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {catCount} {catCount === 1 ? "category" : "categories"}
            </span>
          )}
        </td>

        <td className="py-4 px-5">
          {totalSubs === 0 ? (
            <span className="text-sm text-muted-foreground italic">
              No subcategories
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
              {totalSubs} {totalSubs === 1 ? "sub" : "subs"}
            </span>
          )}
        </td>

        <td className="py-4 px-5">
          <div
            className={`flex items-center gap-1 transition-opacity ${showActions ? "opacity-100" : "opacity-0"}`}
          >
            <button
              onClick={() => setEditing({ type: "industry", id: industry.id })}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Edit Industry"
            >
              <Icons.Edit />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Delete Industry"
            >
              <Icons.Trash />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <Icons.MoreVert />
            </button>
          </div>
        </td>
      </tr>

      {open &&
        cats.map((cat) => (
          <CategoryRow
            key={cat.id}
            category={cat}
            industryId={industry.id}
            onEdit={onEditCat}
            onDelete={onDeleteCat}
            onEditSub={onEditSub}
            onDeleteSub={onDeleteSub}
            updateLoading={updateLoading}
            deleteSubLoading={deleteLoading}
            editing={editing}
            setEditing={setEditing}
            getEditValue={getEditValue}
            setEditValue={setEditValue}
          />
        ))}
    </>
  );
}
