export const signup = async ({
  name,
  email,
  password,
  phone_number,
  country_code,
}) => {
  const res = await fetch("https://api.rydevalues.cloud/api/v1/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      phone_number,
      country_code,
    }),
  });

  const data = await res.json();
  console.log("RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data.message || data.error || "Signup failed");
  }

  return data;
};

export const verifyOtp = async ({ email, otp }) => {
  const res = await fetch(
    "https://api.rydevalues.cloud/api/v1/auth/verify-otp",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    console.log("ERROR:", data.message);
    throw new Error(data.message || "OTP verification failed");
  }

  return data;
};

export const resendOtp = async ({ email }) => {
  const res = await fetch(
    "https://api.rydevalues.cloud/api/v1/auth/resend-otp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    console.log("ERROR:", data.message);
    throw new Error(data.message || "Please enter a valid email address");
  }

  return data;
};

// services/apiAuth.js

export const login = async ({ email, password }) => {
  const res = await fetch("https://api.rydevalues.cloud/api/v1/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  // if (!res.ok) {
  //   console.log("ERROR:", data.message);
  //   throw new Error(data.message || "Login failed");
  // }

  if (!res.ok) {
    throw new Error(data.message || data.error || "Signup failed");
  }

  return data; // { token, user }
};

export async function forgotPassword(email) {
  const res = await fetch(
    "https://api.rydevalues.cloud/api/v1/auth/forgot-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );
  const data = await res.json();
  if (!res.ok) {
    console.log("ERROR:", data.message);
    throw new Error(data.message);
  }

  return data;
}

export async function resetPassword({ token, new_password }) {
  const res = await fetch(
    "https://api.rydevalues.cloud/api/v1/auth/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, new_password }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    console.log("ERROR:", data.message);
    throw new Error(data.message || "Failed to reset password");
  }

  return data;
}

export const getCurrentUser = async () => {
  const res = await fetch("https://api.rydevalues.cloud/api/v1/auth/me", {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) return null;

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return res.json();
};

/* ========================================
   SELF-SERVICE ACCOUNT MANAGEMENT
   ======================================== */

// Updates name / phone_number / country_code. Does NOT touch email or password.
export const updateProfile = async ({ name, phone_number, country_code }) => {
  const res = await fetch("https://api.rydevalues.cloud/api/v1/auth/profile", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone_number, country_code }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to update profile");
  }
  return data;
};

// Requires current_password. Sends an OTP to the new email — confirm with
// the existing verifyOtp() call to finish activating the change.
export const updateEmail = async ({ email, current_password }) => {
  const res = await fetch("https://api.rydevalues.cloud/api/v1/auth/email", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, current_password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to update email");
  }
  return data;
};

// Requires current_password + new_password.
export const changePassword = async ({ current_password, new_password }) => {
  const res = await fetch("https://api.rydevalues.cloud/api/v1/auth/password", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ current_password, new_password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to change password");
  }
  return data;
};
