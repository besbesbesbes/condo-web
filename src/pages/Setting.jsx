import React, { useEffect, useState, useRef } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import useUserStore from "../stores/user-store";
import { useNavigate } from "react-router-dom";
import { getUserInfoApi } from "../apis/user-api";
import ModalChangePassword from "../components/ModalChangePassword";
import { testDB } from "../apis/test-api";
import { useTranslation } from "react-i18next";
import { Html5Qrcode } from "html5-qrcode";
import { exportReportApi } from "../apis/export-api";

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
        }
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
            className="fixed inset-0 z-[9999] w-screen h-[calc(100svh-70px)] bg-black flex items-center justify-center"
          ></div>
          <button
            onClick={handleStopScan}
            className="absolute z-[9999] top-4 right-4 px-4 py-2 bg-red-600 text-white rounded shadow cursor-pointer"
          >
            {t("close")}
          </button>
        </>
      ) : (
        <div className="w-screen  bg-white overflow-y-auto flex flex-col gap-4 items-center relative  mb-[75px] mt-[60px]">
          <div className="flex justify-center w-full fixed h-[50px] top-[0] z-10 bg-slate-100 shadow">
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
          <p className="text-xs">V 1.4.0</p>
          <button
            className="w-[150px] border-1 bg-slate-700 text-white cursor-pointer py-1 "
            onClick={hdlTestDB}
          >
            {t("testDB")}
          </button>
          {testTxt ? <p className="font-bold text-red-500">{testTxt}</p> : null}
          {/* QR Scan */}
          <button
            className="w-[150px] border-1 bg-slate-700 text-white cursor-pointer py-1 "
            onClick={hdlQRScan}
          >
            {t("qrScan")}
          </button>
          {/* Export Report */}
          <button
            className="w-[150px] border-1 bg-slate-700 text-white cursor-pointer py-1 "
            onClick={hdlExportReport}
          >
            Export Report
          </button>
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
