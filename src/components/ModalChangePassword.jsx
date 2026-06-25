import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../apis/user-api";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";
import { CloseIcon, TypeIcon, PasswordIcon } from "../icons/menuIcon";

function ModalChangePassword() {
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
    <div className="w-[300px] h-auto bg-surface shadow-xl rounded-xl concave fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 text-xs items-center text-text">
      <div className="w-full flex justify-center items-center gap-1 mb-3">
        <PasswordIcon className="w-[20px] h-[20px]" />
        <p className="text-lg">Change Password</p>
      </div>
      <div className=" w-full flex justify-center items-center">
        <p className="w-[130px] text-right pr-5">Current Password :</p>
        <input
          className="input-field w-[130px] concave pl-4"
          type="password"
          name="curPass"
          value={input.curPass}
          onChange={hdlInput}
        />
      </div>
      <div className=" w-full flex justify-center items-center">
        <p className="w-[130px] text-right pr-5">New Password :</p>
        <input
          className="input-field w-[130px] concave pl-4"
          type="password"
          name="newPass"
          value={input.newPass}
          onChange={hdlInput}
        />
      </div>
      <div className=" w-full flex justify-center items-center">
        <p className="w-[130px] text-right pr-5">Confirm Password :</p>
        <input
          className="input-field w-[130px] concave pl-4"
          type="password"
          name="conPass"
          value={input.conPass}
          onChange={hdlInput}
        />
      </div>
      <button
        className="btn btn-primary w-[130px] mt-2 text-text-reverse  text-base"
        onClick={hdlChangePass}
      >
        Confirm
      </button>
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
          navigate(0);
        }}
      >
        <CloseIcon className="p-1" />
      </button>
    </div>
  );
}

export default ModalChangePassword;
