const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.rydevalues.cloud/api/v1";

async function handleResponse(response) {
  const text = await response.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text || "Invalid server response");
  }

  if (!response.ok) {
    throw new Error(data.message || "CSV upload failed");
  }

  return data;
}

export async function uploadCsvToStaging(file) {
  const formData = new FormData();

  // Important: this key should match backend multer field name.
  // Usually it is "file".
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/question-imports/staging`, {
    method: "POST",
    headers: {
      "x-user-id": "admin",
    },
    body: formData,
  });

  return handleResponse(response);
}