import { useQuery } from "@tanstack/react-query";
import { api } from "../../../services/apiIndustryCategorySubCategory";

export const useCategories = () => {
  const {
    data: categories,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getIndustriesAndCategoriesAndSubCategories,
  });

  return { categories, isLoading, error };
};
