import React, { useState } from "react";
import {
  CloseIcon,
  LockIcon,
  MemoIcon,
  NewIcon,
  PrivateIcon,
} from "../icons/menuIcon";
import { useTranslation } from "react-i18next";
import useMainStore from "../stores/main-store";
import { addMemo } from "../apis/memo-api";
import useUserStore from "../stores/user-store";

function ModalAddMemo({ refreshMemo }) {
  const { t } = useTranslation();
  const token = useUserStore((state) => state.token);
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const [input, setInput] = useState({
    txt: "",
    isPrivate: false,
    isLock: false,
  });

  const hdlAddMemo = async () => {
    if (!input.txt.trim()) return;
    setIsLoad(true);
    try {
      const result = await addMemo(token, input); // reset form
      setInput({
        txt: "",
        isPrivate: false,
        isLock: false,
      });
      console.log(result);
      refreshMemo?.();
      document.getElementById("add_memo_modal")?.close();
    } catch (err) {
      const msg = err?.response?.data?.msg || err.message;
      console.log(msg);
    } finally {
      setIsLoad(false);
    }
  };

  return (
    <div className="w-[320px] h-auto bg-surface shadow-xl convex fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 items-center text-lg text-text z-[50]">
      {/* title */}
      <div className="w-10/11 flex gap-1 items-center">
        <MemoIcon className="w-[20px] h-[20px]" />
        <p className="">{t("addNewMemo")}</p>
        {" :"}
      </div>
      {/* input area */}
      <textarea
        className="w-10/12 p-2 min-h-[200px] overflow-y-scroll concave focus:outline-none"
        value={input.txt}
        onChange={(e) =>
          setInput((prev) => ({
            ...prev,
            txt: e.target.value,
          }))
        }
        placeholder={t("memoHere")}
      />
      {/* private */}
      <div className="w-10/12 flex items-center justify-between mt-1">
        <div className="flex gap-1 items-center">
          <div className="w-[25px] h-[25px] flex justify-center items-center convex-full bg-primary">
            <PrivateIcon className="w-[16px] h-[16px]" />
          </div>
          <p>{t("isPrivate")}</p>
        </div>
        {/* toggle isPrivate */}
        <input
          type="checkbox"
          className="w-[20px] h-[20px] mr-1"
          checked={input.isPrivate}
          onChange={(e) =>
            setInput((prev) => ({
              ...prev,
              isPrivate: e.target.checked,
            }))
          }
        />
      </div>
      {/* lock */}
      <div className="w-10/12 flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <div className="w-[25px] h-[25px] flex justify-center items-center convex-full bg-primary">
            <LockIcon className="w-[16px] h-[16px]" />
          </div>
          <p>{t("isLock")}</p>
        </div>
        {/* toggle isLock */}
        <input
          type="checkbox"
          className="w-[20px] h-[20px] mr-1"
          checked={input.isLock}
          onChange={(e) =>
            setInput((prev) => ({
              ...prev,
              isLock: e.target.checked,
            }))
          }
        />
      </div>
      {/* button */}
      <button
        className="w-[150px] h-[30px] btn btn-primary text-text-reverse mt-3 mb-2"
        onClick={() => {
          hdlAddMemo();
        }}
      >
        {" "}
        <div className="flex gap-1 items-center">
          <NewIcon className="w-[20px] h-[20px]" />
          {t("add")}
        </div>
      </button>
      {/* close */}
      <button
        className="w-[30px] h-[30px] convex-full flex justify-center items-center py-1 mt-2 absolute top-0 right-0 -translate-x-2 text-text-reverse bg-accent"
        onClick={(e) => {
          setInput({
            txt: "",
            isPrivate: false,
            isLock: false,
          });
          e.target.closest("dialog").close();
        }}
      >
        <CloseIcon className="p-1" />
      </button>
    </div>
  );
}

export default ModalAddMemo;
