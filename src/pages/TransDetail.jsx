import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { NumericFormat } from "react-number-format";
import { editTranApi } from "../apis/trans-api";
import { getNewTranInfoApi } from "../apis/new-api";
import useMainStore from "../stores/main-store";
import useUserStore from "../stores/user-store";
import ModalConfirmDelete from "../components/ModalConfirmDelete";
import ModalExpenseType from "../components/ModalExpenseType";
import ModalPaidBy from "../components/ModalPaidBy";
import { useTranslation } from "react-i18next";
import ModalPhoto from "../components/ModalPhoto";
import { AddPhoto } from "../icons/menuIcon";

function TransDetail({ setSelectedTran, selectedTran, getTrans }) {
  const { t } = useTranslation();
  const token = useUserStore((state) => state.token);
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const [users, setUsers] = useState({});
  const [types, setTypes] = useState({});
  const [selPhotoUrl, setSelPhotoUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [input, setInput] = useState({
    tranId: "",
    recordDate: "",
    recordTime: "",
    paidById: "",
    paidBy: "",
    type: "",
    typeId: "",
    totalAmt: "",
    myPortion: 0,
    myAmt: 0,
    otherAmt: 0,
    remark: "",
  });

  const hdlInput = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlEditTran = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    try {
      if (files.length > 10) {
        console.log("Maximum upload 10 images per time...");
        return;
      }
      const body = new FormData();
      body.append("tranId", input.tranId);
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
      files.forEach((file) => {
        body.append("images", file);
      });
      // api
      const result = await editTranApi(token, body);
      console.log(result);
      setSelectedTran(null);
      getTrans();
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const getNewTranInfo = async () => {
    setIsLoad(true);
    try {
      const result = await getNewTranInfoApi(token);
      console.log(result.data);
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

  useEffect(() => {
    console.log(selectedTran);
    setInput((prev) => ({
      ...prev,
      tranId: selectedTran.tranId,
      recordDate: new Date(selectedTran.recordDate).toISOString().split("T")[0],
      recordTime: new Date(selectedTran.recordDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      paidBy: selectedTran.paidUser.userName,
      paidById: selectedTran.paidUserId,
      type: selectedTran.expenseType.expenseName,
      typeId: selectedTran.expenseTypeId,
      totalAmt: selectedTran.totalAmt,
      myPortion: selectedTran.myPortion,
      myAmt: selectedTran.myAmt,
      otherAmt: selectedTran.otherAmt,
      remark: selectedTran.remark,
    }));
    getNewTranInfo();
  }, []);
  return (
    <>
      <div className="w-screen bg-white overflow-y-auto flex flex-col gap-4 items-center relative pb-[75px] mt-[60px]">
        <div className="flex justify-center w-full fixed h-[50px] top-[0] z-10 bg-slate-100 shadow">
          <p className="text-2xl font-bold py-2">{t("transactionDetail")}</p>
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
            value={input.myPortion === "" ? "" : input.myPortion * 100}
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
                myPortion: values.floatValue ? values.floatValue / 100 : "", // store as decimal (e.g., 0.25)
              }));
            }}
          />
        </div>
        {/* My Amount */}
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[150px]  text-right pr-2 font-bold">
            {t("payerPortion")} :
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
        {/* photo */}
        {selectedTran?.isHavePhoto && (
          <>
            <div className=" w-10/12 flex justify-center gap-2">
              <p className="w-[150px]  text-left pr-2 font-bold">
                {t("photo")} :
              </p>
              <p className="w-[150px] text-center"></p>
            </div>
            <div className=" w-10/12 h-[100px] flex items-center gap-2 overflow-x-auto overflow-y-hidden">
              {/* list of files */}
              {selectedTran.photos?.map((el, idx) => (
                <div
                  key={idx}
                  className="w-[80px] h-[80px] border flex-shrink-0 box-border flex justify-center items-center relative cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelPhotoUrl(el.photoUrl);
                    document.getElementById("photo_modal").showModal();
                  }}
                >
                  <img
                    src={el.photoUrl}
                    alt={`preview-${el.photoUrl}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {/*add photo */}
        <input
          type="file"
          id="input-file"
          className="opacity-0 absolute w-0"
          multiple
          accept="image/*"
          onChange={hdlFileChange}
        />
        <div className=" w-10/12 flex justify-center gap-2">
          <p className="w-[150px]  text-left pr-2 font-bold">
            {t("addPhoto")} :
          </p>
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
        </div>
        {/* button */}
        <div className="flex gap-4">
          <button
            className="w-[100px] border-1 bg-orange-500 text-white cursor-pointer py-1 "
            onClick={hdlEditTran}
          >
            {t("save")}
          </button>
          <button
            className="w-[100px] border-1 bg-orange-700 text-white cursor-pointer py-1 "
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("confirm-delete-modal").showModal();
            }}
          >
            {t("delete")}
          </button>
        </div>
        {/* <button onClick={() => console.log(input)}>Input</button> */}
        <button
          className="w-[150px] border-1 bg-slate-500 text-white cursor-pointer py-1 mt-auto mb-10"
          onClick={() => setSelectedTran(null)}
        >
          {t("back")}
        </button>
      </div>
      <Footer />
      {/* modal confirm delete */}
      <dialog id="confirm-delete-modal" className="modal">
        <ModalConfirmDelete
          selectedTran={selectedTran}
          setSelectedTran={setSelectedTran}
          getTrans={getTrans}
        />
      </dialog>
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
      {/* modal photo */}
      <dialog id="photo_modal" className="modal">
        <ModalPhoto
          selPhotoUrl={selPhotoUrl}
          setSelPhotoUrl={setSelPhotoUrl}
          setIsLoad={setIsLoad}
          setSelectedTran={setSelectedTran}
        />
      </dialog>
    </>
  );
}

export default TransDetail;
