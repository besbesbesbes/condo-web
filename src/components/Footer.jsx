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
      className={`flex justify-center items-center cursor-pointer ${
        txt === curMenu ? "bg-slate-300" : ""
      }`}
      onClick={(e) => {
        hdlNavigate(e, txt);
      }}
    >
      <div
        className={`flex flex-col items-center ${
          txt === curMenu ? "text-slate-700" : ""
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
    <div className="bg-slate-700 w-screen h-[60px] grid grid-cols-4 text-white font-bold text-xs">
      <MenuBox txt="TRANS" icon={icons.TransIcon} />
      <MenuBox txt="NEW" icon={icons.NewIcon} />
      <MenuBox txt="REPORT" icon={icons.ReportIcon} />
      <MenuBox txt="SETTING" icon={icons.SettingIcon} />
      {/* <button onClick={() => console.log(curMenu)}>Test</button> */}
    </div>
  );
}

export default Footer;
