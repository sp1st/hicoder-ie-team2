/**
 * @fileoverview API constants, types, and utility functions for the water intake tracking application
 * Provides centralized endpoint definitions, type definitions, and HTTP request helpers
 */

/**
 * Base API URL for all endpoints
 * Uses environment variable or defaults to localhost for development
 */
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

/**
 * API endpoint definitions for all available services
 * Provides centralized URL generation for consistent API calls
 */
export const API_ENDPOINTS = {
  /** Base API URL */
  BASE_URL: API_BASE_URL,

  // GET Endpoints
  /** Get user information by ID */
  USER_INFO: (userId: UserId) => `${API_BASE_URL}/users/${userId}`,
  /** Get nearby users information */
  NEAR_USERS_INFO: () => `${API_BASE_URL}/users/nearby`,
  /** Get all water records for a user */
  WATER_RECORDS: (userId: UserId) => `${API_BASE_URL}/water_records/${userId}`,
  /** Get today's water records for a user */
  WATER_RECORDS_TODAY: (userId: UserId) => `${API_BASE_URL}/water_records/today/${userId}`,
  /** Get latest water records for a user */
  WATER_RECORDS_LATEST: (userId: UserId) => `${API_BASE_URL}/water_records/now/${userId}`,
  /** Get all available stamps */
  STAMPS: () => `${API_BASE_URL}/stamps`,
  /** Get specific stamp information */
  STAMP_INFO: (stampId: StampId) => `${API_BASE_URL}/stamps/${stampId}`,
  /** Get stamps sent by a user */
  STAMPS_SENT_INFO: (userId: UserId) => `${API_BASE_URL}/stamps/send/${userId}`,

  // POST Endpoints
  /** Create a new user */
  CREATE_USER: () => `${API_BASE_URL}/users`,
  /** Create a new water record for a user */
  CREATE_WATER_RECORD: (userId: UserId) => `${API_BASE_URL}/water_records/${userId}`,
  /** Send a stamp between users */
  SEND_STAMP: (_sender_id: UserId, _receiver_id: UserId, _stamp_id: StampId) => `${API_BASE_URL}/stamps/send`,

  // PUT Endpoints
  /** Update user information */
  UPDATE_USER_INFO: (userId: UserId) => `${API_BASE_URL}/users/${userId}`,
  /** Update a water record */
  UPDATE_WATER_RECORD: (waterId: number) => `${API_BASE_URL}/water_records/${waterId}`,
  /** Respond to a stamp */
  RESPOND_STAMP: (userStampId: number) => `${API_BASE_URL}/stamps/apply/${userStampId}`
};

/** User identifier type */
export type UserId = number;

/** Stamp identifier type */
export type StampId = number;

/**
 * User entity representing a registered user in the system
 */
export type User = {
  /** Unique user identifier */
  user_id: UserId,
  /** Display name of the user */
  user_name: string,
  /** User biography or description */
  bio: string | "null",
  /** X (Twitter) handle */
  X: string | "null",
  /** URL to user's profile photo */
  photo_url: string | "null",
  /** Hashed password for authentication */
  password_hash: string,
}

/**
 * Water consumption record
 */
export type WaterRecord = {
  /** Unique water record identifier */
  water_id: number,
  /** Date and time when water was consumed */
  water_date: Date,
  /** Type of beverage (water, tea, milk, etc.) */
  water_type: string,
  /** Amount of water consumed in milliliters */
  water_amount: number,
  /** Latitude coordinate where consumption occurred */
  lat: number,
  /** Longitude coordinate where consumption occurred */
  lon: number,
  /** Optional comment about the consumption */
  comment: string,
  /** ID of the user who recorded this consumption */
  user_id: UserId
}

/**
 * User stamp interaction record
 */
export type UserStamp = {
  /** Unique user stamp interaction identifier */
  user_stamp_id: number,
  /** Whether the stamp has been applied/responded to */
  after_stamp: boolean,
  /** ID of the user receiving the stamp */
  recieve_id: UserId,
  /** ID of the user sending the stamp */
  sender_id: UserId,
  /** ID of the stamp being sent */
  stamp_id: number | "null",
  /** Timestamp when the record was created */
  created_at: Date,
  /** Timestamp when the record was last updated */
  updated_at: Date
}

