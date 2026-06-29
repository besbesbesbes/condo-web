import React, { useCallback, useEffect, useState } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import useUserStore from "../stores/user-store";
import { getTransApi } from "../apis/trans-api";
import { NumericFormat } from "react-number-format";
import TransDetail from "./TransDetail";
import { AppIcon, NoTrans, SearchIcon, TransIcon } from "../icons/menuIcon";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Trans() {
  const { t, i18n } = useTranslation();
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const [trans, setTrans] = useState(null);
  const [transRaw, setTransRaw] = useState(null);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const [selectedTran, setSelectedTran] = useState(null);
  const today = new Date();
  const [yearInput, setYearInput] = useState(today.getFullYear());
  const [searchInput, setSearchInput] = useState("");
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const navigate = useNavigate();

  const getTrans = useCallback(async () => {
    setIsLoad(true);
    try {
      const result = await getTransApi(token, { yearInput });
      console.log(result.data);
      setTransRaw(result.data.trans);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
      if (err?.response?.data?.msg || err.message == "invalid signature") {
        setUser(null);
        setToken("");
        navigate(0);
      }
    } finally {
      setIsLoad(false);
    }
  }, [token, yearInput, setIsLoad, setUser, setToken, navigate]);

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
    setCurMenu("trans");
    getTrans();
    setSelectedTran(null);
  }, [yearInput, getTrans, setCurMenu]);

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
          <div className="w-screen bg-app overflow-y-auto flex flex-col gap-2 items-center relative mb-[75px] mt-[50px]">
            {/* header */}
            <Header />
            {/* search */}
            <div className="w-11/12  flex flex-col items-center gap-3 my-1 mt-[14px]">
              <div className=" flex w-full items-center gap-1 concave bg-surface">
                <input
                  className="input-field w-full h-[32px] pl-3"
                  type="text"
                  value={searchInput}
                  placeholder={t("searchField")}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className="flex-none w-[32px] h-[32px] flex justify-center items-center">
                  <SearchIcon className="w-[15px]" />
                </div>
              </div>
              <div className="w-full flex justify-end items-center gap-2">
                <select
                  className="input-field pl-4 w-[100px] h-[32px] convex bg-surface"
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
                  className="btn btn-primary text-text-reverse convex bg-surface"
                  onClick={() => window.location.reload()}
                >
                  {t("refresh")}
                </button>
              </div>
            </div>
            <div className="w-11/12  flex flex-col gap-1">
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
                          },
                        )
                      : null;
                  const showDateHeader = curDate !== prevDate;
                  const formattedDate = curDate.replace(" ", "-");

                  return (
                    <div
                      className="w-full flex flex-col items-center gap-2 py-1"
                      key={idx}
                    >
                      {/* {showDateHeader && (
                        <div className="w-11/12 h-[20px] text-center text-[12px] convex flex items-center justify-center font-bold">
                          {formattedDate}
                        </div>
                      )} */}
                      <div
                        className={`flex w-full items-center convex cursor-pointer bg-surface rounded-xl py-3 px-2 gap-2 ${
                          el.userId === user.userId ? "bg-surface" : ""
                        }`}
                        onClick={(e) => hdlSelectedTran(e, el)}
                      >
                        <div className="w-[50px] gap-2 flex flex-col justify-between items-center">
                          {/* create user */}
                          <div className="font-bold text-center">
                            <div
                              className={`w-[24px] h-[24px] flex justify-center items-center convex text-[12px]  text-text-reverse ${el.user.userName.charAt(0) === "K" ? "bg-primary" : "bg-accent"}`}
                            >
                              {el.user.userName.charAt(0)}
                            </div>
                          </div>
                          {/* Month */}
                          <div className="text-[12px] font-bold text-center">
                            {new Date(el.recordDate).toLocaleString(
                              i18n.language === "en" ? "en-US" : "th-TH",
                              {
                                month: "short",
                              },
                            )}
                          </div>
                        </div>
                        <div className="w-[50px] flex flex-col">
                          {/* date */}
                          <div className=" text-center text-[12px] font-bold border-b border-main">
                            {new Date(el.recordDate).getDate()}
                          </div>

                          {/* time */}
                          <div className="text-[12px] text-center">
                            {new Date(el.recordDate).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="w-full flex flex-col px-2 py-1 gap-2">
                          <div className="grid grid-cols-2 font-bold">
                            {/* type  */}
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

                              <div
                                className={`w-[16px] h-[16px] flex-none flex justify-center items-center convex text-[10px]  text-text-reverse ${el.paidUser.userName.charAt(0) === "K" ? "bg-primary" : "bg-accent"}`}
                              >
                                {el.paidUser.userName.charAt(0)}
                              </div>

                              {/* remark */}
                              {el.remark ? (
                                <div className="">
                                  |{" "}
                                  <span className="text-accent">
                                    {el.remark}
                                  </span>
                                  {el.isHavePhoto && <span>📷</span>}
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
                <div className="flex flex-col justify-center items-center m-4 gap-2 text-text/50">
                  <NoTrans className="w-[40px] h-[40px]" />
                  <p className="text-center">{t("noRecordFound")}</p>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default Trans;
