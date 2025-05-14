import React, { useState, useEffect } from "react";
import { EditIcon } from "../icons/menuIcon";
import { addNewType } from "../apis/new-api";
import useUserStore from "../stores/user-store";
import ModalEditType from "./ModalEditType";

function ModalExpenseType({ types, setInput, getNewTranInfo, input }) {
  const [newType, setNewType] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const token = useUserStore((state) => state.token);

  const hdlAddNewType = async (e) => {
    e.preventDefault();
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
    }
  };

  useEffect(() => {
    const target = document.getElementById("main-box");
    if (target) target.focus();
  }, []);

  return (
    <div className="w-[300px] h-auto bg-white shadow-xl rounded-xl fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 items-center text-lg">
      <p className="font-bold">Select Type</p>
      {/* <button onClick={() => console.log(users)}>Users</button> */}
      <div
        className="border-1 w-10/12 h-[300px] flex flex-col overflow-auto p-2 items-center gap-2"
        id="main-box"
        tabIndex={-1}
      >
        {types?.length ? (
          types
            .filter((el) => el.userId === input.paidById)
            .map((el, idx) => (
              <div
                key={idx}
                className="w-full flex justify-center items-center relative"
              >
                <div
                  className="w-3/4 text-center font-bold cursor-pointer"
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
                  className="w-[20px] h-[20px] bg-slate-200 flex justify-center items-center text-center font-bold rounded-full absolute right-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedType(el);
                    document.getElementById("edit_type_modal").showModal();
                  }}
                >
                  <p className="text-xs">E</p>
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
          className="w-10/12 border-1 pl-2"
          value={newType}
          tabIndex={-1}
          autoFocus={false}
          onChange={(e) => setNewType(e.target.value)}
        />
        <button
          className="w-2/6 font-bold bg-orange-700 px-2 text-sm text-white"
          onClick={hdlAddNewType}
        >
          Add
        </button>
      </div>
      {/* close button */}
      <button
        className="w-[30px] h-[30px] font-bold rounded-full bg-slate-100 flex justify-center items-center cursor-pointer py-1 mt-2 absolute top-0 right-0 -translate-x-2"
        onClick={(e) => {
          e.target.closest("dialog").close();
        }}
      >
        X
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
