import React, { useEffect } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";

function New() {
  const setCurMenu = useMainStore((state) => state.setCurMenu);

  useEffect(() => {
    setCurMenu("NEW");
  }, []);

  return (
    <div>
      <div className="w-screen h-[calc(100svh-60px)] bg-white overflow-y-auto">
        New
      </div>
      <Footer />
    </div>
  );
}

export default New;
