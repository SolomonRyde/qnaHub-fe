// hooks/usePagination.js
import { useState } from "react";

export function usePagination() {
  // Main DB Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Staging Pagination
  const [stagingCurrentPage, setStagingCurrentPage] = useState(1);
  const [stagingPageSize, setStagingPageSize] = useState(10);

  // History Pagination
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);

  return {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    stagingCurrentPage,
    setStagingCurrentPage,
    stagingPageSize,
    setStagingPageSize,
    historyCurrentPage,
    setHistoryCurrentPage,
    historyPageSize,
    setHistoryPageSize,
  };
}
