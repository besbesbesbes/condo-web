import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import useUserStore from "../stores/user-store";
import { getTransApi } from "../apis/trans-api";
import { NumericFormat } from "react-number-format";
import TransDetail from "./TransDetail";

function Trans() {
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const [trans, setTrans] = useState(null);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const [selectedTran, setSelectedTran] = useState(null);

  const getTrans = async () => {
    try {
      const result = await getTransApi(token);
      console.log(result.data);
      setTrans(result.data.trans);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    }
  };

  const hdlSelectedTran = (e, el) => {
    setSelectedTran(el);
  };

  useEffect(() => {
    setCurMenu("TRANS");
    getTrans();
    setSelectedTran(null);
  }, []);

  return (
    <div>
      {selectedTran ? (
        <TransDetail
          setSelectedTran={setSelectedTran}
          selectedTran={selectedTran}
          getTrans={getTrans}
        />
      ) : (
        <>
          <div className="w-screen h-[calc(100svh-60px)] bg-white overflow-y-auto flex flex-col gap-2 items-center relative">
            <div className="flex justify-center w-full sticky top-[0] z-10 bg-slate-100 shadow">
              <p className="text-2xl font-bold py-2">Transactions</p>
            </div>

            {trans?.length ? (
              trans.map((el, idx) => {
                const rawDate = new Date(el.recordDate);
                const curDate = rawDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                });
                const prevDate =
                  idx > 0
                    ? new Date(trans[idx - 1].recordDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )
                    : null;
                const showDateHeader = curDate !== prevDate;
                const formattedDate = curDate.replace(" ", "-");

                return (
                  <div className="w-full flex flex-col items-center" key={idx}>
                    {showDateHeader && (
                      <div className="w-11/12 text-sm font-bold border-b mt-4 mb-1 text-left">
                        {formattedDate}
                      </div>
                    )}
                    <div
                      className={`flex w-11/12 items-center gap-1 cursor-pointer bg-orange-50 shadow ${
                        el.userId === user.userId ? "bg-slate-50" : null
                      }`}
                      onClick={(e) => hdlSelectedTran(e, el)}
                    >
                      <div className="w-[50px] flex flex-col justify-between">
                        {/* create user */}
                        <div className="font-bold text-center">
                          {el.user.userName.charAt(0)}
                        </div>
                        {/* Month */}
                        <div className="text-xs text-center">
                          {new Date(el.recordDate).toLocaleString("en-US", {
                            month: "short",
                          })}
                        </div>
                      </div>
                      <div className="w-[50px] flex flex-col">
                        {/* date */}
                        <div className=" text-center text-xs border-b border-slate-400">
                          {new Date(el.recordDate).getDate()}
                        </div>

                        {/* time */}
                        <div className="text-xs text-center">
                          {new Date(el.recordDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div className="w-full flex flex-col px-2 py-1">
                        <div className="grid grid-cols-2 font-bold">
                          {/* type */}
                          <div>{el.expenseType.expenseName}</div>
                          {/* total amt */}
                          <NumericFormat
                            className="text-right"
                            value={el.totalAmt}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                          />
                        </div>

                        <div className="flex justify-between text-xs">
                          <div className="flex gap-1">
                            {/* paid by */}
                            <div className=" rounded-full flex justify-center items-center">
                              {el.paidUser.userName}
                            </div>

                            {/* remark */}
                            {el.remark ? (
                              <div className="">
                                |{" "}
                                <span className="text-orange-700">
                                  {el.remark}
                                </span>
                              </div>
                            ) : null}
                          </div>
                          <div className="flex gap-1 items-center">
                            <div className="flex items-center gap-0.5">
                              <span>(</span>
                              <NumericFormat
                                className="text-center"
                                value={el.myPortion * 100}
                                displayType="text"
                                thousandSeparator=","
                                decimalScale={0}
                                fixedDecimalScale
                                suffix="%"
                              />
                              <span>)</span>
                            </div>
                            <NumericFormat
                              className="text-right"
                              value={el.myAmt}
                              displayType="text"
                              thousandSeparator=","
                              decimalScale={2}
                              fixedDecimalScale
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No Trans</p>
            )}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default Trans;
