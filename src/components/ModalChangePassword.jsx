import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../apis/user-api";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";
import { CloseIcon, TypeIcon, PasswordIcon } from "../icons/menuIcon";
import AnimatedSection from "./AnimatedSection";
import { useTranslation } from "react-i18next";

function ModalChangePassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const [errMsg, setErrMsg] = useState("");
  const [isShowErrMsg, setIsShowErrMsg] = useState(false);
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const [input, setInput] = useState({
    curPass: "",
    newPass: "",
    conPass: "",
  });
  const hdlInput = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };
  const hdlError = (msg) => {
    setErrMsg(msg);
    setIsShowErrMsg(true);
    setTimeout(() => {
      setIsShowErrMsg(false);
    }, 2000);
  };
  const hdlChangePass = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    try {
      // validate
      if (
        !(input.curPass.trim() && input.newPass.trim() && input.conPass.trim())
      ) {
        hdlError("Please input all type of password?");
        return;
      }
      // call api
      const body = {
        curPass: input.curPass,
        newPass: input.newPass,
        conPass: input.conPass,
      };
      const result = await changePasswordApi(token, body);
      console.log(result);
      setUser(null);
      setToken("");
      navigate(0);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
      hdlError(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  return (
    <AnimatedSection
      index={0}
      className="w-[300px] h-auto bg-surface shadow-xl rounded-xl concave fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 items-center text-text px-4"
    >
      <div className="w-full flex justify-center items-center gap-1 mb-3">
        <PasswordIcon className="w-[20px] h-[20px]" />
        <p className="text-lg">{t("changePassword")}</p>
      </div>
      <AnimatedSection
        index={1}
        className=" w-full flex justify-center items-center"
      >
        <p className="w-[150px] text-right pr-5 flex-none">
          {t("currentPassword")} :
        </p>
        <input
          className="input-field w-[130px] concave pl-4"
          type="password"
          name="curPass"
          value={input.curPass}
          onChange={hdlInput}
        />
      </AnimatedSection>
      <AnimatedSection
        index={2}
        className=" w-full flex justify-center items-center"
      >
        <p className="w-[150px] text-right pr-5 flex-none">
          {t("newPassword")} :
        </p>
        <input
          className="input-field w-[130px] concave pl-4"
          type="password"
          name="newPass"
          value={input.newPass}
          onChange={hdlInput}
        />
      </AnimatedSection>
      <AnimatedSection
        index={3}
        className=" w-full flex justify-center items-center"
      >
        <p className="w-[150px] text-right pr-5 flex-none">
          {t("confirmPassword")} :
        </p>
        <input
          className="input-field w-[130px] concave pl-4"
          type="password"
          name="conPass"
          value={input.conPass}
          onChange={hdlInput}
        />
      </AnimatedSection>
      <AnimatedSection
        index={4}
        className="btn btn-primary w-[130px] mt-2 text-text-reverse  text-base"
        onClick={hdlChangePass}
      >
        {t("confirm")}
      </AnimatedSection>
      {/* error message */}
      {isShowErrMsg && <p className="font-bold">{errMsg}</p>}
      {/* <button
        className="btn btn-primary w-[130px] mt-2"
        onClick={() => console.log(input)}
      >
        input
      </button> */}
      {/* close button */}

      <button
        className="w-[30px] h-[30px] convex-full flex justify-center items-center py-1 mt-2 absolute top-0 right-0 -translate-x-2 text-text-reverse bg-accent"
        onClick={(e) => {
          setInput({
            curPass: "",
            newPass: "",
            conPass: "",
          });
          e.target.closest("dialog").close();
        }}
      >
        <CloseIcon className="p-1" />
      </button>
    </AnimatedSection>
  );
}

export default ModalChangePassword;
