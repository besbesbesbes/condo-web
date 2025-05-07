import React from "react";

function ModalPaidBy({ users, setInput, headerTxt }) {
  return (
    <div className="w-[300px] h-auto bg-white shadow-xl rounded-xl fixed left-1/2 top-1/2 -translate-y-2/3 -translate-x-1/2 flex flex-col gap-2 pb-4 pt-6 items-center text-lg">
      <p className="font-bold">{headerTxt ? headerTxt : "Select Paid by"}</p>
      {/* <button onClick={() => console.log(users)}>Users</button> */}
      <div className="border-1 w-10/12 h-[300px] flex flex-col overflow-auto p-2 items-center gap-2">
        {users?.length ? (
          users.map((el, idx) => (
            <div
              key={idx}
              className=" w-10/12 text-center font-bold cursor-pointer"
              onClick={(e) => {
                setInput((prev) => ({
                  ...prev,
                  paidBy: el.userName,
                  paidById: el.userId,
                  userName: el.userName,
                  userId: el.userId,
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

export default ModalPaidBy;
