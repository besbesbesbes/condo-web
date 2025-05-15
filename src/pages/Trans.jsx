import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import useUserStore from "../stores/user-store";
import { getTransApi } from "../apis/trans-api";
import { NumericFormat } from "react-number-format";
import TransDetail from "./TransDetail";
import { SearchIcon } from "../icons/menuIcon";

function Trans() {
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const [trans, setTrans] = useState(null);
  const [transRaw, setTransRaw] = useState(null);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const [selectedTran, setSelectedTran] = useState(null);
  const today = new Date();
  const [yearInput, setYearInput] = useState(today.getFullYear());
  const [searchInput, setSearchInput] = useState("");

  const getTrans = async () => {
    try {
      const result = await getTransApi(token, { yearInput });
      console.log(result.data);
      setTransRaw(result.data.trans);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    }
  };

  const hdlSelectedTran = (e, el) => {
    setSelectedTran(el);
  };

  useEffect(() => {
    if (!searchInput) {
      setTrans(transRaw);
    } else {
      const lower = searchInput.toLowerCase();
      const filtered = transRaw?.filter((el) => {
        return (
          el.remark?.toLowerCase().includes(lower) ||
          el.expenseType.expenseName?.toLowerCase().includes(lower) ||
          el.paidUser.userName?.toLowerCase().includes(lower) ||
          el.totalAmt?.toString().includes(lower)
        );
      });
      setTrans(filtered);
    }
  }, [searchInput, transRaw]);

  useEffect(() => {
    setCurMenu("TRANS");
    getTrans();
    setSelectedTran(null);
  }, [yearInput]);

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
          <div className="w-screen h-[calc(100svh-70px)] bg-white overflow-y-auto flex flex-col gap-2 items-center relative">
            <div className="flex justify-center w-full sticky top-[0] z-10 bg-slate-100 shadow">
              <p className="text-2xl font-bold py-2">Transactions</p>
            </div>
            {/* search */}
            <div className="w-11/12  flex items-center gap-2">
              <div className="flex w-full py-1 gap-1 border px-1">
                <input
                  className="bg-white w-full"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className="px-2 text-black flex justify-center items-center">
                  <SearchIcon className="w-[15px]" />
                </div>
              </div>
              <select
                className="border-b bg-amber-100 text-center w-[100px] py-1"
                name="year"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
              >
                {Array.from({ length: 10 }, (_, i) => 2021 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <button
                className="bg-orange-700 text-center w-[100px] py-1 text-white cursor-pointer"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
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
