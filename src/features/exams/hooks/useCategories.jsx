import { useQuery } from "@tanstack/react-query";
import { getIndustriesAndCategoriesAndSubCategories } from "../../../services/apiCategories";

export const useCategories = () => {
  const {
    data: categories,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getIndustriesAndCategoriesAndSubCategories,
  });

  return { categories, isLoading, error };
};
