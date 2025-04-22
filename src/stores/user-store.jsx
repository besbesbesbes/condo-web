import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
const useUserStore = create(
  persist(
    (set) => ({
      user: {},
      setUser: (newVal) => set({ user: newVal }),
      token: "",
      setToken: (newVal) => set({ token: newVal }),
    }),
    {
      name: "userState",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useUserStore;
