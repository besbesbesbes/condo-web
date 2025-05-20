import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import useUserStore from "../stores/user-store";
import { useNavigate } from "react-router-dom";
import { getUserInfoApi } from "../apis/user-api";
import ModalChangePassword from "../components/ModalChangePassword";
import { testDB } from "../apis/test-api";
import { useTranslation } from "react-i18next";

function Setting() {
  const { t } = useTranslation();
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [testTxt, setTestTxt] = useState("");
  const setIsLoad = useMainStore((state) => state.setIsLoad);

  const getUserInfo = async () => {
    setIsLoad(true);
    try {
      const result = await getUserInfoApi(token);
      setUserInfo(result.data.user);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const hdlTestDB = async () => {
    setIsLoad(true);
    try {
      const result = await testDB();
      setTestTxt(result.data.test.test);

      setTimeout(() => {
        setTestTxt("");
      }, 500);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    setCurMenu("SETTING");
    getUserInfo();
  }, []);

  return (
    <div>
      <div className="w-screen h-[calc(100svh-70px)] bg-white overflow-y-auto flex flex-col gap-4 items-center relative">
        <div className="flex justify-center w-full sticky top-[0] z-10 bg-slate-100 shadow">
          <p className="text-2xl font-bold py-2">{t("setting")}</p>
        </div>
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[100px]  text-right pr-2 font-bold">
            {" "}
            {t("userName")} :
          </p>
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
          {t("changePassword")}
        </button>
        <button
          className="w-[150px] border-1 bg-orange-700 text-white cursor-pointer py-1 "
          onClick={() => {
            setUser(null);
            setToken("");
            navigate(0);
          }}
        >
          {t("logout")}
        </button>
        {/* version */}
        <p className="text-xs">V 1.1.1</p>
        <button
          className="w-[150px] border-1 bg-slate-700 text-white cursor-pointer py-1 "
          onClick={hdlTestDB}
        >
          {t("testDB")}
        </button>
        {testTxt ? <p className="font-bold text-red-500">{testTxt}</p> : null}
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
