import { type UserId } from "@/constants/api";
import { create } from "zustand";

type UserState = {
  userId: UserId | null;
  setUserId: (id: UserId) => void;
  clearUserId: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  setUserId: (id: UserId) => set({ userId: id }),
  clearUserId: () => set({ userId: null }),
}));
