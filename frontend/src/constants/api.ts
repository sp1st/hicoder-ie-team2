const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  // GET
  USER_INFO: (userId: UserId) => `${API_BASE_URL}/users/${userId}`,
  NEAR_USERS_INFO: () => `${API_BASE_URL}/users/nearby`,
  WATER_RECORDS: (userId: UserId) => `${API_BASE_URL}/water_records/${userId}`,
  WATER_RECORDS_TODAY: (userId: UserId) => `${API_BASE_URL}/water_records/today/${userId}`,
  WATER_RECORDS_LATEST: (userId: UserId) => `${API_BASE_URL}/water_records/now/${userId}`,
  STAMPS: () => `${API_BASE_URL}/stamps`,
  STAMP_INFO: (stampId: StampId) => `${API_BASE_URL}/stamps/${stampId}`,
  STAMPS_SENT_INFO: (userId: UserId) => `${API_BASE_URL}/stamps/send/${userId}`,
  // POST
  CREATE_USER: () => `${API_BASE_URL}/users`,
  CREATE_WATER_RECORD: (userId: UserId) => `${API_BASE_URL}/water_records/${userId}`,
  SEND_STAMP: (sender_id: UserId, receiver_id: UserId, stamp_id: StampId) => `${API_BASE_URL}/stamps/send`,
  // PUT
  UPDATE_USER_INFO: (userId: UserId) => `${API_BASE_URL}/users/${userId}`,
  UPDATE_WATER_RECORD: (waterId: number) => `${API_BASE_URL}/water_records/${waterId}`,
  RESPOND_STAMP: (userStampId: number) => `${API_BASE_URL}/stamps/apply/${userStampId}`
};

export type UserId = number;
export type StampId = number;
export type User = {
  user_id: UserId,
  user_name: string,
  bio: string | "null",
  X: string | "null",
  photo_url: string | "null",
  password_hash: string,
}
export type WaterRecord = {
  water_id: number,
  water_date: Date,
  water_type: string,
  water_amount: number,
  lat: number,
  lon: number,
  comment: string,
  user_id: UserId
}
export type UserStamp = {
  user_stamp_id: number,
  after_stamp: boolean,
  recieve_id: UserId,
  sender_id: UserId,
  stamp_id: number | "null",
  created_at: Date,
  updated_at: Date
}
export type Stamp = {
  stamp_id: number,
  message: string,
  image_url: string
}

// --- Error shape ---
export class ApiError extends Error {
  status?: number;
  body?: unknown;
  constructor(message: string, status?: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// --- Minimal runtime checking (optional) ---
// You can pass a user-provided guard like: (x: unknown): x is User => ...
export type TypeGuard<T> = (x: unknown) => x is T;

// --- Core request helper ---
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number; // optional per-call timeout
  guard?: TypeGuard<any>; // optional runtime guard
};

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

// --- Thin convenience layer ---
export const api = {
  get: <T>(url: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(url, { ...opts, method: "GET" }),
  post: <T>(url: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(url, { ...opts, method: "POST", body }),
  put: <T>(url: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(url, { ...opts, method: "PUT", body }),
  patch: <T>(url: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(url, { ...opts, method: "PATCH", body }),
  delete: <T>(url: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(url, { ...opts, method: "DELETE" })
};

// USER_INFO: (userId: UserId) => `${API_BASE_URL}/users/${userId}`,
const getUserInfo = async (userId: UserId): Promise<User> => {
  return await api.get<User>(API_ENDPOINTS.USER_INFO(userId));
};
// NEAR_USERS_INFO: () => `${API_BASE_URL}/users/nearby`,
// WATER_RECORDS: (userId: UserId) => `${API_BASE_URL}/water_records/${userId}`,
const getWaterRecords = async (userId: UserId): Promise<WaterRecord[]> => {
  return await api.get<WaterRecord[]>(API_ENDPOINTS.WATER_RECORDS(userId));
};
// WATER_RECORDS_TODAY: (userId: UserId) => `${API_BASE_URL}/water_records/today/${userId}`,
const getTodayWaterRecords = async (userId: UserId): Promise<WaterRecord[]> => {
  return await api.get<WaterRecord[]>(API_ENDPOINTS.WATER_RECORDS_TODAY(userId));
};
// WATER_RECORDS_LATEST: (userId: UserId) => `${API_BASE_URL}/water_records/now/${userId}`,
const getLatestWaterRecords = async (userId: UserId): Promise<WaterRecord[]> => {
  return await api.get<WaterRecord[]>(API_ENDPOINTS.WATER_RECORDS_LATEST(userId));
};
// STAMPS: () => `${API_BASE_URL}/stamps`,
const getStamps = async (): Promise<Stamp[]> => {
  return await api.get<Stamp[]>(API_ENDPOINTS.STAMPS());
};
// STAMP_INFO: (stampId: StampId) => `${API_BASE_URL}/stamps/${stampId}`,
const getStampInfo = async (stampId: StampId): Promise<Stamp> => {
  return await api.get<Stamp>(API_ENDPOINTS.STAMP_INFO(stampId));
};
// STAMPS_SENT_INFO: (userId: UserId) => `${API_BASE_URL}/stamps/send/${userId}`,
const getStampsSentInfo = async (userId: UserId): Promise<UserStamp[]> => {
  return await api.get<UserStamp[]>(API_ENDPOINTS.STAMPS_SENT_INFO(userId));
};
// // POST
// CREATE_USER: () => `${API_BASE_URL}/users`,
const createUser = async (user: User): Promise<User> => {
  return await api.post<User>(API_ENDPOINTS.CREATE_USER(), user);
};
// CREATE_WATER_RECORD: (userId: UserId) => `${API_BASE_URL}/water_records/${userId}`,
const createWaterRecord = async (userId: UserId, record: WaterRecord): Promise<WaterRecord> => {
  return await api.post<WaterRecord>(API_ENDPOINTS.CREATE_WATER_RECORD(userId), record);
};
// SEND_STAMP: (sender_id: UserId, receiver_id: UserId, stamp_id: StampId) => `${API_BASE_URL}/stamps/send`,
// // PUT
// UPDATE_USER_INFO: (userId: UserId) => `${API_BASE_URL}/users/${userId}`,
const updateUserInfo = async (userId: UserId, user: User): Promise<User> => {
  return await api.put<User>(API_ENDPOINTS.UPDATE_USER_INFO(userId), user);
};
// UPDATE_WATER_RECORD: (waterId: number) => `${API_BASE_URL}/water_records/${waterId}`,
const updateWaterRecord = async (waterId: number, record: WaterRecord): Promise<WaterRecord> => {
  return await api.put<WaterRecord>(API_ENDPOINTS.UPDATE_WATER_RECORD(waterId), record);
};
// RESPOND_STAMP: (userStampId: number) => `${API_BASE_URL}/stamps/apply/${userStampId}`
export {
  getUserInfo, getWaterRecords, getTodayWaterRecords, getLatestWaterRecords, createUser, createWaterRecord, updateUserInfo, updateWaterRecord, getStamps, getStampInfo, getStampsSentInfo
};