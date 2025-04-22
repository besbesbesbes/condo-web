import { useState } from "react";
import useUserStore from "../stores/user-store";
import { login } from "../apis/auth-api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const setToken = useUserStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);
  const [input, setInput] = useState({
    inputUser: "",
    inputPassword: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [isShowErrMsg, setIsShowErrMsg] = useState(false);

  const hdlInput = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };
  const hdlLogin = async (e) => {
    e.preventDefault();
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
      setUser(result.data.userData);
      navigate(0);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
      hdlError(err?.response?.data?.msg || err.message);
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
      <div className="bg-slate-100 w-[300px] h-auto m-auto flex flex-col items-center gap-4 px-4 py-8 rounded-xl shadow-xl -translate-y-[50px]">
        <p className="font-bold">Login</p>
        <div className=" w-full flex justify-center">
          <p className="w-[100px] text-right pr-5">User :</p>
          <input
            className="w-[120px] border border-gray-400 pl-2"
            type="text"
            name="inputUser"
            value={input.inputUser}
            onChange={hdlInput}
          />
        </div>
        <div className=" w-full flex justify-center">
          <p className="w-[100px] text-right pr-5">Password :</p>
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
          Login
        </button>
        {/* error message */}
        {isShowErrMsg && <p className="font-bold text-red-500">{errMsg}</p>}
      </div>
    </div>
  );
}

export default Login;
