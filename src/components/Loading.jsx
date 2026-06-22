import React from "react";
import { AppIcon } from "../icons/menuIcon";

function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-overlay">
      <div role="status">
        <div className="w-[100px] h-[100px] bg-primary rounded-full animate-spin [animation-duration:1.5s]">
          <AppIcon className="p-4 text-text-reverse" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
