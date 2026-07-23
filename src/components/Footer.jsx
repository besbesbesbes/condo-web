import React, { useEffect } from "react";
import { icons } from "../icons/menuIcon";
import useMainStore from "../stores/main-store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MenuBox({ icon: Icon, txt, label }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const curMenu = useMainStore((state) => state.curMenu);
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const hdlNavigate = (e, desPage) => {
    e.preventDefault();
    setCurMenu(desPage);
    const path = `/${desPage}`;
    if (location.pathname === path) {
      window.location.reload(); // refresh the current page
      return;
    }

    navigate(`/${desPage}`);
  };

  return (
    <div
      className={`flex justify-center bg-surface items-center mx-[10px] mt-[8px] my-[12px] cursor-pointer  ${
        txt === curMenu ? "bg-primary convex" : ""
      }`}
      onClick={(e) => {
        hdlNavigate(e, txt);
      }}
    >
      <div
        className={`flex flex-col items-center ${txt === curMenu ? "text-text-reverse" : ""}`}
      >
        <Icon className="w-[22px] h-[22px] translate-y-[2px]" />
        <p className="mt-1 text-[11px]">{label}</p>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useTranslation();
  useEffect(() => {
    console.log("Footer");
  }, []);
  return (
    // <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-11/12 max-w-md h-[60px] grid grid-cols-5  text-text text-xs font-bold rounded-2xl bg-surface convex">
    <div className="fixed bottom-0 w-full h-[70px] grid grid-cols-5 text-gray-600 text-xs font-bold bg-surface px-2">
      <MenuBox txt="trans" label={t("trans")} icon={icons.TransIcon} />
      <MenuBox txt="add" label={t("add")} icon={icons.NewIcon} />
      <MenuBox txt="report" label={t("report")} icon={icons.ReportIcon} />
      <MenuBox txt="calendar" label={t("calendar")} icon={icons.CalendarIcon} />
      <MenuBox txt="memo" label={t("memo")} icon={icons.MemoIcon} />
    </div>
  );
}

export default Footer;
