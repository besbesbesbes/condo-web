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
  NextIcon,
  NoTrans,
  PrevIcon,
  SearchIcon,
  SortNewIcon,
  SortOldIcon,
  ToTopIcon,
  TransIcon,
} from "../icons/menuIcon";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AnimatedSection from "../components/AnimatedSection";

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
  const isLoad = useMainStore((state) => state.isLoad);
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);
  const navigate = useNavigate();
  const [showToTop, setShowToTop] = useState(false);
  const hasTrans = Array.isArray(trans) && trans.length > 0;
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("new");
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth(); // 0-11
  const month = monthIndex + 1; // 1-12
  const years = Array.from({ length: 11 }, (_, i) => 2022 + i);

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

  const prevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  const changeYear = (e) => {
    const selectedYear = Number(e.target.value);
    setCurrentDate(new Date(selectedYear, monthIndex, 1));
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
      setShowToTop(window.scrollY > 30); // <-- show after scrolling 300px
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
            <AnimatedSection
              className="w-10/11 flex items-center justify-between mt-3 gap-2"
              index={0}
            >
              <AnimatedSection
                index={1}
                className="h-[30px] flex-1 concave bg-surface flex justify-between items-center px-2"
              >
                <input
                  className=" w-full focus:outline-none pl-1 h-[30px]"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={t("searchField")}
                />
                {searchText ? (
                  <div
                    className="h-[20px] text-[11px] bg-accent text-text-reverse convex px-2 flex items-center justify-center"
                    onClick={() => setSearchText("")}
                  >
                    {t("clear")}
                  </div>
                ) : (
                  <SearchIcon className="w-[20px] h-[20px] flex-none" />
                )}
              </AnimatedSection>
              {/* sort */}
              {sort === "new" ? (
                <AnimatedSection index={2}>
                  <button
                    className="flex-none h-[30px] w-[80px] flex justify-center items-center convex btn-primary text-text-reverse gap-1"
                    onClick={() =>
                      setSort((prev) => (prev === "new" ? "old" : "new"))
                    }
                  >
                    <SortNewIcon className="w-[20px] h-[20px]" />
                    <p>{t("new")}</p>
                  </button>{" "}
                </AnimatedSection>
              ) : (
                <AnimatedSection index={2}>
                  <button
                    className="flex-none h-[30px] w-[80px] flex justify-center items-center convex btn-primary text-text-reverse gap-1"
                    onClick={() =>
                      setSort((prev) => (prev === "new" ? "old" : "new"))
                    }
                  >
                    <SortOldIcon className="w-[20px] h-[20px]" />
                    <p>{t("old")}</p>
                  </button>
                </AnimatedSection>
              )}
            </AnimatedSection>
            {/* filter */}
            <AnimatedSection
              className="w-10/11 h-[40px] flex items-center justify-between gap-2"
              index={1}
            >
              <div className="w-[80px] h-[30px] convex bg-surface rounded-lg px-2">
                <select
                  value={year}
                  onChange={changeYear}
                  className="w-full h-full bg-transparent outline-none text-center appearance-none cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between flex-1 px-2">
                <button
                  className="w-[35px] h-[35px] flex justify-center items-center bg-surface convex rounded-full"
                  onClick={prevMonth}
                >
                  <PrevIcon className="w-5 h-5" />
                </button>

                <p className="text-lg font-semibold">
                  {t(currentDate.toLocaleString("en-US", { month: "long" }))}
                </p>

                <button
                  className="w-[35px] h-[35px] flex justify-center items-center bg-surface convex rounded-full"
                  onClick={nextMonth}
                >
                  <NextIcon className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setCurrentDate(new Date())}
                className="w-[80px] h-[30px] convex rounded-lg"
              >
                {t("today")}
              </button>
            </AnimatedSection>
            {/* Trans list */}
            <AnimatedSection className="w-11/12  flex flex-col gap-2 mb-2">
              {hasTrans
                ? trans.map((el, idx) => (
                    <AnimatedSection
                      index={1}
                      delay={idx > 10 ? 0 : idx * 32}
                      key={el.tranId}
                      className=" w-full min-h-[30px] convex bg-surface flex flex-col p-2 gap-1 items-center"
                      onClick={(e) => hdlSelectedTran(e, el)}
                    >
                      <div className="w-full flex gap-1 h-[40px] flex-none justify-between px-1 items-center">
                        {/* type */}
                        <AnimatedSection
                          index={1}
                          delay={idx > 10 ? 0 : idx * 32 * 2}
                          className="flex-1 text-[16px]"
                        >
                          {el.expenseType?.expenseName}
                        </AnimatedSection>
                        {/* totalAmt */}
                        <AnimatedSection
                          index={1}
                          delay={idx > 10 ? 0 : idx * 32 * 3}
                        >
                          <NumericFormat
                            className="flex-none w-[120px]  text-right text-[20px] font-bold"
                            value={el.totalAmt}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                          />
                        </AnimatedSection>
                      </div>
                      <div className="w-full px-1 flex gap-1 justify-between items-center">
                        {/* paidUser & remark */}
                        <AnimatedSection
                          index={1}
                          delay={idx > 10 ? 0 : idx * 32 * 4}
                          className="flex gap-1 items-center"
                        >
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
                        </AnimatedSection>
                        {/* myProtion and myAmt */}
                        <AnimatedSection
                          index={1}
                          delay={idx > 10 ? 0 : idx * 32 * 5}
                          className="flex items-center gap-1 text-[15px]"
                        >
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
                        </AnimatedSection>
                      </div>
                      <div className="w-full px-1 flex gap-1 justify-between items-center mt-1 relative">
                        {/* date time */}
                        <AnimatedSection
                          index={1}
                          delay={idx > 10 ? 0 : idx * 32 * 6}
                          className="w-[150px] flex-none  flex items-center gap-1"
                        >
                          <p className="text-text-50 text-[12px]">{t("by")}</p>
                          <div
                            className={`text-[12px] w-[18px] h-[18px] flex-none convex px-1 flex justify-center items-center ${el.user?.userName === user.userName ? "bg-accent" : "bg-friend"}`}
                          >
                            {el.user?.userName.charAt(0)}
                          </div>
                          <p className="text-[12px] ml-1 text-text-50">
                            {formatDateTime(el.recordDate, i18n.language)}
                          </p>
                        </AnimatedSection>
                        {/* tags */}
                        <AnimatedSection
                          index={1}
                          delay={idx > 10 ? 0 : idx * 32 * 7}
                          className="flex-1 flex gap-[2px] justify-end translate-x-1 flex-wrap"
                        >
                          {el.tagTrans.map((el, idx) => (
                            <AnimatedSection
                              index={1}
                              delay={idx > 10 ? 0 : idx * 50}
                              key={idx}
                              className="px-2 py-1 convex text-[13px] h-[20px] text-text bg-tag text-text-reverse flex justify-center items-center"
                            >
                              {el?.tag?.tagTxt}
                            </AnimatedSection>
                          ))}{" "}
                        </AnimatedSection>
                      </div>
                    </AnimatedSection>
                  ))
                : !isLoad && (
                    <div className="flex flex-col justify-center items-center m-4 gap-2 text-text/50">
                      <NoTrans className="w-[40px] h-[40px]" />
                      <p className="text-center">{t("noRecordFound")}</p>
                    </div>
                  )}
            </AnimatedSection>
          </div>{" "}
          {/* to top arrow */}
          {showToTop && (
            <AnimatedSection
              className="w-[44px] h-[44px] convex-full fixed bottom-19 left-1/2 -translate-x-1/2 bg-primary flex justify-center items-center animate-fade-in"
              onClick={hdlToTop}
            >
              <ToTopIcon className="w-[36px] h-[36px] text-text-reverse" />
            </AnimatedSection>
          )}
          <Footer />
        </>
      )}
    </div>
  );
}

export default Trans;
