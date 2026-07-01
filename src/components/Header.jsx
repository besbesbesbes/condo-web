import React from "react";
import { useTranslation } from "react-i18next";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";
import {
  AppIcon,
  CalendarIcon,
  MemoIcon,
  NewIcon,
  ReportIcon,
  SettingIcon,
  TransIcon,
} from "../icons/menuIcon";
import { useNavigate } from "react-router-dom";

const menuIcons = {
  trans: TransIcon,
  add: NewIcon,
  report: ReportIcon,
  calendar: CalendarIcon,
  memo: MemoIcon,
};

function Header() {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const curMenu = useMainStore((state) => state.curMenu);
  const Icon = menuIcons[curMenu] || TransIcon;

  return (
    <div className="flex justify-between px-3 items-center w-full fixed h-[50px] top-0 z-50 bg-surface shadow">
      <div className="flex items-center">
        <div
          className="w-[30px] h-[30px] convex-full bg-primary flex justify-center items-center"
          onClick={() => navigate(0)}
        >
          <AppIcon className="w-[20px] h-[20px] text-text-reverse" />
        </div>
        <Icon className="w-[30px] h-[20px]" />
        <p className="text-xl py-2">{t(curMenu)}</p>
      </div>
      <div className="flex justify-center items-center gap-1">
        {/* <p>{user.userName}</p> */}
        <div
          className={`w-[30px] h-[30px] flex justify-center items-center convex bg-primary ${user.userName?.[0]?.toUpperCase() === "K" ? "bg-primary" : "bg-accent"}`}
        >
          <p className="text-text-reverse">
            {user.userName?.[0]?.toUpperCase()}
          </p>
        </div>
        {/* setting */}
        <div
          className="w-[30px] h-[30px] convex-full bg-surface flex justify-center items-center"
          onClick={() => navigate("/setting")}
        >
          <SettingIcon className="w-[20px] h-[20px]" />
        </div>
      </div>
    </div>
  );
}

export default Header;
