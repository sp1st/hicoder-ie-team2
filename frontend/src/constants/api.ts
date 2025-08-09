const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  USERS: (userId: string) => `${API_BASE_URL}/users/${userId}`,
  WATER_RECORDS: (userId: string) => `${API_BASE_URL}/water_records/${userId}`,
};