/**
 * Stamp entity representing an encouragement stamp
 */
export type Stamp = {
  /** Unique stamp identifier */
  stamp_id: number,
  /** Message text of the stamp */
  message: string,
  /** URL to the stamp's image */
  image_url: string
}

/**
 * Custom error class for API-related errors
 * Extends the standard Error class with additional API-specific information
 */
export class ApiError extends Error {
  /** HTTP status code of the failed request */
  status?: number;
  /** Response body from the failed request */
  body?: unknown;

  /**
   * Creates a new ApiError instance
   * @param message - Error message describing what went wrong
   * @param status - HTTP status code from the response
   * @param body - Response body containing additional error details
   */
  constructor(message: string, status?: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Type guard function signature for runtime type checking
 * @template T - The type to guard against
 */
export type TypeGuard<T> = (x: unknown) => x is T;

/**
 * Configuration options for HTTP requests
 */
type RequestOptions = {
  /** HTTP method for the request */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Additional headers to include in the request */
  headers?: Record<string, string>;
  /** Request body data */
  body?: unknown;
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /** Request timeout in milliseconds */
  timeoutMs?: number;
  /** Optional runtime type guard for response validation */
  guard?: TypeGuard<any>;
};

/**
 * Core HTTP request helper function with error handling and optional type validation
 * @template T - Expected response type
 * @param url - The URL to send the request to
 * @param options - Request configuration options
 * @returns Promise resolving to the parsed response data
 * @throws {ApiError} When request fails or validation fails
 */
async function request<T>(
  url: string,
  {
    method = "GET",
    headers,
    body,
    signal,
    timeoutMs,
    guard
  }: RequestOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const abortSignal = signal ?? controller.signal;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    if (timeoutMs && timeoutMs > 0) {
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(headers ?? {})
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: abortSignal
    });

    // Non-2xx => throw
    if (!res.ok) {
      let errBody: unknown = undefined;
      try {
        errBody = await res.json();
      } catch {
        // ignore parse error
      }
      throw new ApiError(`HTTP ${res.status} for ${method} ${url}`, res.status, errBody);
    }

    // Try parse JSON; allow empty
    const text = await res.text();
    const data = (text ? JSON.parse(text) : null) as unknown;

    // Optional guard
    if (guard && !guard(data)) {
      throw new ApiError(`Response validation failed for ${method} ${url}`, res.status, data);
    }

    return data as T;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new ApiError(`Request aborted (timeout or manual): ${method} ${url}`);
    }
    if (e instanceof ApiError) throw e;
    throw new ApiError(`Network/Unknown error: ${e?.message ?? String(e)}`);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

/**
 * Convenience API client with common HTTP methods
 * Provides a thin wrapper around the core request function
 */
export const api = {
  /**
   * Performs a GET request
   * @template T - Expected response type
   * @param url - The URL to request
   * @param opts - Optional request configuration
   * @returns Promise resolving to the response data
   */
  get: <T>(url: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(url, { ...opts, method: "GET" }),

  /**
   * Performs a POST request
   * @template T - Expected response type
   * @param url - The URL to request
   * @param body - Data to send in the request body
   * @param opts - Optional request configuration
   * @returns Promise resolving to the response data
   */
  post: <T>(url: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(url, { ...opts, method: "POST", body }),

  /**
   * Performs a PUT request
   * @template T - Expected response type
   * @param url - The URL to request
   * @param body - Data to send in the request body
   * @param opts - Optional request configuration
   * @returns Promise resolving to the response data
   */
  put: <T>(url: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(url, { ...opts, method: "PUT", body }),

  /**
   * Performs a PATCH request
   * @template T - Expected response type
   * @param url - The URL to request
   * @param body - Data to send in the request body
   * @param opts - Optional request configuration
   * @returns Promise resolving to the response data
   */
  patch: <T>(url: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(url, { ...opts, method: "PATCH", body }),

  /**
   * Performs a DELETE request
   * @template T - Expected response type
   * @param url - The URL to request
   * @param opts - Optional request configuration
   * @returns Promise resolving to the response data
   */
  delete: <T>(url: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(url, { ...opts, method: "DELETE" })
};

/**
 * Retrieves user information by user ID
 * @param userId - The ID of the user to retrieve
 * @returns Promise resolving to user data
 */
const getUserInfo = async (userId: UserId): Promise<User> => {
  return await api.get<User>(API_ENDPOINTS.USER_INFO(userId));
};

/**
 * Retrieves all water consumption records for a specific user
 * @param userId - The ID of the user whose records to retrieve
 * @returns Promise resolving to array of water records
 */
const getWaterRecords = async (userId: UserId): Promise<WaterRecord[]> => {
  return await api.get<WaterRecord[]>(API_ENDPOINTS.WATER_RECORDS(userId));
};

/**
 * Retrieves today's water consumption records for a specific user
 * @param userId - The ID of the user whose today's records to retrieve
 * @returns Promise resolving to array of today's water records
 */
const getTodayWaterRecords = async (userId: UserId): Promise<WaterRecord[]> => {
  return await api.get<WaterRecord[]>(API_ENDPOINTS.WATER_RECORDS_TODAY(userId));
};

/**
 * Retrieves the latest water consumption records for a specific user
 * @param userId - The ID of the user whose latest records to retrieve
 * @returns Promise resolving to array of latest water records
 */
const getLatestWaterRecords = async (userId: UserId): Promise<WaterRecord[]> => {
  return await api.get<WaterRecord[]>(API_ENDPOINTS.WATER_RECORDS_LATEST(userId));
};

/**
 * Retrieves all available stamps
 * @returns Promise resolving to array of stamps
 */
const getStamps = async (): Promise<Stamp[]> => {
  return await api.get<Stamp[]>(API_ENDPOINTS.STAMPS());
};

/**
 * Retrieves information about a specific stamp
 * @param stampId - The ID of the stamp to retrieve
 * @returns Promise resolving to stamp data
 */
const getStampInfo = async (stampId: StampId): Promise<Stamp> => {
  return await api.get<Stamp>(API_ENDPOINTS.STAMP_INFO(stampId));
};

/**
 * Retrieves stamps sent by a specific user
 * @param userId - The ID of the user whose sent stamps to retrieve
 * @returns Promise resolving to array of user stamp interactions
 */
const getStampsSentInfo = async (userId: UserId): Promise<UserStamp[]> => {
  return await api.get<UserStamp[]>(API_ENDPOINTS.STAMPS_SENT_INFO(userId));
};

/**
 * Creates a new user account
 * @param user - User data for the new account
 * @returns Promise resolving to the created user data
 */
const createUser = async (user: User): Promise<User> => {
  return await api.post<User>(API_ENDPOINTS.CREATE_USER(), user);
};

/**
 * Creates a new water consumption record for a user
 * @param userId - The ID of the user creating the record
 * @param record - Water consumption record data
 * @returns Promise resolving to the created water record
 */
const createWaterRecord = async (userId: UserId, record: WaterRecord): Promise<WaterRecord> => {
  return await api.post<WaterRecord>(API_ENDPOINTS.CREATE_WATER_RECORD(userId), record);
};

/**
 * Updates user information
 * @param userId - The ID of the user to update
 * @param user - Updated user data
 * @returns Promise resolving to the updated user data
 */
const updateUserInfo = async (userId: UserId, user: User): Promise<User> => {
  return await api.put<User>(API_ENDPOINTS.UPDATE_USER_INFO(userId), user);
};

/**
 * Updates a water consumption record
 * @param waterId - The ID of the water record to update
 * @param record - Updated water record data
 * @returns Promise resolving to the updated water record
 */
const updateWaterRecord = async (waterId: number, record: WaterRecord): Promise<WaterRecord> => {
  return await api.put<WaterRecord>(API_ENDPOINTS.UPDATE_WATER_RECORD(waterId), record);
};

/**
 * Exported API functions for use throughout the application
 * Provides a clean interface for all backend interactions
 */
export {
  createUser,
  createWaterRecord, getLatestWaterRecords, getStampInfo, getStamps, getStampsSentInfo, getTodayWaterRecords, getUserInfo,
  getWaterRecords, updateUserInfo,
  updateWaterRecord
};
