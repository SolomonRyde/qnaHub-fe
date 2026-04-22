import { useQuery } from "@tanstack/react-query";
import { MOCK_EXAMS } from "../../../data/mockExams";

export const useExams = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      // simulate API delay
      await new Promise((res) => setTimeout(res, 500));
      return { data: MOCK_EXAMS };
    },
  });

  return {
    exams: data?.data || [],
    isLoading: isPending,
    error,
  };
};
