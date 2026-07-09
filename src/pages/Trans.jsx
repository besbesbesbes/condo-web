import React, { useCallback, useEffect, useState } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import useUserStore from "../stores/user-store";
import { getTransApi } from "../apis/trans-api";
import { NumericFormat } from "react-number-format";
import TransDetail from "./TransDetail";
import {
  AppIcon,
  CameraIcon,
  NoTrans,
  SearchIcon,
  ToTopArrow,
  TransIcon,
} from "../icons/menuIcon";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function formatDateTime(date, lang = "en") {
  const d = new Date(date);

  const day = d.getDate();
  const month = d.toLocaleString(lang, { month: "short" });
  const year = d.getFullYear().toString().slice(-2);
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} | ${hour}:${minute}`;
}

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
  const [showToTop, setShowToTop] = useState(false);
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

  const hdlToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
    if (token) getTrans();
    setSelectedTran(null);
  }, [yearInput, getTrans, setCurMenu]);

  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 300); // <-- show after scrolling 300px
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
          <div className="w-screen bg-app overflow-y-auto flex flex-col gap-2 items-center relative mb-[75px] mt-[50px]">
            {/* header */}
            <Header />
            {/* search */}
            <div className="w-11/12  flex flex-col items-center gap-3 my-1 mt-[14px]">
              <div className="w-full flex gap-2">
                <div className=" flex w-full flex-1 items-center gap-1 concave bg-surface">
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
                <select
                  className="input-field flex-none pl-4 w-[100px] h-[32px] convex bg-surface"
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
              </div>
            </div>
            <div className="w-11/12  flex flex-col gap-4">
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
                  return (
                    <div
                      key={idx}
                      className="w-full min-h-[30px] convex bg-surface flex flex-col p-2 gap-1  items-center"
                      onClick={(e) => hdlSelectedTran(e, el)}
                    >
                      <div className="w-full flex gap-1 h-[40px] flex-none justify-between px-1 items-center">
                        {/* type */}
                        <p className="flex-1 text-[19px]">
                          {el.expenseType?.expenseName}
                        </p>
                        {/* totalAmt */}
                        <NumericFormat
                          className="flex-none w-[120px]  text-right text-[26px]"
                          value={el.totalAmt}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </div>
                      <div className="w-full px-1 flex gap-1 justify-between items-center">
                        {/* paidUser & remark */}
                        <div className="flex gap-1 items-center">
                          <div
                            className={`convex h-[22px] px-2 flex justify-center items-center text-[12px] text-text-reverse ${user.userId === el.paidUserId ? "bg-accent" : "bg-friend"} `}
                            onClick={() => console.log(user)}
                          >
                            {el.paidUser?.userName}
                          </div>
                          {el.isHavePhoto && (
                            <CameraIcon className="w-[16px] h-[16px]" />
                          )}
                          {el.remark && (
                            <p className="text-[14px]">
                              {" | "}{" "}
                              <span className="italic">{el.remark}</span>
                            </p>
                          )}
                        </div>
                        {/* myProtion and myAmt */}
                        <div className="flex items-center gap-1 text-[15px]">
                          <span>(</span>
                          <NumericFormat
                            className="text-center"
                            value={
                              user.userId === el.paidUserId
                                ? el.myPortion * 100
                                : (1 - Number(el.myPortion)) * 100
                            }
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                            fixedDecimalScale
                            suffix="%"
                          />
                          <span>)</span>
                          <NumericFormat
                            className="text-right"
                            value={
                              user.userId === el.paidUserId
                                ? el.myAmt
                                : el.otherAmt
                            }
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                          />
                        </div>
                      </div>
                      <div className="w-full px-1 flex gap-1 justify-between items-center mt-1 relative">
                        {/* date time */}
                        <div className="w-[150px] flex-none  flex items-center gap-1">
                          <p className="text-text-50 text-[12px]">{t("by")}</p>
                          <div
                            className={`text-[12px] w-[18px] h-[18px] flex-none convex px-1 flex justify-center items-center ${el.user?.userName === user.userName ? "bg-accent" : "bg-friend"}`}
                          >
                            {el.user?.userName.charAt(0)}
                          </div>
                          <p className="text-[12px] ml-1 text-text-50">
                            {formatDateTime(el.recordDate, i18n.language)}
                          </p>
                        </div>
                        {/* tags */}
                        <div className="flex-1 flex gap-[2px] justify-end translate-x-1 flex-wrap">
                          {el.tagTrans.map((el, idx) => (
                            <div
                              key={idx}
                              className="px-2 py-1 convex text-[13px] h-[20px] text-text bg-tag text-text-reverse flex justify-center items-center"
                            >
                              {el?.tag?.tagTxt}
                            </div>
                          ))}{" "}
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
          </div>{" "}
          {/* to top arrow */}
          {showToTop && (
            <button
              className="w-[40px] h-[40px] concave fixed bottom-19 right-4 bg-primary flex justify-center items-center animate-fade-in"
              onClick={hdlToTop}
            >
              <ToTopArrow className="w-[24px] h-[24px]" />
            </button>
          )}
          <Footer />
        </>
      )}
    </div>
  );
}

export default Trans;
