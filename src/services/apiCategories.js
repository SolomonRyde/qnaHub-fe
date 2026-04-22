export async function getIndustriesAndCategoriesAndSubCategories() {
  const res = await fetch(
    " https://api.rydevalues.cloud/api/v1/all-industries-categories-subcategories",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await res.json();

  if (!res.ok) {
    console.log("ERROR:", data.message);
    throw new Error(data.message || "Failed to fetch the Categories");
  }

  return data;
}
