import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import ModalPaidBy from "../components/ModalPaidBy";
import { getReportInfoApi } from "../apis/report-api";
import useUserStore from "../stores/user-store";
import { NumericFormat } from "react-number-format";
import { useTranslation } from "react-i18next";

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
      <div className="w-screen bg-white overflow-y-auto flex flex-col gap-2 items-center relative  mb-[75px] mt-[60px]">
        <div className="flex justify-center w-full fixed h-[50px] top-[0] z-10 bg-slate-100 shadow">
          <p className="text-2xl font-bold py-2">{t("report")}</p>
        </div>
        {/* User select */}
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[80px]  text-right pr-2 font-bold">
            {t("userName")} :
          </p>
          <input
            className="w-[150px] text-center border-b bg-amber-100"
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
        <div className="w-10/12 flex justify-center gap-1">
          <p className="w-[80px] text-right pr-2 font-bold">{t("month")} :</p>
          <select
            className="border-b bg-amber-100 text-center w-[75px]"
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
            className="border-b bg-amber-100 text-center w-[75px]"
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
          <div className="w-10/12 font-bold text-center bg-orange-50">
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
              className="text-right  border-b border-black"
              value={resultSum?.sumTotalAmt}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
            />
            <NumericFormat
              className="text-right border-b border-black"
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
              className="text-right border-b border-black"
              value={resultSumOther?.sumTotalAmt}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
            />
            <NumericFormat
              className="text-right border-b border-black"
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
              className="text-right border-b-4 border-double border-black"
              value={resultSum?.sumTotalAmt - resultSumOther?.sumTotalAmt}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
            />
            <NumericFormat
              className="text-right border-b-4 border-double border-black"
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
