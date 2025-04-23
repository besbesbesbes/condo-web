import { create } from "zustand";
const useMainStore = create((set) => ({
  curMenu: "TRANS",
  setCurMenu: (newVal) => set({ curMenu: newVal }),
}));
export default useMainStore;
