import React from "react";
import { deleteTranApi } from "../apis/trans-api";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";

function ModalConfirmDelete({ selectedTran, setSelectedTran, getTrans }) {
  const token = useUserStore((state) => state.token);
  const setIsLoad = useMainStore((state) => state.setIsLoad);

  const hdlDeleteTran = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    try {
      const result = await deleteTranApi(token, selectedTran);
      console.log(result);
      setSelectedTran(null);
      getTrans();
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  return (
    <div className="w-[300px] h-auto bg-white shadow-xl rounded-xl fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 text-xs items-center">
      <p className="font-bold" id="text-edit-type" tabIndex={-1}>
        Confirm Delete
      </p>
      <div className="flex gap-4">
        <button
          className="w-[100px] border-1 bg-orange-500 text-white cursor-pointer py-1 "
          onClick={(e) => {
            e.target.closest("dialog").close();
          }}
        >
          Cancel
        </button>
        <button
          className="w-[100px] border-1 bg-orange-700 text-white cursor-pointer py-1 "
          onClick={hdlDeleteTran}
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

export default ModalConfirmDelete;
