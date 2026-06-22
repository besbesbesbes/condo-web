import React, { useEffect, useState } from "react";
import { BinIcon, CloseIcon } from "../icons/menuIcon";
import { deletePhotoApi } from "../apis/trans-api";
import useUserStore from "../stores/user-store";
import { useNavigate } from "react-router-dom";

function ModalPhoto({
  selPhotoUrl,
  setSelPhotoUrl,
  setIsLoad,
  setSelectedTran,
}) {
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const hdlDeltePhoto = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    try {
      const result = await deletePhotoApi(token, { selPhotoUrl });
      console.log(result.data);
      setSelectedTran((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p.photoUrl !== selPhotoUrl),
      }));
      navigate(0);
      e.target.closest("dialog").close();
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
      setShowConfirmDelete(false);
      e.target.closest("dialog").close();
    }
  };

  return (
    <div className="w-[300px] max-h-[calc(100vh-150px)] bg-surface shadow-xl rounded-xl concave fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 items-center text-lg overflow-auto">
      {selPhotoUrl && (
        <img
          src={selPhotoUrl}
          alt={`preview-${selPhotoUrl}`}
          className="object-cover"
        />
      )}

      {/* close button */}

      <button
        className="w-[30px] h-[30px] convex-full flex justify-center items-center py-1 mt-2 absolute top-0 right-0 -translate-x-2 text-text-reverse bg-accent"
        onClick={(e) => {
          setSelPhotoUrl("");
          setShowConfirmDelete(false);
          e.target.closest("dialog").close();
        }}
      >
        <CloseIcon className="p-1" />
      </button>
      {/* delete button */}
      {showConfirmDelete ? (
        <button
          className="btn btn-accent w-auto h-[30px] rounded-full flex justify-center items-center cursor-pointer py-1 mt-2 absolute top-0 left-0 translate-x-2 gap-2 px-2 text-text-reverse"
          onClick={hdlDeltePhoto}
        >
          <BinIcon className="w-[20px] h-[20px]" />
          <p>Confirm Delete</p>
        </button>
      ) : (
        <button
          className="w-[30px] h-[30px] convex-full flex justify-center items-center py-1 mt-2 absolute top-0 left-0 translate-x-2 text-text-reverse bg-accent"
          onClick={() => {
            setShowConfirmDelete(true);
          }}
        >
          <BinIcon className="p-1" />
        </button>
      )}
    </div>
  );
}

export default ModalPhoto;
