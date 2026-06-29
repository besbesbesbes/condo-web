import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AppIcon } from "../icons/menuIcon";

function Loading() {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="loading-dialog m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 p-0"
      onCancel={(e) => e.preventDefault()}
    >
      <div role="status">
        <div className="w-[100px] h-[100px] bg-primary rounded-full animate-spin [animation-duration:1.5s]">
          <AppIcon className="p-4 text-text-reverse" />
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

export default Loading;
