import { useState } from "react";
import useUserStore from "../stores/user-store";
import { login } from "../apis/auth-api";
import { useNavigate } from "react-router-dom";
import useMainStore from "../stores/main-store";
import { useTranslation } from "react-i18next";
import { AppIcon } from "../icons/menuIcon";
import ModalRegister from "../components/ModalRegister";
import AnimatedDiv from "../components/AnimatedDiv";

function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const setToken = useUserStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);
  const [input, setInput] = useState({
    inputUser: "",
    inputPassword: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [isShowErrMsg, setIsShowErrMsg] = useState(false);
  const setIsLoad = useMainStore((state) => state.setIsLoad);

  const hdlInput = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };
  const hdlLogin = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    try {
      // validate
      if (!(input.inputUser.trim() && input.inputPassword.trim())) {
        hdlError("Please input user and password?");
        return;
      }
      // call api
      const body = { name: input.inputUser, password: input.inputPassword };
      const result = await login(body);
      setToken(result.data.token);
      setUser(result.data.user);
      navigate(0);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
      hdlError(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const openRegisterModal = () => {
    document.getElementById("register_modal")?.show();
  };

  const hdlRegisterSuccess = (result) => {
    setToken(result.data.token);
    setUser(result.data.user);
    document.getElementById("register_modal")?.close();
    navigate(0);
  };

  const hdlError = (msg) => {
    setErrMsg(msg);
    setIsShowErrMsg(true);
    setTimeout(() => {
      setIsShowErrMsg(false);
    }, 2000);
  };

  return (
    <div className="bg-app w-screen h-svh flex items-center justify-center text-sm">
      {/* login card */}
      <AnimatedDiv
        className="bg-surface w-[300px] h-auto m-auto flex flex-col items-center gap-4 px-4 pt-8 pb-2 convex -translate-y-[50px]"
        idx={0}
      >
        <AnimatedDiv className="flex items-end-safe gap-2" idx={0}>
          <AnimatedDiv
            className="w-[80px] h-[80px] convex-full flex justify-center items-center overflow-hidden mb-1"
            idx={1}
          >
            <AppIcon className="p-4 text-text-reverse bg-primary" />
          </AnimatedDiv>
          <div className="flex flex-col gap-1">
            <AnimatedDiv
              idx={1}
              className={`font-bold text-primary ${i18n.language === "en" ? "text-3xl" : "text-2xl"}`}
            >
              {t("stang")}
            </AnimatedDiv>
            <AnimatedDiv
              idx={2}
              className={`italic -translate-y-1  ${i18n.language === "en" ? "text-base" : "text-sm"}`}
            >
              {t("everyStangMatters")}.
            </AnimatedDiv>
          </div>
        </AnimatedDiv>
        <AnimatedDiv
          idx={3}
          className=" w-full flex justify-center items-center"
        >
          <p className="w-[100px] text-right pr-5">{t("userName")} :</p>
          <input
            className="input-field w-[120px] h-[30px] concave pl-3 text-lg"
            type="text"
            name="inputUser"
            value={input.inputUser}
            onChange={hdlInput}
          />
        </AnimatedDiv>
        <AnimatedDiv
          idx={4}
          className=" w-full flex justify-center items-center"
        >
          <p className="w-[100px] text-right pr-5">{t("password")} :</p>
          <input
            className="input-field w-[120px] h-[30px] concave pl-3  text-lg"
            type="password"
            name="inputPassword"
            value={input.inputPassword}
            onChange={hdlInput}
          />
        </AnimatedDiv>
        <AnimatedDiv idx={5}>
          <button
            className="btn h-[30px] w-[130px] convex bg-accent font-bold"
            onClick={hdlLogin}
          >
            {t("login")}
          </button>
        </AnimatedDiv>
        <AnimatedDiv idx={6}>
          <button
            className="btn h-[30px] w-[130px] convex bg-primary font-bold"
            onClick={openRegisterModal}
          >
            {t("register")}
          </button>
        </AnimatedDiv>
        {/* error message */}
        {isShowErrMsg && (
          <AnimatedDiv>
            {" "}
            <p className="font-bold text-accent">{errMsg}</p>
          </AnimatedDiv>
        )}
        <AnimatedDiv idx={7} className="self-end flex gap-2 items-center">
          {/* <p>{t("language")}</p> */}
          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="input-field convex h-[30px] px-2"
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="th">ภาษาไทย</option>
            {/* <option value="cn">中国人</option> */}
            {/* <option value="jp">日语</option> */}
          </select>
        </AnimatedDiv>
      </AnimatedDiv>
      {/* register modal */}
      <dialog id="register_modal" className="modal">
        <ModalRegister onSuccess={hdlRegisterSuccess} />
      </dialog>
    </div>
  );
}

export default Login;
