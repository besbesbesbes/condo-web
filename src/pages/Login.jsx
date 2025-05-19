import { useState } from "react";
import useUserStore from "../stores/user-store";
import { login } from "../apis/auth-api";
import { useNavigate } from "react-router-dom";
import useMainStore from "../stores/main-store";
import { useTranslation } from "react-i18next";

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
    <div className="bg-slate-500 w-screen h-svh flex items-center justify-center text-sm">
      {/* login card */}
      <div className="bg-slate-100 w-[300px] h-auto m-auto flex flex-col items-center gap-4 px-4 pt-8 pb-2 rounded-xl shadow-xl -translate-y-[50px]">
        <p className="font-bold">{t("welcome")}</p>
        <div className=" w-full flex justify-center">
          <p className="w-[100px] text-right pr-5">{t("userName")} :</p>
          <input
            className="w-[120px] border border-gray-400 pl-2"
            type="text"
            name="inputUser"
            value={input.inputUser}
            onChange={hdlInput}
          />
        </div>
        <div className=" w-full flex justify-center">
          <p className="w-[100px] text-right pr-5">{t("password")} :</p>
          <input
            className="w-[120px] border border-gray-400 pl-2"
            type="password"
            name="inputPassword"
            value={input.inputPassword}
            onChange={hdlInput}
          />
        </div>
        <hr className="w-10/12 mt-2" />
        <button
          className="w-[130px] border-1 bg-slate-500 text-white cursor-pointer py-1 "
          onClick={hdlLogin}
        >
          {t("login")}
        </button>
        {/* error message */}
        {isShowErrMsg && (
          <p className="font-bold text-red-500">{errMsg}</p>
        )}{" "}
        <div className="self-end flex gap-2">
          <p>{t("language")}</p>
          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="rounded border"
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
