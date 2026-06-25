import React, { useState, useEffect } from "react";
import { CloseIcon, EditIcon, TypeIcon } from "../icons/menuIcon";
import { addNewType } from "../apis/new-api";
import useUserStore from "../stores/user-store";
import ModalEditType from "./ModalEditType";
import useMainStore from "../stores/main-store";
import { useTranslation } from "react-i18next";

function ModalExpenseType({ types, setInput, getNewTranInfo, input }) {
  const [newType, setNewType] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const token = useUserStore((state) => state.token);
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const { t } = useTranslation();

  const hdlAddNewType = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    try {
      if (!newType) {
        console.log("Plase fill new type!");
        return;
      }
      const result = await addNewType(token, { newType });
      console.log(result.data);
      getNewTranInfo();
      setNewType("");
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    const target = document.getElementById("main-box");
    if (target) target.focus();
  }, []);

  return (
    <div className="w-[300px] h-auto bg-app shadow-xl convex fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-4 pb-4 pt-6 items-center text-lg text-text text-text">
      <div className="flex gap-1 items-center">
        <TypeIcon className="w-[20px] h-[20px]" />
        <p className="">{t("selectType")}</p>
      </div>
      {/* <button onClick={() => console.log(users)}>Users</button> */}
      <div
        className="w-full h-[300px] flex flex-col overflow-auto p-4 items-center gap-4 rounded-xl"
        id="main-box"
        tabIndex={-1}
      >
        {types?.length ? (
          types
            .filter((el) => el.userId === input.paidById)
            .map((el, idx) => (
              <div
                key={idx}
                className="w-10/11 bg-surface flex justify-center items-center relative convex flex-none h-[32px]"
              >
                <div
                  className="w-full text-center cursor-pointer"
                  onClick={(e) => {
                    setInput((prev) => ({
                      ...prev,
                      type: el.expenseName,
                      typeId: el.expenseTypeId,
                    }));
                    e.target.closest("dialog").close();
                  }}
                >
                  {el.expenseName}
                </div>
                <div
                  className="w-[20px] h-[20px] flex justify-center items-center text-center font-bold rounded-full absolute right-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedType(el);
                    document.getElementById("edit_type_modal").showModal();
                  }}
                >
                  <div className="w-[20px] h-[20px] flex-none convex bg-primary mr-2 text-text-reverse items-center justify-center">
                    <EditIcon className="p-[3px]" />
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p>No type</p>
        )}
      </div>
      {/* add */}
      <div className="w-10/12 flex gap-2">
        <input
          type="text"
          className="input-field w-10/12 concave pl-4 bg-surface"
          value={newType}
          tabIndex={-1}
          autoFocus={false}
          onChange={(e) => setNewType(e.target.value)}
        />
        <button
          className="btn convex bg-primary text-text-reverse w-2/6"
          onClick={hdlAddNewType}
        >
          {t("add")}
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
      {/* modal edit type */}
      <dialog id="edit_type_modal" className="modal">
        <ModalEditType
          selectedType={selectedType}
          getNewTranInfo={getNewTranInfo}
        />
      </dialog>
    </div>
  );
}

export default ModalExpenseType;
