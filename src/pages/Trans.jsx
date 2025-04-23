import React, { useEffect } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";

function Trans() {
  const setCurMenu = useMainStore((state) => state.setCurMenu);

  useEffect(() => {
    setCurMenu("TRANS");
  }, []);

  return (
    <div>
      <div className="w-screen h-[calc(100svh-60px)] bg-white overflow-y-auto">
        Trans
      </div>
      <Footer />
    </div>
  );
}

export default Trans;
