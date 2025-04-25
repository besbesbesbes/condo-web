import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import useUserStore from "../stores/user-store";
import { useNavigate } from "react-router-dom";
import { getUserInfoApi } from "../apis/user-api";
import ModalChangePassword from "../components/ModalChangePassword";

function Setting() {
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});

  const getUserInfo = async () => {
    try {
      const result = await getUserInfoApi(token);
      setUserInfo(result.data.user);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    }
  };

  useEffect(() => {
    setCurMenu("SETTING");
    getUserInfo();
  }, []);

  return (
    <div>
      <div className="w-screen h-[calc(100svh-60px)] bg-white overflow-y-auto flex flex-col gap-4 items-center relative">
        <div className="flex justify-center w-full sticky top-[0] z-10 bg-slate-100 shadow">
          <p className="text-2xl font-bold py-2">Setting</p>
        </div>
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[100px]  text-right pr-2 font-bold">User :</p>
          <p className="w-[150px] text-center border-b bg-slate-200">
            {userInfo.userName}
          </p>
        </div>
        <button
          className="w-[150px] border-1 bg-orange-500 text-white cursor-pointer py-1 "
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById("change_password_modal").showModal();
          }}
        >
          Change Password
        </button>
        <button
          className="w-[150px] border-1 bg-orange-700 text-white cursor-pointer py-1 "
          onClick={() => {
            setUser(null);
            setToken("");
            navigate(0);
          }}
        >
          Logout
        </button>
      </div>
      <Footer />
      {/* modal change password */}
      <dialog id="change_password_modal" className="modal">
        <ModalChangePassword />
      </dialog>
    </div>
  );
}

export default Setting;
