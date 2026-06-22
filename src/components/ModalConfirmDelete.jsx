import React from "react";
import { deleteTranApi } from "../apis/trans-api";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";
import { CloseIcon } from "../icons/menuIcon";

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
    <div className="w-[300px] h-auto bg-app shadow-xl concave fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 text-xs items-center text-text">
      <p className="text-lg" id="text-edit-type" tabIndex={-1}>
        Confirm Delete
      </p>
      <div className="flex gap-4 my-2 text-base">
        <button
          className="btn btn-primary w-[100px] text-text-reverse"
          onClick={(e) => {
            e.target.closest("dialog").close();
          }}
        >
          Cancel
        </button>
        <button
          className="btn btn-accent w-[100px] text-text-reverse"
          onClick={hdlDeleteTran}
        >
          Delete
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

export default ModalConfirmDelete;
