import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import ModalPaidBy from "../components/ModalPaidBy";
import { getReportInfoApi } from "../apis/report-api";
import useUserStore from "../stores/user-store";
import { NumericFormat } from "react-number-format";
import { useTranslation } from "react-i18next";
import { AppIcon, ReportIcon } from "../icons/menuIcon";

function Report() {
  const { t } = useTranslation();
  const token = useUserStore((state) => state.token);
  const { userName, userId } = useUserStore((state) => state.user);
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const [users, setUsers] = useState({});
  const today = new Date();
  const [result, setResult] = useState(null);
  const [resultSum, setResultSum] = useState(null);
  const [resultOther, setResultOther] = useState(null);
  const [resultSumOther, setResultSumOther] = useState(null);
  const [body, setBody] = useState(null);
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const [input, setInput] = useState({
    userName: userName,
    userId: userId,
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  const hdlInput = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const getReportInfo = async () => {
    setIsLoad(true);
    try {
      const result = await getReportInfoApi(token, input);
      console.log(result.data);
      setBody(result.data.body);
      setUsers(result.data.users);
      setResult(result.data.result);
      setResultSum(result.data.resultSum);
      setResultOther(result.data.resultOther);
      setResultSumOther(result.data.resultSumOther);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    console.log("Use effect");
    setCurMenu("REPORT");
    getReportInfo();
  }, [input.userName, input.month, input.year]);

  return (
    <div>
      <div className="w-screen bg-app overflow-y-auto flex flex-col gap-2 items-center relative mb-[75px] mt-[60px]">
        <div className="flex justify-between px-3 items-center w-full fixed h-[50px] top-[0] z-10 bg-surface shadow">
          <div className="flex items-center">
            <div className="w-[30px] h-[30px] convex-full bg-primary flex justify-center items-center">
              <AppIcon className="w-[20px] h-[20px] text-text-reverse" />
            </div>
            <ReportIcon className="w-[30px] h-[20px]" />
            <p className="text-xl py-2">{t("report")}</p>
          </div>
          <div
            className={`w-[30px] h-[30px] flex justify-center items-center convex bg-primary ${userName?.[0]?.toUpperCase() === "K" ? "bg-primary" : "bg-accent"}`}
          >
            <p className="text-text-reverse">{userName?.[0]?.toUpperCase()}</p>
          </div>
        </div>
        {/* User select */}
        <div className=" w-10/12 flex justify-center items-center gap-2 mt-4">
          <p className="w-[100px] flex-none text-right pr-2">
            {t("userName")} :
          </p>
          <input
            className="input-field convex flex w-[150px] text-center bg-surface"
            type="text"
            value={input.userName}
            name="user"
            onChange={hdlInput}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("user_select_modal").showModal();
            }}
            readOnly
          />
        </div>
        {/*Report date */}
        <div className=" w-10/12 flex justify-center items-center gap-2 mt-4">
          <p className="w-[100px] flex-none text-right pr-2 ">{t("month")} :</p>
          <select
            className="input-field convex bg-surface text-center w-[75px]"
            name="month"
            value={input.month}
            onChange={hdlInput}
          >
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="input-field text-center w-[75px]  convex bg-surface"
            name="year"
            value={input.year}
            onChange={hdlInput}
          >
            {Array.from({ length: 10 }, (_, i) => 2021 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        {/* report list */}
        <div className="w-full flex items-center flex-col gap-2 mt-5">
          <div className="w-10/12 font-bold text-center bg-surface-soft text-primary">
            {body?.userName}
          </div>
          {/* header */}
          <div className="w-10/12 grid grid-cols-3 font-bold text-right">
            <div></div>
            <div>{t("total")}</div>
            <div>{t("receivable")}</div>
          </div>
          {result?.length ? (
            result.map((el, idx) => (
              <div key={idx} className="w-10/12 grid grid-cols-3 ">
                <div>{el.typeName}</div>
                <NumericFormat
                  className="text-right"
                  value={el.sumTotalAmt}
                  displayType="text"
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                />
                <NumericFormat
                  className="text-right"
                  value={el.sumOtherAmt}
                  displayType="text"
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                />
              </div>
            ))
          ) : (
            <p>No Record Found</p>
          )}
          {/* total amt */}
          <div className="w-10/12 grid grid-cols-3 font-bold">
            <div></div>
            <NumericFormat
              className="text-right border-b border-surface"
              value={resultSum?.sumTotalAmt}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
            />
            <NumericFormat
              className="text-right border-b border-surface"
              value={resultSum?.sumOtherAmt}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
            />
          </div>
          {/* Other */}
          {/* <div className="w-10/12 mt-4 font-bold text-center bg-slate-100">
            <p>Other</p>{" "}
          </div> */}
          <div className="w-10/12 grid grid-cols-3">
            <div>
              <p className="text-right pr-1">(Minus) Other</p>
            </div>
            <NumericFormat
              className="text-right border-b border-surface"
              value={resultSumOther?.sumTotalAmt}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
            />
            <NumericFormat
              className="text-right border-b border-surface"
              value={resultSumOther?.sumOtherAmt}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
            />
          </div>
          <div className="w-10/12 grid grid-cols-3 font-bold">
            <div></div>
            <NumericFormat
              className="text-right border-b-4 border-double border-surface"
              value={resultSum?.sumTotalAmt - resultSumOther?.sumTotalAmt}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
            />
            <NumericFormat
              className="text-right border-b-4 border-double border-surface"
              value={resultSum?.sumOtherAmt - resultSumOther?.sumOtherAmt}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
            />
          </div>
        </div>
      </div>
      {/* <button onClick={() => console.log(input)}>Input</button> */}
      <Footer />
      {/* modal user select */}
      <dialog id="user_select_modal" className="modal">
        <ModalPaidBy
          users={users}
          setInput={setInput}
          headerTxt="Select User"
        />
      </dialog>
    </div>
  );
}

export default Report;
