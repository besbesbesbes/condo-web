import React, { useEffect } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";

function Report() {
  const setCurMenu = useMainStore((state) => state.setCurMenu);

  useEffect(() => {
    setCurMenu("REPORT");
  }, []);

  return (
    <div>
      <div className="w-screen h-[calc(100svh-60px)] bg-white overflow-y-auto flex flex-col gap-2 items-center relative">
        <div className="flex justify-center w-full sticky top-[0] z-10 bg-slate-100 shadow">
          <p className="text-2xl font-bold py-2">Report</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Report;
