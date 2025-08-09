const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  USER_INFO: (userId: string) => `${API_BASE_URL}/users/${userId}`,
  WATER_RECORDS: (userId: string) => `${API_BASE_URL}/water_records/${userId}`,
};
type UserId = number;
export type User = {
  user_id: UserId,
  user_name: string,
  bio: string,
  X: string,
  photo_url: string,
  password_hash: string,
}
export type water_record = {
  water_id: number,
  water_date: Date,
  water_type: string,
  water_amount: number,
  lat: number,
  lon: number,
  comment: string,
  user_id: UserId
}
export type user_stamp = {
  user_stamp_id: number,
  after_stamp: boolean,
  recieve_id: UserId,
  sender_id: UserId,
  stamp_id: number,
  created_at: Date,
  updated_at: Date
}
export type stamp = {
  stamp_id: number,
  message: string,
  image_url: string
}

export const getUserData: (userId: string) => Promise<User | null> = (userId: string) => {
  return fetch(API_ENDPOINTS.USER_INFO(userId))
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching user data:", error);
      return null;
    });
};

// fetch
// useEffect(() => {
//   const userId = "2"; // Replace with actual user ID
//   getUserData(userId).then((data) => {
//     if (data) {
//       setUserData(data);
//     }
//     setLoading(false);
//   });
// }, []);
