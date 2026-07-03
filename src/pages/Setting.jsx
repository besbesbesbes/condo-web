import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import useMainStore from "../stores/main-store";
import useUserStore from "../stores/user-store";
import { useNavigate } from "react-router-dom";
import { getUserInfoApi } from "../apis/user-api";
import ModalChangePassword from "../components/ModalChangePassword";
import { useTranslation } from "react-i18next";
import {
  PendingBuddyIcon,
  BuddyIcon,
  RequestBuddyIcon,
} from "../icons/menuIcon";
import Header from "../components/Header";
import { requestBuddyApi } from "../apis/buddy-api";

function Setting() {
  const { t, i18n } = useTranslation();
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const [buddyName, setBuddyName] = useState("");
  const [buddyStatus, setBuddyStatus] = useState("NONE");
  const [isBuddyEdited, setIsBuddyEdited] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isShowErrMsg, setIsShowErrMsg] = useState(false);

  const showMessage = (msg) => {
    setErrMsg(msg);
    setIsShowErrMsg(true);
    setTimeout(() => {
      setIsShowErrMsg(false);
    }, 2000);
  };

  const getUserInfo = async () => {
    setIsLoad(true);
    try {
      const result = await getUserInfoApi(token);
      const buddy = result.data.buddy || { buddyName: "", status: "NONE" };

      setBuddyName(buddy.buddyName || "");
      setBuddyStatus(buddy.status || "NONE");
      setIsBuddyEdited(false);
    } catch (err) {
      showMessage(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const hdlRequestBuddy = async () => {
    if (!buddyName.trim()) {
      showMessage(t("registerBuddy"));
      return;
    }

    if (buddyName.trim().toLowerCase() === user.userName.toLowerCase()) {
      showMessage("You cannot request yourself");
      return;
    }

    setIsLoad(true);

    try {
      const result = await requestBuddyApi(token, {
        targetUserName: buddyName.trim(),
      });

      showMessage(result.data.msg);
      await getUserInfo();
    } catch (err) {
      showMessage(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    setCurMenu("setting");
    getUserInfo();
  }, []);

  const displayStatus = isBuddyEdited ? "REQUEST" : buddyStatus;
  const canEditBuddy = displayStatus !== "PENDING";
  const canRequestBuddy =
    displayStatus === "REQUEST" || displayStatus === "NONE";

  return (
    <div>
      <div className="w-screen bg-app overflow-y-auto flex flex-col gap-7 items-center relative mb-[75px] mt-[60px]">
        <Header />
        <div className=" w-10/12 flex justify-center items-center gap-2 mt-4">
          <p className="w-[100px] text-right pr-2 font-bold">
            {t("userName")} :
          </p>
          <div className="flex items-center gap-2">
            <div
              className={`h-[30px] flex justify-center items-center convex bg-accent px-2`}
            >
              <p className="text-text-reverse">{user.userName}</p>
            </div>
            {!user?.buddyAsUser1[0]?.user2?.isDummy && (
              <>
                <BuddyIcon className="w-[20px] h-[20px]" />
                <div
                  className={`h-[30px] flex justify-center items-center convex bg-friend px-2`}
                >
                  <p className="text-text-reverse">
                    {user?.buddyAsUser1[0]?.user2?.userName}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-9/11 flex items-center justify-between rounded-2xl relative">
          <div>
            <p className="font-bold">{t("buddy")}</p>
            <p className="text-sm">
              {displayStatus === "REQUEST" || displayStatus === "NONE"
                ? t("registerBuddy")
                : displayStatus === "PENDING"
                  ? t("waitBuddyMatchWithYou")
                  : t("youHaveBuddyNow")}
            </p>
          </div>
          <input
            className="input-field w-[150px] concave px-2 h-[30px] bg-surface pl-4"
            type="text"
            value={buddyName}
            readOnly={!canEditBuddy}
            onChange={(e) => {
              if (!canEditBuddy) return;
              setBuddyName(e.target.value);
              setIsBuddyEdited(true);
            }}
          />
          <div
            className={`w-[26px] h-[26px] convex absolute right-1 flex justify-center items-center ${
              displayStatus === "REQUEST" || displayStatus === "NONE"
                ? "bg-primary"
                : displayStatus === "PENDING"
                  ? "bg-accent"
                  : "bg-friend"
            } ${canRequestBuddy ? "cursor-pointer" : "cursor-default"}`}
            onClick={() => {
              if (canRequestBuddy) {
                hdlRequestBuddy();
              }
            }}
          >
            {displayStatus === "REQUEST" || displayStatus === "NONE" ? (
              <RequestBuddyIcon className="w-[20px] h-[20px] text-text-reverse" />
            ) : displayStatus === "PENDING" ? (
              <PendingBuddyIcon className="w-[20px] h-[20px] text-text-reverse" />
            ) : (
              <BuddyIcon className="w-[20px] h-[20px] text-text-reverse" />
            )}
          </div>
        </div>
        {isShowErrMsg && (
          <p className="text-sm text-red-500 w-9/11 text-center">{errMsg}</p>
        )}
        <ThemeToggle />
        <div className="w-9/11 flex items-center justify-between rounded-2xl">
          <div>
            <p className="font-bold">{t("password")}</p>
            <p className="text-sm">{t("changePassword")}</p>
          </div>
          <button
            className="btn btn-primary w-[150px] text-text-reverse"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("change_password_modal").showModal();
            }}
          >
            {t("changePassword")}
          </button>
        </div>
        <div className="w-9/11 flex items-center justify-between rounded-2xl">
          <div>
            <p className="font-bold">{t("changeLanguage")}</p>
            <p className="text-sm text-muted"></p>
          </div>
          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="input-field convex h-[30px] w-[150px] px-2 bg-primary text-text-reverse"
            value={i18n.language}
          >
            <option className="text-center" value="en">
              English
            </option>
            <option className="text-center" value="th">
              ภาษาไทย
            </option>
          </select>
        </div>
        <div className="w-9/11 flex items-center justify-between rounded-2xl">
          <div>
            <p className="font-bold">{t("logout")}</p>
            <p className="text-sm text-muted"></p>
          </div>
          <button
            className="btn btn-primary text-text-reverse w-[150px]"
            onClick={() => {
              setUser(null);
              setToken("");
              navigate(0);
            }}
          >
            {t("logout")}
          </button>
        </div>
        <p className="text-xs">V 1.9.1</p>
      </div>

      <Footer />
      <dialog id="change_password_modal" className="modal">
        <ModalChangePassword />
      </dialog>
    </div>
  );
}

export default Setting;
