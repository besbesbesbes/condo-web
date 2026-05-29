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
    <div className="w-[300px] h-auto bg-surface shadow-xl rounded-xl border border-surface-soft fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 text-xs items-center">
      <p className="font-bold" id="text-edit-type" tabIndex={-1}>
        Confirm Delete
      </p>
      <div className="flex gap-4">
        <button
          className="btn-secondary w-[100px]"
          onClick={(e) => {
            e.target.closest("dialog").close();
          }}
        >
          Cancel
        </button>
        <button className="btn btn-accent w-[100px]" onClick={hdlDeleteTran}>
          Delete
        </button>
      </div>
      {/* close button */}
      <button
        className="btn-secondary w-[30px] h-[30px] rounded-full flex justify-center items-center cursor-pointer py-1 mt-2 absolute top-0 right-0 -translate-x-2"
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
