import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../apis/user-api";
import useUserStore from "../stores/user-store";

function ModalChangePassword() {
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const [errMsg, setErrMsg] = useState("");
  const [isShowErrMsg, setIsShowErrMsg] = useState(false);
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

      setUser(null);
      setToken("");
      navigate(0);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
      hdlError(err?.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="w-[300px] h-auto bg-white shadow-xl rounded-xl fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 text-xs items-center">
      <p className="text-lg font-bold">Change Password</p>
      <div className=" w-full flex justify-center">
        <p className="w-[130px] text-right pr-5">Current Password :</p>
        <input
          className="w-[130px] border border-gray-400 pl-2"
          type="password"
          name="curPass"
          value={input.curPass}
          onChange={hdlInput}
        />
      </div>
      <div className=" w-full flex justify-center">
        <p className="w-[130px] text-right pr-5">New Password :</p>
        <input
          className="w-[130px] border border-gray-400 pl-2"
          type="password"
          name="newPass"
          value={input.newPass}
          onChange={hdlInput}
        />
      </div>
      <div className=" w-full flex justify-center">
        <p className="w-[130px] text-right pr-5">Confirm Password :</p>
        <input
          className="w-[130px] border border-gray-400 pl-2"
          type="password"
          name="conPass"
          value={input.conPass}
          onChange={hdlInput}
        />
      </div>
      <button
        className="w-[130px] border-1 bg-slate-500 text-white cursor-pointer py-1 mt-2"
        onClick={hdlChangePass}
      >
        Confirm
      </button>
      {/* error message */}
      {isShowErrMsg && <p className="font-bold text-red-500">{errMsg}</p>}
      {/* <button
        className="w-[130px] border-1 bg-slate-500 text-white cursor-pointer py-1 mt-2"
        onClick={() => console.log(input)}
      >
        input
      </button> */}
      {/* close button */}
      <button
        className="w-[30px] h-[30px] font-bold rounded-full bg-slate-100 flex justify-center items-center cursor-pointer py-1 mt-2 absolute top-0 right-0 -translate-x-2"
        onClick={(e) => {
          setInput({
            curPass: "",
            newPass: "",
            conPass: "",
          });
          e.target.closest("dialog").close();
          navigate(0);
        }}
      >
        X
      </button>
    </div>
  );
}

export default ModalChangePassword;
