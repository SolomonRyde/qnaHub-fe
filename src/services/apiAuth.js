import { apiClient } from "../lib/apiClient.js";
import { API_PATHS } from "../config/api.js";

export const signup = async ({
  name,
  email,
  password,
  phone_number,
  country_code,
}) => {
  const data = await apiClient.post(`${API_PATHS.AUTH}/signup`, {
    name,
    email,
    password,
    phone_number,
    country_code,
  });

  return data;
};

export const verifyOtp = async ({ email, otp }) => {
  const data = await apiClient.post(`${API_PATHS.AUTH}/verify-otp`, {
    email,
    otp,
  });

  return data;
};

export const resendOtp = async ({ email }) => {
  const data = await apiClient.post(`${API_PATHS.AUTH}/resend-otp`, { email });

  return data;
};

// services/apiAuth.js

export const login = async ({ email, password }) => {
  const data = await apiClient.post(`${API_PATHS.AUTH}/login`, {
    email,
    password,
  });

  return data; // { token, user }
};

export async function forgotPassword(email) {
  const data = await apiClient.post(`${API_PATHS.AUTH}/forgot-password`, {
    email,
  });

  return data;
}

export async function resetPassword({ token, new_password }) {
  const data = await apiClient.post(`${API_PATHS.AUTH}/reset-password`, {
    token,
    new_password,
  });

  return data;
}

export const getCurrentUser = async () => {
  try {
    const data = await apiClient.get(`${API_PATHS.AUTH}/me`);
    return data;
  } catch (error) {
    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      return null;
    }
    throw new Error("Something went wrong");
  }
};

/* ========================================
   SELF-SERVICE ACCOUNT MANAGEMENT
   ======================================== */

// Updates name / phone_number / country_code. Does NOT touch email or password.
export const updateProfile = async ({ name, phone_number, country_code }) => {
  const data = await apiClient.patch(`${API_PATHS.AUTH}/profile`, {
    name,
    phone_number,
    country_code,
  });

  return data;
};

// Saves the logged-in user's referral source + name.
export const updateReferral = async ({ referral_source, referral_name }) => {
  const data = await apiClient.patch(`${API_PATHS.AUTH}/referral`, {
    referral_source,
    referral_name,
  });

  return data;
};

// Requires current_password. Sends an OTP to the new email — confirm with
// the existing verifyOtp() call to finish activating the change.
export const updateEmail = async ({ email, current_password }) => {
  const data = await apiClient.patch(`${API_PATHS.AUTH}/email`, {
    email,
    current_password,
  });

  return data;
};

// Requires current_password + new_password.
export const changePassword = async ({ current_password, new_password }) => {
  const data = await apiClient.patch(`${API_PATHS.AUTH}/password`, {
    current_password,
    new_password,
  });

  return data;
};
