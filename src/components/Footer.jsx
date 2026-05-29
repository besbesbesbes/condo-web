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
      className={`flex justify-center items-start py-1 cursor-pointer ${
        txt === curMenu ? "bg-surface-soft" : ""
      }`}
      onClick={(e) => {
        hdlNavigate(e, txt);
      }}
    >
      <div
        className={`flex flex-col items-center ${
          txt === curMenu ? "text-primary" : ""
        }`}
      >
        <Icon className="w-[30px] h-[30px]" />
        <p className="mt-1">{txt}</p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-surface w-screen h-[70px] grid grid-cols-5 text-white font-bold text-xs fixed bottom-0 border-t border-surface-soft">
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
