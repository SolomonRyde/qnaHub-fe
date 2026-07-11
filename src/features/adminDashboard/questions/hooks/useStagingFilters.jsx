// hooks/useStagingFilters.js
import { useState } from "react";

export function useStagingFilters() {
  const [stagingSearch, setStagingSearch] = useState("");
  const [stagingStatus, setStagingStatus] = useState("all");

  return {
    stagingSearch,
    setStagingSearch,
    stagingStatus,
    setStagingStatus,
  };
}
