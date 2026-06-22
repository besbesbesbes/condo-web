import { useState } from "react";
import useUserStore from "../stores/user-store";
import { login } from "../apis/auth-api";
import { useNavigate } from "react-router-dom";
import useMainStore from "../stores/main-store";
import { useTranslation } from "react-i18next";
import { AppIcon } from "../icons/menuIcon";

function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const setToken = useUserStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);
  const setCurMenu = useMainStore((state) => state.setCurMenu);
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
      <div className="bg-surface w-[300px] h-auto m-auto flex flex-col items-center gap-4 px-4 pt-8 pb-2 convex -translate-y-[50px]">
        <div className="w-[80px] h-[80px] convex-full flex justify-center items-center overflow-hidden mb-1">
          <AppIcon className="p-4 text-text-reverse bg-primary" />
        </div>
        <div className=" w-full flex justify-center items-center">
          <p className="w-[100px] text-right pr-5">{t("userName")} :</p>
          <input
            className="input-field w-[120px] h-[30px] concave pl-3 text-lg"
            type="text"
            name="inputUser"
            value={input.inputUser}
            onChange={hdlInput}
          />
        </div>
        <div className=" w-full flex justify-center items-center">
          <p className="w-[100px] text-right pr-5">{t("password")} :</p>
          <input
            className="input-field w-[120px] h-[30px] concave pl-3  text-lg"
            type="password"
            name="inputPassword"
            value={input.inputPassword}
            onChange={hdlInput}
          />
        </div>
        {/* <hr className="w-10/12 mt-2 border-surface" /> */}
        <button
          className="btn h-[30px] w-[130px] convex bg-primary font-bold"
          onClick={hdlLogin}
        >
          {t("login")}
        </button>
        {/* error message */}
        {isShowErrMsg && <p className="font-bold text-error">{errMsg}</p>}
        <div className="self-end flex gap-2">
          {/* <p>{t("language")}</p> */}
          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="input-field convex h-[30px] px-2"
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="th">ภาษาไทย</option>
            <option value="cn">中国人</option>
            <option value="jp">日语</option>
          </select>
        </div>
      </div>
      {/* language */}
    </div>
  );
}

export default Login;
