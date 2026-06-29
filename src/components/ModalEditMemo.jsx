import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CloseIcon,
  DeleteIcon,
  EditIcon,
  LockIcon,
  MemoIcon,
  PrivateIcon,
} from "../icons/menuIcon";
import useMainStore from "../stores/main-store";
import { editMemo } from "../apis/memo-api";
import useUserStore from "../stores/user-store";

function ModalEditMemo({ refreshMemo, memo }) {
  const { t } = useTranslation();
  const [input, setInput] = useState({
    txt: "",
    isPrivate: false,
    isLock: false,
    isHidden: false,
    updatedAt: new Date(),
  });
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const isOwner = user.userName === input?.user?.userName;

  const hdlEditMemo = async () => {
    setIsLoad(true);

    try {
      const body = {
        memoId: input.memoId,
        isHidden: input.isHidden,
      };

      // Only owner can edit the memo itself
      if (isOwner) {
        if (!input?.txt?.trim()) {
          return;
        }

        body.txt = input.txt.trim();
        body.isPrivate = input.isPrivate;
        body.isLock = input.isLock;
      }

      const result = await editMemo(token, body);

      console.log(result);

      refreshMemo?.();
      document.getElementById("edit_memo_modal")?.close();
    } catch (err) {
      const msg = err?.response?.data?.msg || err.message;
      console.log(msg);
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    if (memo) {
      setInput({ ...memo });
    }
  }, [memo]);

  return (
    <div className="w-[320px] h-auto bg-surface shadow-xl convex fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 items-center text-lg text-text z-[50]">
      {" "}
      {/* title */}
      <div className="w-10/12 flex gap-1 items-center">
        <MemoIcon className="w-[20px] h-[20px]" />
        <p className="">{t("editMemo")}</p>
        {" :"}
      </div>
      {/* date time */}
      <div className="w-10/12 flex items-center justify-between mt-1">
        <p>{t("lastUpdate")}</p>
        <p>
          {new Date(input?.updatedAt).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </div>
      {/* input area */}
      <textarea
        className={`w-10/12 p-2 min-h-[200px] overflow-y-scroll concave focus:outline-none`}
        value={input?.txt}
        disabled={!isOwner && input?.isLock}
        onChange={(e) =>
          setInput((prev) => ({
            ...prev,
            txt: e.target.value,
          }))
        }
        placeholder={t("memoHere")}
      />
      {user.userName === input?.user?.userName && (
        <>
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
              checked={input?.isPrivate}
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
              checked={input?.isLock}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  isLock: e.target.checked,
                }))
              }
            />
          </div>
        </>
      )}
      {/* hidden */}
      <div className="w-10/12 flex items-center justify-between mt-1">
        <div className="flex gap-1 items-center">
          <div className="w-[25px] h-[25px] flex justify-center items-center convex-full bg-primary">
            <PrivateIcon className="w-[16px] h-[16px]" />
          </div>
          <p>{t("hidden")}</p>
        </div>
        {/* toggle hidden */}
        <input
          type="checkbox"
          className="w-[20px] h-[20px] mr-1"
          checked={input?.isHidden}
          onChange={(e) =>
            setInput((prev) => ({
              ...prev,
              isHidden: e.target.checked,
            }))
          }
        />
      </div>
      {/* button */}
      <div className="flex gap-2">
        <button
          className="w-[100px] h-[30px] btn btn-primary text-text-reverse mt-3 mb-2"
          onClick={hdlEditMemo}
        >
          <div className="flex gap-1 items-center">
            <EditIcon className="w-[20px] h-[20px]" />
            {t("edit")}
          </div>
        </button>
        {user.userName === input?.user?.userName && (
          <button
            className="w-[100px] h-[30px] btn btn-accent text-text-reverse mt-3 mb-2"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("confirm-delete-memo-modal").showModal();
            }}
          >
            <div className="flex gap-1 items-center">
              <DeleteIcon className="w-[20px] h-[20px]" />
              {t("delete")}
            </div>
          </button>
        )}
      </div>
      {/* close */}
      <button
        className="w-[30px] h-[30px] convex-full flex justify-center items-center py-1 mt-2 absolute top-0 right-0 -translate-x-2 text-text-reverse bg-accent"
        onClick={(e) => {
          e.target.closest("dialog").close();
        }}
      >
        <CloseIcon className="p-1" />
      </button>
    </div>
  );
}

export default ModalEditMemo;
