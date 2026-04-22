export async function getDashboardStats() {
  const res = await fetch(
    "https://api.rydevalues.cloud/api/v1/admin/dashboard-stats",
    {
      method: "GET",
      credentials: "include", // 👈 important if using cookies
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}` (if needed)
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    console.log("ERROR:", data.message);
    throw new Error(data.message || "Failed to fetch dashboard stats");
  }

  return data;
}
