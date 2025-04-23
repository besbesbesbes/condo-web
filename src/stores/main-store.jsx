import { create } from "zustand";
const useMainStore = create((set) => ({
  curMenu: "",
  setCurMenu: (newVal) => set({ curMenu: newVal }),
}));
export default useMainStore;
