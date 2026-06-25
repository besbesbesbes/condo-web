import React, { useEffect, useState, useRef } from "react";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import useMainStore from "../stores/main-store";
import useUserStore from "../stores/user-store";
import { useNavigate } from "react-router-dom";
import { getUserInfoApi } from "../apis/user-api";
import ModalChangePassword from "../components/ModalChangePassword";
import { testDB } from "../apis/test-api";
import { useTranslation } from "react-i18next";
import { Html5Qrcode } from "html5-qrcode";
import { exportReportApi } from "../apis/export-api";
import { AppIcon, SettingIcon } from "../icons/menuIcon";

function Setting() {
  const { t, i18n } = useTranslation();
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [testTxt, setTestTxt] = useState("");
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef(null);

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
    if (!scanning) {
      // Stop scanner if it exists
      html5QrCodeRef.current?.stop().catch(() => {});
      html5QrCodeRef.current = null;
      return;
    }

    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCodeRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          html5QrCode.stop();
          setScanning(false);
          // Navigate or do whatever with the decoded text
          window.location.href = decodedText;
        },
        (error) => {
          // Optional: console.log("QR scan error", error);
        },
      )
      .catch((err) => {
        console.error("Camera start failed", err);
        setScanning(false);
      });

    return () => {
      if (
        html5QrCodeRef.current &&
        html5QrCodeRef.current.getState &&
        html5QrCodeRef.current.getState() === 2
      ) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
      html5QrCodeRef.current = null;
    };
  }, [scanning]);

  const hdlQRScan = () => {
    if (!scanning) setScanning(true);
  };

  const handleStopScan = async () => {
    try {
      if (
        html5QrCodeRef.current &&
        html5QrCodeRef.current.getState &&
        html5QrCodeRef.current.getState() === 2 // 2 means SCANNING
      ) {
        await html5QrCodeRef.current.stop();
      }
    } catch (err) {
      console.warn("Stop error:", err.message);
    } finally {
      html5QrCodeRef.current = null;
      setScanning(false);
    }
  };

  const hdlExportReport = async () => {
    setIsLoad(true);
    try {
      const result = await exportReportApi(token);
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
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
      {scanning ? (
        <>
          <div
            id="qr-reader"
            className="fixed inset-0 z-[9999] w-screen h-[calc(100svh-70px)] bg-overlay flex items-center justify-center"
          ></div>
          <button
            onClick={handleStopScan}
            className="btn btn-accent absolute z-[9999] top-4 right-4"
          >
            {t("close")}
          </button>
        </>
      ) : (
        <div className="w-screen bg-app overflow-y-auto flex flex-col gap-7 items-center relative mb-[75px] mt-[60px]">
          <div className="flex justify-between px-3 items-center w-full fixed h-[50px] top-[0] z-10 bg-surface shadow">
            <div className="flex items-center">
              <div className="w-[30px] h-[30px] convex-full bg-primary flex justify-center items-center">
                <AppIcon className="w-[20px] h-[20px] text-text-reverse" />
              </div>
              <SettingIcon className="w-[30px] h-[20px]" />
              <p className="text-xl py-2">{t("setting")}</p>
            </div>
            <div
              className={`w-[30px] h-[30px] flex justify-center items-center convex bg-primary ${user.userName?.[0]?.toUpperCase() === "K" ? "bg-primary" : "bg-accent"}`}
            >
              <p className="text-text-reverse">
                {user.userName?.[0]?.toUpperCase()}
              </p>
            </div>
          </div>
          <div className=" w-10/12 flex justify-center items-center gap-2 mt-4">
            <p className="w-[100px] text-right pr-2 font-bold">
              {t("userName")} :
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-[30px] h-[30px] flex justify-center items-center convex bg-primary ${user.userName?.[0]?.toUpperCase() === "K" ? "bg-primary" : "bg-accent"}`}
              >
                <p className="text-text-reverse">
                  {user.userName?.[0]?.toUpperCase()}
                </p>
              </div>
              <p className="">{userInfo.userName}</p>
            </div>
          </div>
          {/* switch theme */}
          <ThemeToggle />
          {/* change password */}
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
          {/* change language */}
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
              {/* <option value="cn">中国人</option> */}
              {/* <option value="jp">日语</option> */}
            </select>
          </div>
          {/* logout */}
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

          {/* version */}
          <p className="text-xs">V 1.7.1</p>
          {/* <button className="btn-secondary w-[150px]" onClick={hdlTestDB}>
            {t("testDB")}
          </button> */}
          {/* {testTxt ? <p className="font-bold text-error">{testTxt}</p> : null} */}
          {/* QR Scan */}
          {/* <button className="btn-secondary w-[150px]" onClick={hdlQRScan}>
            {t("qrScan")}
          </button> */}
          {/* Export Report */}
          {/* <button className="btn-secondary w-[150px]" onClick={hdlExportReport}>
            Export Report
          </button> */}
        </div>
      )}

      <Footer />
      {/* modal change password */}
      <dialog id="change_password_modal" className="modal">
        <ModalChangePassword />
      </dialog>
    </div>
  );
}

export default Setting;
