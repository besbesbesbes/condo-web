import React from "react";
import { icons } from "../icons/menuIcon";
import useMainStore from "../stores/main-store";
import { useNavigate } from "react-router-dom";

function MenuBox({ icon: Icon, txt }) {
  const navigate = useNavigate();
  const curMenu = useMainStore((state) => state.curMenu);
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const hdlNavigate = (e, desPage) => {
    e.preventDefault();
    setCurMenu(desPage);
    navigate(`/${desPage}`);
  };

  return (
    <div
      className={`flex justify-center bg-surface items-center m-[6px] cursor-pointer convex ${
        txt === curMenu ? "bg-primary" : ""
      }`}
      onClick={(e) => {
        hdlNavigate(e, txt);
      }}
    >
      <div
        className={`flex flex-col items-center ${txt === curMenu ? "text-text-reverse" : ""}`}
      >
        <Icon className="w-[22px] h-[22px] translate-y-[2px]" />
        <p className="mt-1 text-[10px]">{txt}</p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-11/12 max-w-md h-[60px] grid grid-cols-5  text-text text-xs font-bold rounded-2xl bg-surface convex">
      <MenuBox txt="TRANS" icon={icons.TransIcon} />
      <MenuBox txt="NEW" icon={icons.NewIcon} />
      <MenuBox txt="REPORT" icon={icons.ReportIcon} />
      <MenuBox txt="CHAT" icon={icons.ChatIcon} />
      <MenuBox txt="SETTING" icon={icons.SettingIcon} />
      {/* <button onClick={() => console.log(curMenu)}>Test</button> */}
    </div>
  );
}

export default Footer;
