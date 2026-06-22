import React from "react";
import { CloseIcon, UserIcon } from "../icons/menuIcon";

function ModalPaidBy({ users, setInput, headerTxt }) {
  return (
    <div className="w-[300px] h-auto bg-surface shadow-xl convex fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 items-center text-lg text-text">
      <div className="flex gap-1 items-center">
        <UserIcon className="w-[20px] h-[20px]" />
        <p className="">{headerTxt ? headerTxt : "Select Paid by"}</p>
      </div>
      {/* <button onClick={() => console.log(users)}>Users</button> */}
      <div className="w-10/12 h-[150px] flex flex-col overflow-auto gap-4 justify-center items-center">
        {users?.length ? (
          users.map((el, idx) => (
            <div
              key={idx}
              className={`w-10/12 h-[30px] text-center text-text-reverse font-bold convex bg-primary ${el.userName === "Bes" && "bg-accent"}`}
              onClick={(e) => {
                setInput((prev) => ({
                  ...prev,
                  paidBy: el.userName,
                  paidById: el.userId,
                  userName: el.userName,
                  userId: el.userId,
                  type: "",
                  typeId: "",
                }));
                e.target.closest("dialog").close();
              }}
            >
              {el.userName}
            </div>
          ))
        ) : (
          <p>No users</p>
        )}
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

export default ModalPaidBy;
