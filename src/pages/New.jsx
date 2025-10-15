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
import { AddPhoto } from "../icons/menuIcon";

function New() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const [users, setUsers] = useState({});
  const [types, setTypes] = useState({});
  const [files, setFiles] = useState([]);
  const [errMsg, setErrMsg] = useState("");
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
    instPlan: 0,
    inst: [],
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
      // validate
      if (files.length > 10) {
        console.log("Maximum upload 10 images per time...");
        return;
      }
      const body = new FormData();
      body.append("recordDate", input.recordDate);
      body.append("recordTime", input.recordTime);
      body.append("paidById", input.paidById);
      body.append("paidBy", input.paidBy);
      body.append("type", input.type);
      body.append("typeId", input.typeId);
      body.append("totalAmt", input.totalAmt);
      body.append("myPortion", input.myPortion);
      body.append("myAmt", input.myAmt);
      body.append("otherAmt", input.otherAmt);
      body.append("remark", input.remark);
      body.append("inst", JSON.stringify(input.inst));
      files.forEach((file) => {
        body.append("images", file);
      });
      // api
      const result = await addTran(token, body);
      console.log(result);
      // Email
      let toEmail = "";
      if (user.userId === 1) {
        // toEmail = "smt.bes@gmail.com, warittha.chtn@gmail.com";
        toEmail = "smt.bes@gmail.com";
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
      const msg = err?.response?.data?.msg || err.message;
      console.log(msg);
      setErrMsg(msg);
      setTimeout(() => {
        setErrMsg("");
        navigate("/");
      }, 5000);
    } finally {
      setIsLoad(false);
    }
  };

  const hdlFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...imageFiles]);
  };

  const removeImage = (indexToRemove) => () => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const hdlGenInstPlan = () => {
    let planCount = Number(input.instPlan);
    const baseAmt = Number(input.otherAmt);

    if (!planCount || !baseAmt || baseAmt <= 0) return;

    // Clamp planCount between 2 and 60
    if (planCount < 2) planCount = 2;
    if (planCount > 60) planCount = 60;

    const startDate = new Date(input.recordDate);
    const roundedAmt = +(baseAmt / planCount).toFixed(2);

    const inst = Array.from({ length: planCount }).map((_, i) => {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${yyyy}-${mm}-${dd}`;
      return { date: formattedDate, amt: roundedAmt };
    });

    const adjustedInst = adjustInstAmtToMatchTotal(inst, baseAmt);

    setInput((prev) => ({
      ...prev,
      instPlan: planCount,
      inst: adjustedInst,
    }));
  };

  const adjustInstAmtToMatchTotal = (instArr, totalAmt) => {
    const sumExceptLast = instArr
      .slice(0, -1)
      .reduce((sum, item) => sum + Number(item.amt || 0), 0);
    const lastAmt = (totalAmt - sumExceptLast).toFixed(2); // round to 2 decimals
    const newInst = [...instArr];
    newInst[newInst.length - 1].amt = Number(lastAmt);
    return newInst;
  };

  useEffect(() => {
    setInput((prev) => ({
      ...prev,
      inst: [],
    }));
  }, [input.instPlan, input.totalAmt, input.myPortion]);

  useEffect(() => {
    setCurMenu("NEW");
    getNewTranInfo();
  }, []);

  return (
    <div>
      <div className="w-screen  bg-white overflow-y-auto flex flex-col gap-2 items-center relative mb-[75px] mt-[60px]">
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
        {/* installment plan */}
        <div className="w-10/12 flex justify-center gap-2">
          <p className="w-[150px] text-right pr-2 font-bold">
            {t("Installment Plan")} :
          </p>
          <NumericFormat
            className="w-[150px] text-center border-b bg-amber-100"
            value={input.instPlan === "" ? "" : input.instPlan}
            name="instPlan"
            thousandSeparator
            decimalScale={0}
            fixedDecimalScale
            allowNegative={false}
            inputMode="decimal"
            onValueChange={(values) => {
              setInput((prev) => ({
                ...prev,
                instPlan: values.floatValue ?? "", // fallback to "" when cleared
              }));
            }}
          />
        </div>
        {typeof input.instPlan === "number" && input.instPlan > 0 && (
          <div className="w-10/12 flex justify-center gap-2">
            <p className="w-[150px] text-right pr-2 font-bold"></p>
            <div
              className="bg-orange-500 px-2 text-white font-bold hover:cursor-pointer"
              onClick={hdlGenInstPlan}
            >
              Generate
            </div>
          </div>
        )}
        {/* installment list */}
        {input.inst.map((el, idx) => (
          <div key={idx} className="w-10/12 flex justify-center gap-2">
            <p>{idx + 1}</p>
            {/* Date input */}
            <input
              className="w-[150px] text-center border-b bg-amber-100"
              type="date"
              value={el.date}
              onChange={(e) => {
                if (idx === 0) {
                  // Update all dates based on index 0
                  const baseDate = new Date(e.target.value);
                  if (isNaN(baseDate)) return;

                  const updatedInst = input.inst.map((item, i) => {
                    const newDate = new Date(baseDate);
                    newDate.setMonth(baseDate.getMonth() + i);
                    const yyyy = newDate.getFullYear();
                    const mm = String(newDate.getMonth() + 1).padStart(2, "0");
                    const dd = String(newDate.getDate()).padStart(2, "0");
                    return {
                      ...item,
                      date: `${yyyy}-${mm}-${dd}`,
                    };
                  });

                  setInput((prev) => ({ ...prev, inst: updatedInst }));
                } else {
                  const newInst = [...input.inst];
                  newInst[idx].date = e.target.value;
                  setInput((prev) => ({ ...prev, inst: newInst }));
                }
              }}
            />
            {/* Amount input */}
            <NumericFormat
              className="w-[150px] text-center border-b bg-slate-200"
              value={el.amt === "" ? "" : el.amt}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              inputMode="decimal"
              onValueChange={(values) => {
                const newInst = [...input.inst];
                newInst[idx].amt = values.floatValue ?? "";
                setInput((prev) => ({ ...prev, inst: newInst }));
              }}
              disabled
            />
          </div>
        ))}

        {/* <div onClick={() => console.log(input)}>input</div> */}
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
        {/* photo */}
        <input
          type="file"
          id="input-file"
          className="opacity-0 absolute w-0"
          multiple
          accept="image/*"
          onChange={hdlFileChange}
        />
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[150px]  text-left pr-2 font-bold">{t("photo")} :</p>
          <p className="w-[150px] text-center"></p>
        </div>
        <div className=" w-10/12 h-[100px] flex items-center gap-2 overflow-x-auto overflow-y-hidden">
          {/* add photo */}

          <div
            className="w-[80px] h-[80px] border flex-shrink-0 box-border bg-amber-100 flex justify-center items-center cursor-pointer"
            onClick={() => document.getElementById("input-file").click()}
          >
            <AddPhoto className="w-[40px]" />
          </div>
          {/* list of files */}
          {files.map((el, idx) => (
            <div
              key={idx}
              className="w-[80px] h-[80px] border flex-shrink-0 box-border flex justify-center items-center relative"
            >
              <img
                src={URL.createObjectURL(el)}
                alt={`preview-${idx}`}
                className="object-cover w-full h-full"
              />
              {/* remove image */}
              <div
                className="w-[20px] h-[20px] bg-amber-100 flex-shrink-0 absolute flex justify-center items-center font-bold rounded-full top-0 right-0 cursor-pointer"
                onClick={removeImage(idx)}
              >
                X
              </div>
            </div>
          ))}
          {/* <button
            className="w-[80px] h-[80px] border flex-shrink-0 box-border flex justify-center items-center bg-red-100 text-sm cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              files.forEach((el) => {
                console.log(URL.createObjectURL(el));
              });
            }}
          >
            List Files
          </button> */}
        </div>

        {/* button add */}
        {errMsg === "invalid_grant" && (
          <p className="text-red-500 text-center mt-2 mb-[60px]">
            Transaction added successfully but <br />
            Email can't send, will go to TRANS in 3 sec.
          </p>
        )}

        {!errMsg && (
          <button
            className="w-[150px] border-1 bg-orange-700 text-white cursor-pointer py-1 mb-[50px]"
            onClick={hdlAddTran}
          >
            {t("add")}
          </button>
        )}

        {/* <button
          className="w-[150px] border-1 bg-orange-700 text-white cursor-pointer py-1 "
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
