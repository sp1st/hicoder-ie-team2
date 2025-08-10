import { type UserStamp } from "@/constants/api";

export const NotificationData: UserStamp[] = [
  {
    user_stamp_id: 1,
    after_stamp: true,
    recieve_id: 2,
    sender_id: 2,
    stamp_id: 1,
    created_at: new Date("2025-08-01T12:00:00Z"),
    updated_at: new Date("2025-08-01T12:00:00Z"),
  },
  {
    user_stamp_id: 2,
    after_stamp: false,
    recieve_id: 1,
    sender_id: 2,
    stamp_id: 2,
    created_at: new Date("2025-08-02T12:00:00Z"),
    updated_at: new Date("2025-08-02T12:00:00Z"),
  },
  {
    user_stamp_id: 3,
    after_stamp: true,
    recieve_id: 2,
    sender_id: 3,
    stamp_id: 3,
    created_at: new Date("2025-08-10T11:00:00Z"),
    updated_at: new Date("2025-08-10T11:00:00Z"),
  },
];