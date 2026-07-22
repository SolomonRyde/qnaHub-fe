import { useQuery } from "@tanstack/react-query";
import {
  getAdminExamAttempts,
  getAdminAttemptDetail,
} from "../../../../services/apiExams";

/**
 * Paginated / filterable list of every user's exam attempts, plus
 * aggregate stats for the dashboard's stat cards.
 */
export function useAdminExamAttempts(params) {
  return useQuery({
    queryKey: ["admin-exam-attempts", params],
    queryFn: () => getAdminExamAttempts(params),
    keepPreviousData: true,
    staleTime: 30_000,
  });
}

/**
 * Full detail (with per-question answer review) for a single attempt.
 * Only fetches when `attemptId` is truthy (e.g. a detail modal is open).
 */
export function useAdminAttemptDetail(attemptId) {
  return useQuery({
    queryKey: ["admin-exam-attempt-detail", attemptId],
    queryFn: () => getAdminAttemptDetail(attemptId),
    enabled: !!attemptId,
    staleTime: 30_000,
  });
}
