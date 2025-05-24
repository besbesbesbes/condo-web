import React from "react";

function ModalPhoto({ selPhotoUrl, setSelPhotoUrl }) {
  return (
    <div className="w-[300px] h-auto bg-white shadow-xl rounded-xl fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 items-center text-lg">
      <img
        src={selPhotoUrl}
        alt={`preview-${selPhotoUrl}`}
        className="object-cover w-full h-full"
      />

      {/* close button */}
      <button
        className="w-[30px] h-[30px] font-bold rounded-full bg-slate-100 flex justify-center items-center cursor-pointer py-1 mt-2 absolute top-0 right-0 -translate-x-2"
        onClick={(e) => {
          setSelPhotoUrl("");
          e.target.closest("dialog").close();
        }}
      >
        X
      </button>
    </div>
  );
}

export default ModalPhoto;
