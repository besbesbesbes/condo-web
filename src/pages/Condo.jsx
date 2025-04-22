import React, { useEffect } from "react";
import useUserStore from "../stores/user-store";

function Condo() {
  const setToken = useUserStore((state) => state.setToken);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.zoom = "100%";
    document.documentElement.style.zoom = "100%";
  }, []);
  return (
    <div>
      Condo
      <button
        className="bg-amber-200 cursor-pointer"
        onClick={() => {
          setToken("");
        }}
      >
        Log out
      </button>
    </div>
  );
}

export default Condo;
