import React from "react";
import { useTranslation } from "react-i18next";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";
import {
  AppIcon,
  BuddyIcon,
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
      <div
        className="flex justify-center items-center gap-1 "
        onClick={() => navigate("/setting")}
      >
        <div
          className={`h-[30px] flex justify-center items-center convex bg-accent px-2`}
        >
          <p className="text-text-reverse">{user.userName}</p>
        </div>
        {!user?.buddyAsUser1?.[0]?.user2?.isDummy && (
          <>
            <BuddyIcon className="w-[20px] h-[20px]" />
            <div className="h-[30px] flex justify-center items-center convex bg-friend px-2">
              <p className="text-text-reverse">
                {user?.buddyAsUser1?.[0]?.user2?.userName}
              </p>
            </div>
          </>
        )}
        {/* setting */}
        <div className="w-[30px] h-[30px] convex-full flex justify-center items-center ml-1 text-text-reverse bg-primary">
          <SettingIcon className="w-[18px] h-[18px]" />
        </div>
      </div>
    </div>
  );
}

export default Header;
