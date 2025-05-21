import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import { NumericFormat } from "react-number-format";
import { addTran, getNewTranInfoApi } from "../apis/new-api";
import useUserStore from "../stores/user-store";
import ModalExpenseType from "../components/ModalExpenseType";
import ModalPaidBy from "../components/ModalPaidBy";
import { useNavigate } from "react-router-dom";
import { addTranMail } from "../apis/mail-api";
import { useTranslation } from "react-i18next";

function New() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const [users, setUsers] = useState({});
  const [types, setTypes] = useState({});
  const [input, setInput] = useState({
    recordDate: new Date().toISOString().slice(0, 10),
    recordTime: new Date().toTimeString().slice(0, 5),
    paidById: "",
    paidBy: "",
    type: "",
    typeId: "",
    totalAmt: "",
    myPortion: 0.5,
    myAmt: 0,
    otherAmt: 0,
    remark: "",
  });

  const hdlInput = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (
      input.totalAmt !== "" &&
      input.myPortion !== null &&
      input.myPortion !== undefined
    ) {
      const newMyAmt = (input.totalAmt * input.myPortion).toFixed(2); // Round to 2 decimal places
      const newOtherAmt = (input.totalAmt - newMyAmt).toFixed(2); // Round to 2 decimal places

      setInput((prev) => ({ ...prev, myAmt: newMyAmt, otherAmt: newOtherAmt }));
    }
  }, [input.totalAmt, input.myPortion]);

  const getNewTranInfo = async () => {
    setIsLoad(true);
    try {
      const result = await getNewTranInfoApi(token);
      console.log(result.data);
      if (!input.paidBy) {
        setInput({
          ...input,
          paidBy: result.data.paidUser,
          paidById: result.data.paidUserId,
        });
      }
      console.log(result.data.users);
      console.log(result.data.types);
      setUsers(result.data.users);
      setTypes(result.data.types);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const hdlAddTran = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    try {
      const result = await addTran(token, input);
      console.log(result);
      // Email
      let toEmail = "";
      if (user.userId === 1) {
        toEmail = "smt.bes@gmail.com, warittha.chtn@gmail.com";
      } else if (user.userId === 2) {
        toEmail = "smt.bes@gmail.com";
      }
      if (toEmail) {
        const mail = await addTranMail(token, {
          to: toEmail,
          subject: "[KB Expense] New record added!",
          text: `KB Expnese\n– New record added –\n\nPaid by: ${input.paidBy}\nType : ${input.type}\nAmount : ${input.totalAmt}\nRemark : ${input.remark}\n\nHave a nice day,\nKB-Admin`,
        });
        console.log(mail);
      }
      navigate("/");
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    setCurMenu("NEW");
    getNewTranInfo();
  }, []);

  return (
    <div>
      <div className="w-screen  bg-white overflow-y-auto flex flex-col gap-4 items-center relative mb-[75px] mt-[60px]">
        <div className="flex justify-center w-full fixed h-[50px] top-[0] z-10 bg-slate-100 shadow">
          <p className="text-2xl font-bold py-2">{t("newTransaction")}</p>
        </div>
        {/* record date */}
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[150px]  text-right pr-2 font-bold">
            {t("recordDate")} :
          </p>
          <input
            className="w-[150px] text-center border-b bg-amber-100"
            type="date"
            value={input.recordDate}
            name="recordDate"
            onChange={hdlInput}
          />
        </div>
        {/* record time */}
        <div className="w-10/12 flex justify-center gap-2">
          <p className="w-[150px] text-right pr-2 font-bold">
            {t("recordTime")} :
          </p>
          <input
            className="w-[150px] text-center border-b bg-amber-100"
            type="time"
            value={input.recordTime}
            name="recordTime"
            onChange={hdlInput}
          />
        </div>

        {/* paid by */}
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[150px]  text-right pr-2 font-bold">{t("payer")} :</p>
          <input
            className="w-[150px] text-center border-b bg-amber-100"
            type="text"
            value={input.paidBy}
            name="paidBy"
            onChange={hdlInput}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("paid_by_modal").showModal();
            }}
            readOnly
          />
        </div>
        {/* type */}
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[150px]  text-right pr-2 font-bold">{t("type")} :</p>
          <input
            className="w-[150px] text-center border-b bg-amber-100"
            type="text"
            value={input.type}
            name="type"
            onChange={hdlInput}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("expense_type_modal").showModal();
            }}
            readOnly
          />
        </div>
        {/* amount */}
        <div className="w-10/12 flex justify-center gap-2">
          <p className="w-[150px] text-right pr-2 font-bold">
            {t("totalAmount")} :
          </p>
          <NumericFormat
            className="w-[150px] text-center border-b bg-amber-100"
            value={input.totalAmt === "" ? "" : input.totalAmt}
            name="totalAmt"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            inputMode="decimal"
            onValueChange={(values) => {
              setInput((prev) => ({
                ...prev,
                totalAmt: values.floatValue ?? "", // fallback to "" when cleared
              }));
            }}
          />
        </div>
        {/* My Portion */}
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[150px]  text-right pr-2 font-bold">
            {t("payerPortion")} :
          </p>
          <NumericFormat
            className="w-[150px] text-center border-b bg-amber-100"
            value={input.myPortion === "" ? 0 : input.myPortion * 100}
            name="myPortion"
            suffix="%"
            thousandSeparator
            decimalScale={0}
            fixedDecimalScale
            allowNegative={false}
            inputMode="numeric"
            onValueChange={(values) => {
              setInput((prev) => ({
                ...prev,
                myPortion: values.floatValue ? values.floatValue / 100 : 0, // store as decimal (e.g., 0.25)
              }));
            }}
          />
        </div>
        {/* My Amount */}
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[150px]  text-right pr-2 font-bold">
            {t("payerAmount")} :
          </p>
          <NumericFormat
            className="w-[150px] text-center border-b bg-slate-200"
            value={input.myAmt === "" ? "" : input.myAmt}
            name="myAmt"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            inputMode="decimal"
            disabled
          />
        </div>
        {/* Other Amount */}
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[150px]  text-right pr-2 font-bold">
            {t("otherAmount")} :
          </p>
          <NumericFormat
            className="w-[150px] text-center border-b bg-slate-200"
            value={input.otherAmt === "" ? "" : input.otherAmt}
            name="otherAmt"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            inputMode="decimal"
            disabled
          />
        </div>
        {/* remark */}
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[150px]  text-left pr-2 font-bold">{t("remark")} :</p>
          <p className="w-[150px] text-center"></p>
        </div>
        <input
          className="w-10/12 text-left pl-2 border-b bg-amber-100"
          type="text"
          value={input.remark}
          name="remark"
          onChange={hdlInput}
        />
        {/* button add */}
        <button
          className="w-[150px] border-1 bg-orange-700 text-white cursor-pointer py-1 "
          onClick={hdlAddTran}
        >
          {t("add")}
        </button>
        {/* <button
          className="w-[150px] border-1 bg-orange-700 text-white cursor-pointer py-10 "
          onClick={() => {
            console.log(input);
            console.log(user);
          }}
        >
          Input
        </button> */}
      </div>
      <Footer />
      {/* modal paid by */}
      <dialog id="paid_by_modal" className="modal">
        <ModalPaidBy users={users} setInput={setInput} />
      </dialog>
      {/* modal expense type */}
      <dialog id="expense_type_modal" className="modal">
        <ModalExpenseType
          input={input}
          types={types}
          setInput={setInput}
          getNewTranInfo={getNewTranInfo}
        />
      </dialog>
    </div>
  );
}

export default New;
