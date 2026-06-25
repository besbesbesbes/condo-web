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
import AmtKeypad from "../components/AmtKeypad";
import {
  AddPhoto,
  AppIcon,
  TransIcon,
  TypeIcon,
  UserIcon,
} from "../icons/menuIcon";

function TransDetail({ setSelectedTran, selectedTran, getTrans }) {
  const { t } = useTranslation();
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const [users, setUsers] = useState({});
  const [types, setTypes] = useState({});
  const [selPhotoUrl, setSelPhotoUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [showAmtKeypad, setShowAmtKeypad] = useState(false);
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

  const openAmtKeypad = () => setShowAmtKeypad(true);
  const closeAmtKeypad = () => setShowAmtKeypad(false);

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
      file.type.startsWith("image/"),
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
      <div className="w-screen bg-app overflow-y-auto flex flex-col gap-4 items-center relative pb-[75px] mt-[60px]">
        <div className="flex justify-between px-3 items-center w-full fixed h-[50px] top-0 z-50 bg-surface shadow">
          <div className="flex items-center">
            <div className="w-[30px] h-[30px] convex-full bg-primary flex justify-center items-center">
              <AppIcon className="w-[20px] h-[20px] text-text-reverse" />
            </div>
            <TransIcon className="w-[30px] h-[20px]" />
            <p className="text-xl py-2">{t("transactionDetail")}</p>
          </div>
          <div
            className={`w-[30px] h-[30px] flex justify-center items-center convex bg-primary ${user.userName?.[0]?.toUpperCase() === "K" ? "bg-primary" : "bg-accent"}`}
          >
            <p className="text-text-reverse">
              {user.userName?.[0]?.toUpperCase()}
            </p>
          </div>
        </div>

        {/* record date */}
        <div className=" w-10/12 flex justify-center gap-2 mt-4 items-center">
          <p className="w-[150px]  text-right pr-2">{t("recordDate")} :</p>
          <input
            className="input-field w-[150px] convex px-2 h-[30px] bg-surface pl-4"
            type="date"
            value={input.recordDate}
            name="recordDate"
            onChange={hdlInput}
          />
        </div>
        {/* record time */}
        <div className="w-10/12 flex justify-center gap-2 itmes-center">
          <p className="w-[150px] text-right pr-2">{t("recordTime")} :</p>
          <input
            className="input-field w-[150px] convex px-2 h-[30px] bg-surface pl-4"
            type="time"
            value={input.recordTime}
            name="recordTime"
            onChange={hdlInput}
          />
        </div>

        {/* paid by */}
        <div className=" w-10/12 flex justify-center gap-2 itmes-center">
          <div className="w-[150px]  text-right pr-2 flex justify-end gap-1">
            <UserIcon className="w-[20px] h-[20px]" />
            <p>{t("payer")} :</p>
          </div>
          <input
            className="input-field w-[150px] convex px-2 h-[30px] bg-surface pl-4"
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
        <div className=" w-10/12 flex justify-center gap-2 itmes-center">
          <div className="w-[150px]  text-right pr-2 flex justify-end gap-1">
            <TypeIcon className="w-[20px] h-[20px]" />
            <p>{t("type")} :</p>
          </div>
          <input
            className="input-field w-[150px] convex px-2 h-[30px] bg-surface pl-4 -translate-y-1"
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
        <div className="w-10/12 flex justify-center gap-2 itmes-center">
          <p className="w-[150px] text-right pr-2">{t("totalAmount")} :</p>
          <NumericFormat
            className="input-field w-[150px] convex px-2 h-[30px] bg-surface pl-4"
            value={input.totalAmt === "" ? "" : input.totalAmt}
            name="totalAmt"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            inputMode="none"
            readOnly
            onClick={(e) => {
              e.preventDefault();
              openAmtKeypad();
            }}
            onFocus={(e) => {
              e.preventDefault();
              openAmtKeypad();
            }}
            autoComplete="off"
          />
        </div>
        {/* My Portion */}
        <div className=" w-10/12 flex justify-center gap-2 items-center ">
          <p className="w-[150px]  text-right pr-2">{t("payerPortion")} :</p>
          <NumericFormat
            className="input-field w-[150px] px-2 h-[30px] convex bg-surface pl-4"
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
          <p className="w-[150px]  text-right pr-2 ">{t("payerPortion")} :</p>
          <NumericFormat
            className="input-field w-[150px] px-2"
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
          <p className="w-[150px]  text-right pr-2">{t("otherAmount")} :</p>
          <NumericFormat
            className="input-field w-[150px] px-2"
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
          <p className="w-[150px]  text-left pr-2">{t("remark")} :</p>
          <p className="w-[150px] text-center"></p>
        </div>
        <input
          className="input-field w-10/12 h-[35px] concave pl-4 bg-surface"
          type="text"
          value={input.remark}
          name="remark"
          onChange={hdlInput}
        />
        {/* photo */}
        {selectedTran?.isHavePhoto && (
          <>
            <div className=" w-10/12 flex justify-center gap-2 rounded-xl">
              <p className="w-[150px]  text-left pr-2">{t("photo")} :</p>
              <p className="w-[150px] text-center"></p>
            </div>
            <div className=" w-10/12 h-[100px] flex items-center gap-2 overflow-x-auto overflow-y-hidden rounded-xl">
              {/* list of files */}
              {selectedTran.photos?.map((el, idx) => (
                <div
                  key={idx}
                  className="w-[80px] h-[80px]  flex-shrink-0 concave flex justify-center items-center relative cursor-pointer rounded-xl overflow-hidden"
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
          className="opacity-0 absolute w-0 rounded-xl convex"
          multiple
          accept="image/*"
          onChange={hdlFileChange}
        />
        <div className=" w-10/12 flex justify-center gap-2 rounded-xl">
          <p className="w-[150px]  text-left pr-2">{t("addPhoto")} :</p>
          <p className="w-[150px] text-center"></p>
        </div>
        <div className=" w-10/12 h-[100px] flex items-center gap-2 overflow-x-auto overflow-y-hidden rounded-xl">
          {/* add photo */}

          <div
            className="w-[80px] h-[80px] rounded-xl flex-shrink-0 box-border flex justify-center items-center cursor-pointer convex bg-surface"
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
                className="w-[20px] h-[20px] flex-shrink-0 absolute flex justify-center items-center font-bold rounded-full top-0 right-0 cursor-pointer"
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
            className="btn w-[100px] h-[30px] mt-auto mb-10 convex font-bold bg-surface"
            onClick={() => setSelectedTran(null)}
          >
            {t("back")}
          </button>
          <button
            className="btn btn-primary w-[100px]  text-text-reverse"
            onClick={hdlEditTran}
          >
            {t("save")}
          </button>
          <button
            className="btn btn-accent w-[100px]   text-text-reverse"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("confirm-delete-modal").showModal();
            }}
          >
            {t("delete")}
          </button>
        </div>
      </div>
      <AmtKeypad
        show={showAmtKeypad}
        initialValue={input.totalAmt}
        onClose={closeAmtKeypad}
        onConfirm={(resultValue) => {
          setInput((prev) => ({ ...prev, totalAmt: Number(resultValue) }));
          closeAmtKeypad();
        }}
        t={t}
      />
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
