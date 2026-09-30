import { apiClient } from "../lib/apiClient.js";
import { API_PATHS } from "../config/api.js";

export const sendContactMessage = async ({
  name,
  email,
  subject,
  message,
  company,
}) => {
  return apiClient.post(API_PATHS.CONTACT, {
    name,
    email,
    subject,
    message,
    company,
  });
};
