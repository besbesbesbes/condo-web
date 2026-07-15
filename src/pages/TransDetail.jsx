import React, { useEffect, useState, useRef, forwardRef } from "react";
import Footer from "../components/Footer";
import { NumericFormat } from "react-number-format";
import { editTranApi } from "../apis/trans-api";
import { getNewTranInfoApi } from "../apis/new-api";
import { getTagApi } from "../apis/tag-api";
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
  BackIcon,
  DeleteIcon,
  SaveIcon,
  TagIcon,
  TransIcon,
  TypeIcon,
  UserIcon,
} from "../icons/menuIcon";
import Header from "../components/Header";
import {
  TRANS_LIST_ANIMATION_DURATION_MS,
  TRANS_LIST_ANIMATION_STAGGER_MS,
} from "../config/animation";

const AnimatedSection = forwardRef(
  ({ children, index, className = "", style = {} }, ref) => {
    return (
      <div
        ref={ref}
        className={`trans-list-item ${className}`.trim()}
        style={{
          animationDuration: `${TRANS_LIST_ANIMATION_DURATION_MS}ms`,
          animationDelay: `${index * TRANS_LIST_ANIMATION_STAGGER_MS}ms`,
          ...style,
        }}
      >
        {children}
      </div>
    );
  },
);

AnimatedSection.displayName = "AnimatedSection";

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
  const [tagList, setTagList] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggest, setTagSuggest] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const tagBoxRef = useRef(null);
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
    tags: [],
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
      body.append("tags", JSON.stringify(input.tags));
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

  const getTagList = async () => {
    try {
      const result = await getTagApi(token);
      setTagList(result.data.tags);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
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

  const hdlTagKeyDown = (e) => {
    if (e.key !== " " && e.key !== ",") return;

    e.preventDefault();

    const newTag = tagInput.trim();

    if (!newTag) return;

    // Find existing tag (case-insensitive)
    const existTag = tagList.find(
      (tag) => tag.tagTxt.toLowerCase() === newTag.toLowerCase(),
    );

    setInput((prev) => {
      // Prevent duplicate
      if (
        prev.tags.some((t) => t.tagTxt.toLowerCase() === newTag.toLowerCase())
      ) {
        return prev;
      }

      return {
        ...prev,
        tags: [
          ...prev.tags,
          existTag
            ? {
                tagId: existTag.tagId,
                tagTxt: existTag.tagTxt,
                isNew: false,
              }
            : {
                tagId: null,
                tagTxt: newTag,
                isNew: true,
              },
        ],
      };
    });

    setTagInput("");
    setTagSuggest([]);
    setShowSuggest(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const keyword = tagInput.trim().toLowerCase();

      if (keyword === "") {
        setTagSuggest([]);
        setShowSuggest(false);
        return;
      }

      const result = tagList.filter((tag) => {
        const matched = tag.tagTxt.toLowerCase().includes(keyword);

        const selected = input.tags.some((t) => t.tagId === tag.tagId);

        return matched && !selected;
      });

      setTagSuggest(result);
      setShowSuggest(result.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [tagInput, tagList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagBoxRef.current && !tagBoxRef.current.contains(event.target)) {
        setShowSuggest(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      tags:
        selectedTran.tagTrans?.map((tagTran) => ({
          tagId: tagTran.tag.tagId,
          tagTxt: tagTran.tag.tagTxt,
          isNew: false,
        })) || [],
    }));
    getNewTranInfo();
    getTagList();
  }, []);

  return (
    <>
      <div className="w-screen bg-app overflow-y-auto flex flex-col gap-4 items-center relative pb-[75px] mt-[60px]">
        {/* header */}
        <Header />
        {/* <div className="flex justify-between px-3 items-center w-full fixed h-[50px] top-0 z-50 bg-surface shadow">
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
        </div> */}
        {/* record date */}
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 mt-4 items-center"
          index={0}
        >
          <p className="w-[100px] flex-none text-right pr-2">
            {t("recordDate")} :
          </p>
          <div className="w-full flex items-center px-4">
            <input
              className="input-field w-full convex px-2 h-[30px] bg-surface pl-4"
              type="date"
              value={input.recordDate}
              name="recordDate"
              onChange={hdlInput}
            />
          </div>
        </AnimatedSection>
        {/* record time */}
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 items-center"
          index={1}
        >
          <p className="w-[100px] flex-none text-right pr-2">
            {t("recordTime")} :
          </p>
          <div className="w-full flex items-center px-4">
            <input
              className="input-field w-full convex px-2 h-[30px] bg-surface pl-4"
              type="time"
              value={input.recordTime}
              name="recordTime"
              onChange={hdlInput}
            />
          </div>
        </AnimatedSection>
        {/* paid by */}
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 items-center"
          index={2}
        >
          <div className="w-[100px] flex-none text-right pr-2 flex justify-end gap-1">
            <UserIcon className="w-[20px] h-[20px]" />
            <p>{t("payer")} :</p>
          </div>{" "}
          <div className="w-full flex items-center px-4">
            <div
              className="w-full convex px-2 h-[30px] bg-surface pl-4 flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("paid_by_modal").showModal();
              }}
            >
              <div
                className={`h-[26px] px-2   w-fit ${input.paidBy === user.userName ? "bg-accent convex" : input.paidBy.length > 0 ? "bg-friend  convex" : "bg-surface"}`}
                value={input.paidBy}
                name="paidBy"
                onChange={hdlInput}
                readOnly
              >
                {input.paidBy}
              </div>
            </div>
          </div>
        </AnimatedSection>
        {/* type */}
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 items-center"
          index={3}
        >
          <div className="w-[100px] flex-none text-right pr-2 flex justify-end gap-1">
            <TypeIcon className="w-[20px] h-[20px]" />
            <p>{t("type")} :</p>
          </div>
          <div className="w-full flex items-center px-4">
            <input
              className="input-field w-full convex px-2 h-[30px] bg-surface pl-4"
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
        </AnimatedSection>
        {/* amount */}
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 items-center"
          index={4}
        >
          <p className="w-[100px] flex-none text-right pr-2 text-[15px]">
            {t("totalAmount")} :
          </p>
          <div className="w-full flex items-center px-4">
            <NumericFormat
              className="input-field w-full convex px-2 h-[30px] bg-surface pl-4"
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
        </AnimatedSection>
        {/* My Portion */}
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 items-center"
          index={5}
        >
          <p className="w-[100px] flex-none text-right pr-2 text-[15px]">
            {t("payerPortion")} :
          </p>
          <div className="w-full flex items-center px-4">
            <NumericFormat
              className="input-field w-full convex px-2 h-[30px] bg-surface pl-4"
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
                  myPortion: values.floatValue ? values.floatValue / 100 : 0, // store as decimal (e.g., 0.25)
                }));
              }}
            />
          </div>
        </AnimatedSection>{" "}
        <AnimatedSection
          className="w-9/11 flex justify-end pr-4 gap-2 items-center"
          index={6}
        >
          <div
            className={`w-[80px] h-[30px] convex flex justify-center items-center ${input.myPortion === 0 ? "text-text-reverse bg-primary" : "bg-surface"}`}
            onClick={() => {
              setInput((prev) => ({
                ...prev,
                myPortion: 0,
              }));
            }}
          >
            0%
          </div>{" "}
          <div
            className={`w-[80px] h-[30px] convex flex justify-center items-center ${input.myPortion === 0.25 ? "text-text-reverse bg-primary" : "bg-surface"}`}
            onClick={() => {
              setInput((prev) => ({
                ...prev,
                myPortion: 0.25,
              }));
            }}
          >
            25%
          </div>
          <div
            className={`w-[80px] h-[30px] convex flex justify-center items-center ${input.myPortion === 0.5 ? "text-text-reverse bg-primary" : "bg-surface"}`}
            onClick={() => {
              setInput((prev) => ({
                ...prev,
                myPortion: 0.5,
              }));
            }}
          >
            50%
          </div>
          <div
            className={`w-[80px] h-[30px] convex flex justify-center items-center ${input.myPortion === 0.75 ? "text-text-reverse bg-primary" : "bg-surface"}`}
            onClick={() => {
              setInput((prev) => ({
                ...prev,
                myPortion: 0.75,
              }));
            }}
          >
            75%
          </div>
          <div
            className={`w-[80px] h-[30px] convex flex justify-center items-center ${input.myPortion === 1 ? "text-text-reverse bg-primary" : "bg-surface"}`}
            onClick={() => {
              setInput((prev) => ({
                ...prev,
                myPortion: 1,
              }));
            }}
          >
            100%
          </div>
        </AnimatedSection>
        {/* User Amount */}
        <AnimatedSection className="flex flex-col gap-1" index={7}>
          <div className="w-9/11 grid grid-cols-6 items-center">
            <div className="col-span-3  flex justify-end mr-4">
              <div className="w-fit h-[30px] flex justify-center items-center convex bg-accent px-2">
                <p className="text-text-reverse truncate">{user.userName}</p>
              </div>
            </div>
            <div className="text-right italic">
              (
              {input.paidById === user.userId
                ? input.myPortion * 100
                : (1 - input.myPortion) * 100}
              %)
            </div>
            <div className="col-span-2 flex">
              <NumericFormat
                className="input-field w-full px-2 text-right"
                value={
                  input.paidById === user.userId ? input.myAmt : input.otherAmt
                }
                name="myAmt"
                thousandSeparator
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                inputMode="decimal"
                disabled
              />
            </div>
          </div>
          {/* Buddy Amount */}
          <div className="w-9/11 grid grid-cols-6 items-center">
            <div className="col-span-3  flex justify-end mr-4">
              {user?.buddyAsUser1?.[0]?.user2?.isDummy ? (
                <div>{t("otherAmount")}</div>
              ) : (
                <div className="w-fit h-[30px] flex justify-center items-center convex bg-friend px-2">
                  <p className="text-text-reverse truncate">
                    {user?.buddyAsUser1?.[0]?.user2?.userName}
                  </p>
                </div>
              )}
            </div>
            <div className="text-right italic">
              (
              {input.paidById === user.userId
                ? (1 - input.myPortion) * 100
                : input.myPortion * 100}
              %)
            </div>
            <div className="col-span-2 flex">
              <NumericFormat
                className="input-field w-full px-2 text-right"
                value={
                  input.paidById === user.userId ? input.otherAmt : input.myAmt
                }
                name="otherAmt"
                thousandSeparator
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                inputMode="decimal"
                disabled
              />
            </div>
          </div>
        </AnimatedSection>
        {/* My Amount */}
        {/* <div className=" w-9/11 flex justify-center gap-2 items-center">
          <p className="w-[150px] flex-none text-right">
            {t("payerOtherAmount")} :
          </p>
          <NumericFormat
            className="input-field w-full px-2"
            value={input.myAmt === "" ? "" : input.myAmt}
            name="myAmt"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            inputMode="decimal"
            disabled
          />
          <p> / </p>
          <NumericFormat
            className="input-field w-full px-2"
            value={input.otherAmt === "" ? "" : input.otherAmt}
            name="otherAmt"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            inputMode="decimal"
            disabled
          />
        </div> */}
        {/* tag */}
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 items-center"
          index={8}
        >
          <div className="w-[100px] flex-none text-right pr-2 flex justify-end gap-1">
            <TagIcon className="w-[20px] h-[20px]" />
            <p>{t("tag")} :</p>
          </div>{" "}
          <div className="w-full flex items-center px-4"></div>
        </AnimatedSection>
        <AnimatedSection
          ref={tagBoxRef}
          className="relative w-9/11 max-w-[350px]"
          index={9}
        >
          <div className="flex flex-wrap items-center gap-2 min-h-[35px] concave bg-surface rounded-lg px-2 py-2 pl-4">
            {input.tags.map((tag, idx) => (
              <div
                key={idx}
                className="bg-tag text-text-reverse rounded-full px-3 flex items-center gap-2"
              >
                <span>{tag.tagTxt}</span>

                <span
                  className="cursor-pointer font-bold"
                  onClick={() => {
                    setInput((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((_, i) => i !== idx),
                    }));
                  }}
                >
                  ×
                </span>
              </div>
            ))}

            <input
              className="flex-1 min-w-[100px] outline-none bg-transparent"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={hdlTagKeyDown}
            />
          </div>

          {showSuggest && (
            <div className="absolute left-0 right-0 top-[40px] bg-surface rounded-2xl shadow-lg border z-50 max-h-[200px] overflow-y-auto">
              {tagSuggest.map((tag) => (
                <div
                  key={tag.tagId}
                  className="px-3 py-2 hover:bg-base-200 cursor-pointer"
                  onClick={() => {
                    setInput((prev) => {
                      if (
                        prev.tags.some(
                          (t) =>
                            t.tagTxt.toLowerCase() === tag.tagTxt.toLowerCase(),
                        )
                      ) {
                        return prev;
                      }

                      return {
                        ...prev,
                        tags: [
                          ...prev.tags,
                          {
                            tagId: tag.tagId,
                            tagTxt: tag.tagTxt,
                            isNew: false,
                          },
                        ],
                      };
                    });

                    setTagInput("");
                    setTagSuggest([]);
                    setShowSuggest(false);
                  }}
                >
                  {tag.tagTxt}
                </div>
              ))}
            </div>
          )}
        </AnimatedSection>
        {/* remark */}
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 items-center"
          index={10}
        >
          <p className="w-[100px] flex-none text-right pr-4">{t("remark")} :</p>
          <div className="w-full flex items-center px-4"></div>
        </AnimatedSection>
        <AnimatedSection className="w-9/11 max-w-[350px]" index={11}>
          <input
            className="input-field w-full min-h-[40px] concave bg-surface pl-3"
            type="text"
            value={input.remark}
            name="remark"
            onChange={hdlInput}
          />
        </AnimatedSection>
        {/* photo */}
        {selectedTran?.isHavePhoto && (
          <>
            <AnimatedSection
              className="w-9/11 flex justify-center gap-2 mt-4 items-center"
              index={12}
            >
              <p className="w-[100px] flex-none text-right pr-2">
                {t("photo")} :
              </p>
              <div className="w-full flex items-center px-4"></div>
            </AnimatedSection>
            <AnimatedSection
              className="w-10/12 h-[100px] flex items-center gap-2 overflow-x-auto overflow-y-hidden rounded-xl"
              index={13}
            >
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
            </AnimatedSection>
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
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 mt-4 items-center"
          index={selectedTran?.isHavePhoto ? 14 : 12}
        >
          <p className="w-[100px] flex-none text-right pr-2">
            {t("addPhoto")} :
          </p>
          <div className="w-full flex items-center px-4"></div>
        </AnimatedSection>
        <AnimatedSection
          className="w-10/12 h-[100px] flex items-center gap-2 overflow-x-auto overflow-y-hidden rounded-xl"
          index={selectedTran?.isHavePhoto ? 15 : 13}
        >
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
        </AnimatedSection>
        {/* button */}
        <AnimatedSection
          className="flex gap-4"
          index={selectedTran?.isHavePhoto ? 16 : 14}
        >
          <button
            className="btn w-[100px] h-[30px] mt-auto mb-10 convex font-bold bg-surface flex gap-1"
            onClick={() => setSelectedTran(null)}
          >
            <BackIcon className="w-[20px] h-[20px]" />
            {t("back")}
          </button>
          <button
            className="btn btn-primary w-[100px]  text-text-reverse  flex gap-1"
            onClick={hdlEditTran}
          >
            <SaveIcon className="w-[20px] h-[20px]" />
            {t("save")}
          </button>
          <button
            className="btn btn-accent w-[100px]   text-text-reverse  flex gap-1"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("confirm-delete-modal").showModal();
            }}
          >
            <DeleteIcon className="w-[20px] h-[20px]" />
            {t("delete")}
          </button>
        </AnimatedSection>
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
