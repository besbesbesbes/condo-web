import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";

function Calendar() {
  const setCurMenu = useMainStore((state) => state.setCurMenu);

  useEffect(() => {
    setCurMenu("calendar");
  }, []);
  return (
    <div className="w-screen bg-app overflow-y-auto flex flex-col gap-2 items-center relative mb-[75px] mt-[50px]">
      {/* header */}
      <Header />
      Calendar
      <Footer />
    </div>
  );
}

export default Calendar;
