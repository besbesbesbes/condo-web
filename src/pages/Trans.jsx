import React from "react";
import Footer from "../components/Footer";
import useUserStore from "../stores/user-store";
import { useNavigate } from "react-router-dom";

function Trans() {
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const navigate = useNavigate();
  return (
    <div>
      <div className="w-screen h-[calc(100svh-60px)] bg-white overflow-y-auto">
        Trans
        <button
          className="cursor-pointer bg-amber-400"
          onClick={() => {
            setUser(null);
            setToken("");
            navigate(0);
          }}
        >
          LogOut
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Trans;
