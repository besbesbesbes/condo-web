import React, { useState } from "react";
import { CloseIcon, RegisterIcon } from "../icons/menuIcon";
import { useTranslation } from "react-i18next";
import useMainStore from "../stores/main-store";
import { login, registerApi } from "../apis/auth-api";
import AnimatedSection from "./AnimatedSection";

function ModalRegister({ onSuccess }) {
  const { t } = useTranslation();
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const [errMsg, setErrMsg] = useState("");
  const [isShowErrMsg, setIsShowErrMsg] = useState(false);
  const [input, setInput] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const hdlRegister = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    try {
      if (!input.userName.trim()) {
        return hdlError("Please enter username");
      }

      if (!input.password) {
        return hdlError("Please enter password");
      }

      if (input.password !== input.confirmPassword) {
        return hdlError("Password does not match");
      }
      await registerApi(input);
      const loginResult = await login({
        name: input.userName,
        password: input.password,
      });
      setInput({
        userName: "",
        password: "",
        confirmPassword: "",
      });
      onSuccess(loginResult);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
      hdlError(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const hdlChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const hdlError = (msg) => {
    setErrMsg(msg);
    setIsShowErrMsg(true);
    setTimeout(() => {
      setIsShowErrMsg(false);
    }, 2000);
  };

  return (
    <AnimatedSection
      index={0}
      className="w-[280px] h-auto bg-surface shadow-xl rounded-xl convex fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 text-xs items-center text-text  text-[15px]"
    >
      <AnimatedSection
        index={1}
        className="w-10/11 flex justify-start items-center gap-1"
      >
        <RegisterIcon className="w-[20px] h-[20px]" />
        <p className="text-lg">{t("register")}</p>
      </AnimatedSection>
      {/* input area */}
      {/* user name */}
      <AnimatedSection index={2} className="w-full flex justify-center">
        <input
          type="text"
          name="userName"
          value={input.userName}
          onChange={hdlChange}
          placeholder={t("userName")}
          className="w-7/11 h-[30px] concave bg-surface mt-1 pl-4 focus:outline-none text-[15px]"
        />
      </AnimatedSection>
      {/* password */}

      <AnimatedSection index={3} className="w-full flex justify-center">
        <input
          type="password"
          name="password"
          value={input.password}
          onChange={hdlChange}
          placeholder={t("password")}
          className="w-7/11 h-[30px] concave bg-surface mt-1  pl-4 focus:outline-none text-[15px]"
        />
      </AnimatedSection>
      {/* confirm password */}
      <AnimatedSection index={4} className="w-full flex justify-center">
        <input
          type="password"
          name="confirmPassword"
          value={input.confirmPassword}
          onChange={hdlChange}
          placeholder={t("confirmPassword")}
          className="w-7/11 h-[30px] concave bg-surface mt-1  pl-4 focus:outline-none text-[15px]"
        />
      </AnimatedSection>
      {/* error message */}
      {isShowErrMsg && (
        <AnimatedSection
          index={0}
          className="font-bold mt-1 text-accent text-[15px]"
        >
          {errMsg}
        </AnimatedSection>
      )}
      {/* button */}
      <AnimatedSection
        index={5}
        className="btn h-[30px] w-[130px] convex bg-primary font-bold mt-3 mb-1"
        onClick={hdlRegister}
      >
        {t("register")}
      </AnimatedSection>
      {/* close button */}
      <div
        className="w-[30px] h-[30px] convex-full flex justify-center items-center py-1 mt-2 absolute top-0 right-0 -translate-x-2 text-text-reverse bg-accent"
        onClick={() => {
          setInput({
            userName: "",
            password: "",
            confirmPassword: "",
          });
          document.getElementById("register_modal")?.close();
        }}
      >
        <CloseIcon className="p-1" />
      </div>
    </AnimatedSection>
  );
}

export default ModalRegister;
