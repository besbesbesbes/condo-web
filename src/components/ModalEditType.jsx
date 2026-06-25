import React, { useEffect, useState } from "react";
import { deleteType, editType } from "../apis/new-api";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";
import { CloseIcon, TypeIcon } from "../icons/menuIcon";
import { useTranslation } from "react-i18next";

function ModalEditType({ selectedType, getNewTranInfo }) {
  const { t } = useTranslation();
  const [typeTxt, setTypeTxt] = useState("");
  const token = useUserStore((state) => state.token);
  const setIsLoad = useMainStore((state) => state.setIsLoad);

  const hdlDeleteType = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    try {
      const result = await deleteType(token, { selectedType });
      console.log(result.data);
      getNewTranInfo();
      e.target.closest("dialog").close();
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const hdlEditType = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    try {
      const result = await editType(token, { selectedType, typeTxt });
      console.log(result.data);
      getNewTranInfo();
      e.target.closest("dialog").close();
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    if (selectedType) {
      setTypeTxt(selectedType.expenseName);
    }
  }, [selectedType]);

  return (
    <div className="w-[300px] h-auto bg-app shadow-xl concave fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-3 pb-4 pt-6 items-center text-lg">
      <div className="flex gap-1 items-center">
        <TypeIcon className="w-[20px] h-[20px]" />
        <p className="">{t("editType")}</p>
      </div>

      <input
        type="text"
        className="input-field w-10/12 concave pl-4 bg-surface"
        value={typeTxt}
        onChange={(e) => setTypeTxt(e.target.value)}
      />
      {/* button */}
      <div className="flex gap-2 mt-1">
        <button
          className="btn btn-primary w-[100px] h-[30px] text-text-reverse"
          onClick={hdlEditType}
        >
          {t("update")}
        </button>
        <button
          className="btn btn-accent w-[100px] h-[30px] text-text-reverse"
          onClick={hdlDeleteType}
        >
          {t("delete")}
        </button>
      </div>
      {/* close button */}
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

export default ModalEditType;
