import React, { useState, useEffect } from "react";
import { Icons } from "./Icons";

// Confirm Dialog
export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-150 border border-border">
        <h3 className="text-base font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {message}
        </p>
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-foreground bg-muted rounded-xl hover:bg-muted/80 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-destructive-foreground bg-destructive rounded-xl hover:bg-destructive/90 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Add/Edit Modal
export function AddEditModal({
  open,
  onClose,
  title,
  initialValue,
  placeholder,
  onSave,
  loading,
  type = "item",
}) {
  const [value, setValue] = useState(initialValue || "");

  useEffect(() => {
    if (open) setValue(initialValue || "");
  }, [open, initialValue]);

  if (!open) return null;

  const getPlaceholder = () => {
    switch (type) {
      case "industry":
        return "e.g. Information Technology";
      case "category":
        return "e.g. Software Development";
      case "subcategory":
        return "e.g. Web Development";
      default:
        return placeholder || "Enter name...";
    }
  };

  const handleSave = () => {
    if (value.trim()) {
      onSave(value.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md border border-border">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Icons.Close />
          </button>
        </div>

        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") onClose();
          }}
          placeholder={getPlaceholder()}
          className="w-full border border-input rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-muted/50 placeholder:text-muted-foreground/70"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground bg-muted rounded-xl hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !value.trim()}
            className="px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            )}
            {initialValue ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Category Modal
export function AddCategoryModal({
  open,
  onClose,
  onSave,
  loading,
  industries,
}) {
  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setIndustryId("");
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    if (name.trim() && industryId) {
      onSave({ category_name: name.trim(), industry_id: Number(industryId) });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md border border-border">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">
            Add Category
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Icons.Close />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Industry
            </label>
            <div className="relative">
              <select
                value={industryId}
                onChange={(e) => setIndustryId(e.target.value)}
                className="w-full appearance-none border border-input rounded-xl px-4 py-2.5 pr-9 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-muted/50"
              >
                <option value="">Select industry…</option>
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.industry_name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icons.ChevronDown />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Category Name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") onClose();
              }}
              placeholder="e.g. Software Development"
              className="w-full border border-input rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-muted/50 placeholder:text-muted-foreground/70"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground bg-muted rounded-xl hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !name.trim() || !industryId}
            className="px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            )}
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Subcategory Modal
export function AddSubcategoryModal({
  open,
  onClose,
  onSave,
  loading,
  industries,
}) {
  const [name, setName] = useState("");
  const [industryId, setIndustryId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setIndustryId("");
      setCategoryId("");
    }
  }, [open]);

  if (!open) return null;

  const selectedIndustry = industries.find(
    (i) => String(i.id) === String(industryId),
  );
  const categories = selectedIndustry?.categories || [];

  const handleSave = () => {
    if (name.trim() && categoryId) {
      onSave({
        sub_category_name: name.trim(),
        category_id: Number(categoryId),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md border border-border">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">
            Add Subcategory
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Icons.Close />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Industry
            </label>
            <div className="relative">
              <select
                value={industryId}
                onChange={(e) => {
                  setIndustryId(e.target.value);
                  setCategoryId("");
                }}
                className="w-full appearance-none border border-input rounded-xl px-4 py-2.5 pr-9 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-muted/50"
              >
                <option value="">Select industry…</option>
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.industry_name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icons.ChevronDown />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Category
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={!industryId}
                className="w-full appearance-none border border-input rounded-xl px-4 py-2.5 pr-9 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-muted/50 disabled:bg-muted/30 disabled:text-muted-foreground/60"
              >
                <option value="">Select category…</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icons.ChevronDown />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Subcategory Name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") onClose();
              }}
              placeholder="e.g. React Development"
              className="w-full border border-input rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-muted/50 placeholder:text-muted-foreground/70"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground bg-muted rounded-xl hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !name.trim() || !categoryId}
            className="px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            )}
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
