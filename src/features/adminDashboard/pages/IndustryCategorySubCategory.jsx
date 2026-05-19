import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Icons } from "../industryCategorySubCategory/components/Icons";
import IndustryRow from "../industryCategorySubCategory/components/IndustryRow";
import {
  ConfirmDialog,
  AddEditModal,
  AddCategoryModal,
  AddSubcategoryModal,
} from "../industryCategorySubCategory/components/Modals";

import { StatCard } from "../industryCategorySubCategory/components/StatsDropdown";
import { SelectDropdown } from "../industryCategorySubCategory/components/StatsDropdown";

import {
  useHierarchy,
  useIndustryMutations,
  useCategoryMutations,
  useSubcategoryMutations,
} from "../industryCategorySubCategory/hooks/useHierarchy";

// ─── Main Content ─────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [10, 20, 50];

function IndustryCategoryContent() {
  const createInd = useIndustryMutations().create;
  const updateInd = useIndustryMutations().update;
  const deleteInd = useIndustryMutations().remove;
  const createCat = useCategoryMutations().create;
  const updateCat = useCategoryMutations().update;
  const deleteCat = useCategoryMutations().remove;
  const createSub = useSubcategoryMutations().create;
  const updateSub = useSubcategoryMutations().update;
  const deleteSub = useSubcategoryMutations().remove;

  const [search, setSearch] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [showAddInd, setShowAddInd] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [showAddSub, setShowAddSub] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    type: "",
    id: null,
    name: "",
  });

  // ─── Centralized Edit State ──────────────────────────────────
  const [editing, setEditing] = useState({ type: null, id: null });
  const [editValues, setEditValues] = useState({});

  const { data, isLoading, isError } = useHierarchy({
    page,
    limit: pageSize,
    search,
    industry: filterIndustry,
    category: filterCategory,
  });

  console.log("DATA", data);

  const industries = data?.nestedData || [];
  console.log("INDUSTRIES", industries);

  // const totalCats = industries.reduce(
  //   (a, i) => a + (i.categories?.length || 0),
  //   0,
  // );
  // const totalSubs = industries.reduce(
  //   (a, i) =>
  //     a +
  //     (i.categories?.reduce((b, c) => b + (c.subcategories?.length || 0), 0) ||
  //       0),
  //   0,
  // );

  const totalIndustries = data?.stats?.totalIndustries || 0;
  const totalCats = data?.stats?.totalCategories || 0;
  const totalSubs = data?.stats?.totalSubcategories || 0;

  const getEditValue = (id, defaultValue) =>
    editValues[id] !== undefined ? editValues[id] : defaultValue;

  const setEditValue = (id, value) =>
    setEditValues((prev) => ({ ...prev, [id]: value }));

  const totalPages = data?.totalPages || 1;
  const totalRecords = data?.count || 0;
  const fromCount = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const toCount = Math.min(page * pageSize, totalRecords);

  const toggleRow = (id) =>
    setSelectedRows((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const toggleAll = () =>
    setSelectedRows(
      selectedRows.length === industries.length
        ? []
        : industries.map((i) => i.id),
    );

  const industryOptions = industries.map((i) => ({
    value: String(i.id),
    label: i.industry_name,
  }));

  const categoryOptions = useMemo(() => {
    if (!filterIndustry) return [];
    const selectedIndustry = industries.find(
      (i) => String(i.id) === filterIndustry,
    );
    if (!selectedIndustry?.categories) return [];

    return selectedIndustry.categories.map((c) => ({
      value: String(c.id),
      label: c.category_name,
    }));
  }, [industries, filterIndustry]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    for (
      let i = Math.max(1, page - 2);
      i <= Math.min(totalPages, page + 2);
      i++
    )
      pages.push(i);
    return pages;
  }, [totalPages, page]);

  return (
    <div className="min-h-screen bg-background space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Industry Hierarchy Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage industries, categories, and subcategories from a centralized
            dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddInd(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
          >
            <Icons.Plus /> Add Industry
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Icons.Industry />}
          iconBg="bg-primary/10 text-primary"
          label="Total Industries"
          value={isLoading ? "—" : totalIndustries}
          // value={isLoading ? "—" : industries.length}
        />
        <StatCard
          icon={<Icons.Category />}
          iconBg="bg-blue-500/10 text-blue-500 dark:text-blue-400"
          label="Total Categories"
          value={isLoading ? "—" : totalCats}
          // value={isLoading ? "—" : totalCats}
        />
        <StatCard
          icon={<Icons.Subcategory />}
          iconBg="bg-purple-500/10 text-purple-500 dark:text-purple-400"
          label="Total Subcategories"
          value={isLoading ? "—" : totalSubs}
        />
      </div>

      {/* Table Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-border">
          <div className="relative min-w-[240px] flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Icons.Search />
            </div>
            <input
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-muted/50 placeholder:text-muted-foreground/70 transition-all text-foreground"
              placeholder="Search industry, category or subcategory..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Industry Filter */}
          <SelectDropdown
            label="Industry"
            options={industryOptions}
            value={filterIndustry}
            onChange={(v) => {
              setFilterIndustry(v);
              setFilterCategory("");
              setPage(1);
            }}
          />

          {/* Category Filter */}
          <SelectDropdown
            label="Category"
            options={categoryOptions}
            value={filterCategory}
            onChange={(v) => {
              setFilterCategory(v);
              setPage(1);
            }}
            disabled={!filterIndustry}
          />

          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <button
              onClick={() => setShowAddCat(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icons.Plus /> Add Category
            </button>
            <button
              onClick={() => setShowAddSub(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icons.Plus /> Add Subcategory
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-3.5 px-5 text-left w-64">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4"></span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Industry
                    </span>
                  </div>
                </th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-44">
                  Category
                </th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Subcategory
                </th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-muted-foreground">
                        Loading data…
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <p className="text-sm text-destructive">
                      Failed to load data. Please refresh.
                    </p>
                  </td>
                </tr>
              )}
              {!isLoading && !isError && industries.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <p className="text-sm text-muted-foreground">
                      No industries found.
                    </p>
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                industries.map((ind) => (
                  <IndustryRow
                    key={ind.id}
                    industry={ind}
                    selectedRows={selectedRows}
                    onSelectRow={toggleRow}
                    editing={editing}
                    setEditing={setEditing}
                    getEditValue={getEditValue}
                    setEditValue={setEditValue}
                    onEdit={(p) => updateInd.mutate(p)}
                    onDelete={(id) =>
                      setDeleteConfirm({
                        open: true,
                        type: "industry",
                        id,
                        name: ind.industry_name,
                      })
                    }
                    onEditCat={(p) => updateCat.mutate(p)}
                    onDeleteCat={(id) =>
                      setDeleteConfirm({
                        open: true,
                        type: "category",
                        id,
                        name:
                          ind.categories?.find((c) => c.id === id)
                            ?.category_name || "",
                      })
                    }
                    onEditSub={(p) => updateSub.mutate(p)}
                    onDeleteSub={(id) =>
                      setDeleteConfirm({
                        open: true,
                        type: "subcategory",
                        id,
                        name:
                          ind.categories
                            ?.flatMap((c) => c.subcategories || [])
                            .find((s) => s.id === id)?.sub_category_name || "",
                      })
                    }
                    updateLoading={updateInd.isPending || updateCat.isPending}
                    deleteLoading={
                      deleteInd.isPending ||
                      deleteCat.isPending ||
                      deleteSub.isPending
                    }
                  />
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {fromCount} to {toCount} of {totalRecords} industries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-input"
            >
              <Icons.ChevronLeft />
            </button>
            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 text-sm font-semibold rounded-lg transition-colors ${
                  page === p
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted border border-input"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-input"
            >
              <Icons.ChevronRight className="rotate-[-90deg]" />
            </button>
            <div className="relative ml-1">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="appearance-none bg-card border border-input rounded-xl pl-3 pr-8 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s} / page
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icons.ChevronDown />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEditModal
        open={showAddInd}
        onClose={() => setShowAddInd(false)}
        title="Add Industry"
        onSave={(name) => {
          createInd.mutate({ industry_name: name });
          setShowAddInd(false);
        }}
        loading={createInd.isPending}
        type="industry"
      />
      <AddCategoryModal
        open={showAddCat}
        onClose={() => setShowAddCat(false)}
        onSave={(p) => {
          createCat.mutate(p);
          setShowAddCat(false);
        }}
        loading={createCat.isPending}
        industries={industries}
      />
      <AddSubcategoryModal
        open={showAddSub}
        onClose={() => setShowAddSub(false)}
        onSave={(p) => {
          createSub.mutate(p);
          setShowAddSub(false);
        }}
        loading={createSub.isPending}
        industries={industries}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        title={`Delete ${deleteConfirm.type}`}
        message={`Are you sure you want to delete "${deleteConfirm.name}"?`}
        confirmText="Delete"
        loading={
          deleteInd.isPending || deleteCat.isPending || deleteSub.isPending
        }
        onCancel={() =>
          setDeleteConfirm({
            open: false,
            type: "",
            id: null,
            name: "",
          })
        }
        onConfirm={() => {
          if (deleteConfirm.type === "industry") {
            deleteInd.mutate(deleteConfirm.id);
          }
          if (deleteConfirm.type === "category") {
            deleteCat.mutate(deleteConfirm.id);
          }
          if (deleteConfirm.type === "subcategory") {
            deleteSub.mutate(deleteConfirm.id);
          }
          setDeleteConfirm({
            open: false,
            type: "",
            id: null,
            name: "",
          });
        }}
      />
    </div>
  );
}

export default function IndustryCategorySubCategory() {
  return <IndustryCategoryContent />;
}
