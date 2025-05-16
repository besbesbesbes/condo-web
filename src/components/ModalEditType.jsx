import React, { useEffect, useState } from "react";
import { deleteType, editType } from "../apis/new-api";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";

function ModalEditType({ selectedType, getNewTranInfo }) {
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
    <div className="w-[300px] h-auto bg-white shadow-xl rounded-xl fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 items-center text-lg">
      <p className="font-bold" id="text-edit-type" tabIndex={-1}>
        Edit Type
      </p>

      <input
        type="text"
        className="w-10/12 border-1 pl-2"
        value={typeTxt}
        onChange={(e) => setTypeTxt(e.target.value)}
      />
      {/* button */}
      <div className="flex gap-2">
        <button
          className="w-[100px] h-[30px] font-bold bg-orange-500 px-2 text-sm text-white cursor-pointer"
          onClick={hdlEditType}
        >
          Rename
        </button>
        <button
          className="w-[100px] h-[30px]  font-bold bg-orange-700 px-2 text-sm text-white cursor-pointer"
          onClick={hdlDeleteType}
        >
          Delete
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
    </div>
  );
}

export default ModalEditType;
