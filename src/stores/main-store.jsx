import { create } from "zustand";
const useMainStore = create((set) => ({
  curMenu: "",
  setCurMenu: (newVal) => set({ curMenu: newVal }),
  isLoad: false,
  setIsLoad: (newVal) => set({ isLoad: newVal }),
}));
export default useMainStore;
