import React from "react";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";
import { CloseIcon, DeleteIcon } from "../icons/menuIcon";
import { useTranslation } from "react-i18next";
import { deleteMemo } from "../apis/memo-api";
import AnimatedSection from "./AnimatedSection";

function ModalConfirmDeleteMemo({ refreshMemo, memo }) {
  const { t } = useTranslation();
  const token = useUserStore((state) => state.token);
  const setIsLoad = useMainStore((state) => state.setIsLoad);

  const hdlDeleteMemo = async (e) => {
    e.preventDefault();
    setIsLoad(true);

    try {
      const result = await deleteMemo(token, memo);
      console.log(result);

      // Refresh list
      refreshMemo?.();

      // Close confirm dialog first
      document.getElementById("confirm-delete-memo-modal")?.close();

      // Then close edit dialog
      document.getElementById("edit_memo_modal")?.close();
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  return (
    <AnimatedSection
      index={1}
      className="w-[300px] h-auto bg-app shadow-xl concave fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 text-xs items-center text-text"
    >
      <AnimatedSection
        index={2}
        className="text-lg"
        id="text-edit-type"
        tabIndex={-1}
      >
        {t("confirmDelete")}
      </AnimatedSection>
      <div className="flex gap-4 my-2 text-base">
        <AnimatedSection index={3}>
          <button
            className="btn btn-primary w-[100px] text-text-reverse flex justify-center items-center gap-1"
            onClick={() => {
              document.getElementById("confirm-delete-memo-modal")?.close();
            }}
          >
            <CloseIcon className="w-[20px] h-[20px]" />
            {t("cancel")}
          </button>
        </AnimatedSection>
        <AnimatedSection index={4}>
          <button
            className="btn btn-accent w-[100px] text-text-reverse flex justify-center items-center gap-1"
            onClick={hdlDeleteMemo}
          >
            <DeleteIcon className="w-[20px] h-[20px]" />
            {t("delete")}
          </button>
        </AnimatedSection>
      </div>
      {/* close button */}
      <button
        className="w-[30px] h-[30px] convex-full flex justify-center items-center py-1 mt-2 absolute top-0 right-0 -translate-x-2 text-text-reverse bg-accent"
        onClick={() => {
          document.getElementById("confirm-delete-memo-modal")?.close();
        }}
      >
        <CloseIcon className="p-1" />
      </button>
    </AnimatedSection>
  );
}

export default ModalConfirmDeleteMemo;
