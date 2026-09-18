export const sendContactMessage = async ({
  name,
  email,
  subject,
  message,
  company,
}) => {
  const res = await fetch("https://api.rydevalues.cloud/api/v1/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, subject, message, company }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to send message");
  }

  return data;
};
