import React from "react";

function Login() {
  return (
    <div className="bg-slate-300 w-screen h-screen flex items-center justify-center text-sm">
      {/* login card */}
      <div className="bg-slate-100 w-[300px] h-auto m-auto flex flex-col items-center gap-4 px-4 py-8 rounded-xl shadow-xl -translate-y-[100px]">
        <p className="font-bold">Login</p>
        <div className=" w-full flex justify-center">
          <p className="w-[100px] text-right pr-5">User :</p>
          <input className="w-[150px] border-1" type="text" />
        </div>
        <div className=" w-full flex justify-center">
          <p className="w-[100px] text-right pr-5">Password :</p>
          <input className="w-[150px] border-1" type="text" />
        </div>
        <button className="w-[130px] border-1 bg-slate-500 text-white cursor-pointer">
          Login
        </button>
        <hr className="w-10/12" />
        <button className="w-[130px] border-1 bg-slate-700 text-white cursor-pointer">
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
