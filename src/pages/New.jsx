import React, { useEffect, useState, useRef, forwardRef } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import { NumericFormat } from "react-number-format";
import { addTran, getNewTranInfoApi } from "../apis/new-api";
import useUserStore from "../stores/user-store";
import ModalExpenseType from "../components/ModalExpenseType";
import ModalPaidBy from "../components/ModalPaidBy";
import { useLocation, useNavigate } from "react-router-dom";
// import { addTranMail } from "../apis/mail-api";
import { useTranslation } from "react-i18next";
import {
  AddPhoto,
  AppIcon,
  NewIcon,
  TagIcon,
  TypeIcon,
  UserIcon,
} from "../icons/menuIcon";
import AmtKeypad from "../components/AmtKeypad";
import Header from "../components/Header";
import { getRecentTagApi, getTagApi } from "../apis/tag-api";
import AnimatedSection from "../components/AnimatedSection";

function New() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [types, setTypes] = useState([]);
  const [isInitialDataReady, setIsInitialDataReady] = useState(false);
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
    tags: [],
    instPlan: 0,
    inst: [],
  });
  const [showAmtKeypad, setShowAmtKeypad] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggest, setTagSuggest] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [recentTag, setRecentTag] = useState([]);
  const [showInstallment, setShowInstallment] = useState(false);
  const [fastInputState, setFastInputState] = useState({
    active: false,
    step: 0,
  });
  const tagBoxRef = useRef(null);
  const skipNextDialogCloseRef = useRef(false);

  const openAmtKeypad = () => {
    setShowAmtKeypad(true);
  };

  const closeAmtKeypad = () => {
    setShowAmtKeypad(false);
  };

  const openPaidByModal = () => {
    if (!isInitialDataReady) return;
    document.getElementById("paid_by_modal")?.showModal();
  };

  const openExpenseTypeModal = () => {
    if (!isInitialDataReady) return;
    document.getElementById("expense_type_modal")?.showModal();
  };

  const disableFastInput = () => {
    setFastInputState({ active: false, step: 0 });
  };

  const startFastInput = () => {
    if (location.pathname !== "/add") return;
    setFastInputState({ active: true, step: 1 });
  };

  const handlePaidBySelect = () => {
    if (!fastInputState.active || fastInputState.step !== 1) return;

    skipNextDialogCloseRef.current = true;
    setFastInputState({ active: true, step: 2 });

    window.setTimeout(() => {
      if (location.pathname === "/add") {
        openExpenseTypeModal();
      }
    }, 120);
  };

  const handleExpenseTypeSelect = () => {
    if (!fastInputState.active || fastInputState.step !== 2) return;

    skipNextDialogCloseRef.current = true;
    setFastInputState({ active: true, step: 3 });

    window.setTimeout(() => {
      if (location.pathname === "/add") {
        setShowAmtKeypad(true);
      }
    }, 120);
  };

  const hdlInput = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const totalAmt = Number(input.totalAmt);
    const myPortion = input.myPortion;

    setInput((prev) => {
      const next = { ...prev };

      if (
        !Number.isNaN(totalAmt) &&
        totalAmt > 0 &&
        myPortion !== null &&
        myPortion !== undefined
      ) {
        next.myAmt = +(totalAmt * myPortion).toFixed(2);
        next.otherAmt = +(totalAmt - next.myAmt).toFixed(2);
      }

      if (prev.instPlan !== 0 || prev.inst.length > 0) {
        next.instPlan = 0;
        next.inst = [];
      }

      return next;
    });

    setShowInstallment(false);
  }, [input.totalAmt, input.myPortion]);

  const getNewTranInfo = async () => {
    setIsLoad(true);
    setIsInitialDataReady(false);
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
      setUsers(result.data.users || []);

      console.log(result.data.users);
      console.log(user);

      setTypes(result.data.types || []);
      setIsInitialDataReady(true);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
      setIsInitialDataReady(false);
    } finally {
      setIsLoad(false);
    }
  };

  const getTagList = async () => {
    const result = await getTagApi(token);
    setTagList(result.data.tags);
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
      body.append("tags", JSON.stringify(input.tags));
      files.forEach((file) => {
        body.append("images", file);
      });
      // api
      const result = await addTran(token, body);
      console.log(result);
      // Email
      // let toEmail = "";
      // if (user.userId === 1) {
      //   // toEmail = "smt.bes@gmail.com, warittha.chtn@gmail.com";
      //   toEmail = "smt.bes@gmail.com";
      // } else if (user.userId === 2) {
      //   toEmail = "smt.bes@gmail.com";
      // }
      // if (toEmail) {
      //   const mail = await addTranMail(token, {
      //     to: toEmail,
      //     subject: "[KB Expense] New record added!",
      //     text: `KB Expnese\n– New record added –\n\nPaid by: ${input.paidBy}\nType : ${input.type}\nAmount : ${input.totalAmt}\nRemark : ${input.remark}\n\nHave a nice day,\nKB-Admin`,
      //   });
      //   console.log(mail);
      // }
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.msg || err.message;
      console.log(msg);
      // setErrMsg(msg);
      // setTimeout(() => {
      //   setErrMsg("");
      //   navigate("/");
      // }, 5000);
      navigate("/");
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

  const getRecentTag = async () => {
    try {
      const result = await getRecentTagApi(token);
      setRecentTag(result.data.recentTag);
      console.log(result.data.recentTag);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    }
  };

  useEffect(() => {
    setInput((prev) => ({
      ...prev,
      inst: [],
    }));
  }, [input.instPlan, input.totalAmt, input.myPortion]);

  useEffect(() => {
    setCurMenu("add");
    getNewTranInfo();
    getTagList();
    getRecentTag();
  }, []);

  useEffect(() => {
    if (location.pathname !== "/add") return;

    startFastInput();

    return () => {
      disableFastInput();
    };
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname !== "/add" ||
      !fastInputState.active ||
      fastInputState.step !== 1 ||
      !isInitialDataReady
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (
        location.pathname === "/add" &&
        fastInputState.active &&
        fastInputState.step === 1
      ) {
        openPaidByModal();
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [
    location.pathname,
    fastInputState.active,
    fastInputState.step,
    isInitialDataReady,
  ]);

  useEffect(() => {
    const paidByModal = document.getElementById("paid_by_modal");
    const expenseTypeModal = document.getElementById("expense_type_modal");

    const handlePaidByDialogClose = () => {
      if (skipNextDialogCloseRef.current) {
        skipNextDialogCloseRef.current = false;
        return;
      }

      if (fastInputState.active && fastInputState.step === 1) {
        disableFastInput();
      }
    };

    const handleExpenseTypeDialogClose = () => {
      if (skipNextDialogCloseRef.current) {
        skipNextDialogCloseRef.current = false;
        return;
      }

      if (fastInputState.active && fastInputState.step === 2) {
        disableFastInput();
      }
    };

    paidByModal?.addEventListener("close", handlePaidByDialogClose);
    expenseTypeModal?.addEventListener("close", handleExpenseTypeDialogClose);

    return () => {
      paidByModal?.removeEventListener("close", handlePaidByDialogClose);
      expenseTypeModal?.removeEventListener(
        "close",
        handleExpenseTypeDialogClose,
      );
    };
  }, [fastInputState.active, fastInputState.step]);

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

      console.log(result);

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

  return (
    <div>
      <div className="w-screen bg-app overflow-y-auto flex flex-col gap-4 items-center relative mb-[75px] mt-[60px]">
        {/* header */}
        <Header />
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
          </div>{" "}
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
        </AnimatedSection>
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

        {/* installment plan */}
        {!user?.buddyAsUser1?.[0]?.user2?.isDummy && (
          <AnimatedSection
            className="w-9/11 flex justify-center gap-2 items-center"
            index={8}
          >
            {!showInstallment &&
              input?.myPortion == 0 &&
              input?.totalAmt > 0 && (
                <div
                  className="convex px-3 text-text-reverse bg-primary h-[30px] flex justify-center items-center"
                  onClick={() => setShowInstallment((prev) => !prev)}
                >
                  {t("userInstallmentPlan")}
                </div>
              )}
            {showInstallment && (
              <div className=" w-9/11 flex justify-center gap-2 items-center">
                <p className="w-[150px] flex-none text-right">
                  {t("installmentPlan")} :
                </p>
                <div className="w-full flex items-center px-4">
                  <NumericFormat
                    className="input-field w-full convex px-2 h-[30px] bg-surface pl-4"
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
              </div>
            )}
          </AnimatedSection>
        )}
        {typeof input.instPlan === "number" && input.instPlan > 0 && (
          <AnimatedSection
            className="w-9/11 flex justify-center gap-2 items-center pr-4"
            index={9}
          >
            <div
              className="btn btn-primary text-text-reverse"
              onClick={hdlGenInstPlan}
            >
              {t("generate")}
            </div>
          </AnimatedSection>
        )}
        {/* installment list */}
        {input.inst.map((el, idx) => (
          <AnimatedSection
            key={idx}
            className="w-10/12 flex justify-center gap-2"
            index={10 + idx}
          >
            <div className="flex-none h-[30px] w-[30px] flex justify-center items-center">
              {idx + 1}
            </div>
            {/* Date input */}
            <input
              className="w-[150px] text-center bg-surface convex px-2"
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
              className="w-[150px] text-center"
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
          </AnimatedSection>
        ))}

        {/* tag */}
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 items-center"
          index={10 + (input.inst.length || 0)}
        >
          <div className="w-[100px] flex-none text-right pr-2 flex justify-end gap-1">
            <TagIcon className="w-[20px] h-[20px]" />
            <p>{t("tag")} :</p>
          </div>{" "}
          <div className="w-full flex items-center px-4"></div>
        </AnimatedSection>
        {/* recent tag */}
        <AnimatedSection
          className="w-9/11 flex justify-end gap-2 flex-wrap"
          index={11 + (input.inst.length || 0)}
        >
          {recentTag.map((tag) => (
            <div
              key={tag.tagId}
              className="h-[24px] bg-surface convex rounded-full px-3 py-1 transition border border-tag flex justify-center items-center"
              onClick={() => {
                setInput((prev) => {
                  if (prev.tags.some((t) => t.tagId === tag.tagId)) {
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
              {"+ "}
              {tag.tagTxt}
            </div>
          ))}
        </AnimatedSection>
        <AnimatedSection
          ref={tagBoxRef}
          className="relative w-9/11 max-w-[350px]"
          index={12 + (input.inst.length || 0)}
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
          index={13 + (input.inst.length || 0)}
        >
          <p className="w-[100px] flex-none text-right pr-2">{t("remark")} :</p>
          <div className="w-full flex items-center px-4"></div>
        </AnimatedSection>
        <AnimatedSection
          className="w-9/11 max-w-[350px]"
          index={14 + (input.inst.length || 0)}
        >
          <input
            className="input-field w-full min-h-[40px] concave bg-surface pl-4"
            type="text"
            value={input.remark}
            name="remark"
            onChange={hdlInput}
          />
        </AnimatedSection>

        {/* photo */}
        <input
          type="file"
          id="input-file"
          className="opacity-0 absolute w-0"
          multiple
          accept="image/*"
          onChange={hdlFileChange}
        />
        <AnimatedSection
          className="w-9/11 flex justify-center gap-2 mt-4 items-center"
          index={15 + (input.inst.length || 0)}
        >
          <p className="w-[100px] flex-none text-right pr-2">{t("photo")} :</p>
          <div className="w-full flex items-center px-4"></div>
        </AnimatedSection>
        <AnimatedSection
          className="w-10/12 h-[100px] flex items-center gap-2 overflow-x-auto overflow-y-hidden"
          index={16 + (input.inst.length || 0)}
        >
          {/* add photo */}
          <div
            className="w-[80px] h-[80px]  rounded-2xl flex-shrink-0 bg-surface convex flex justify-center items-center cursor-pointer"
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

        {/* button add */}
        <AnimatedSection
          className="w-full flex justify-center"
          index={17 + (input.inst.length || 0)}
        >
          {errMsg === "invalid_grant" && (
            <p className="text-center mt-2 mb-[60px]">
              Transaction added successfully but <br />
              Email can't send, will go to TRANS in 3 sec.
            </p>
          )}

          {errMsg === "Request failed with status code 401" && (
            <p className="text-center mt-2 mb-[60px]">
              Transaction added successfully but <br />
              Request failed with status code 401 <br />
              Email can't send, will go to TRANS in 3 sec.
            </p>
          )}
          {!errMsg && (
            <button
              className="btn btn-primary text-text-reverse mb-[10px]"
              onClick={hdlAddTran}
            >
              {t("add")}
            </button>
          )}
        </AnimatedSection>

        {/* <button
          className="btn btn-primary"
          onClick={() => {
            console.log(input);
            console.log(user);
          }}
        >
          Input
        </button> */}
      </div>

      <AmtKeypad
        show={showAmtKeypad}
        initialValue={input.totalAmt}
        onClose={() => {
          if (fastInputState.active && fastInputState.step === 3) {
            disableFastInput();
          }
          closeAmtKeypad();
        }}
        onConfirm={(resultValue) => {
          const amount = Number(resultValue);
          setInput((prev) => ({ ...prev, totalAmt: amount }));

          if (
            fastInputState.active &&
            fastInputState.step === 3 &&
            Number.isFinite(amount) &&
            amount > 0
          ) {
            setFastInputState({ active: false, step: 0 });
          } else if (fastInputState.active && fastInputState.step === 3) {
            disableFastInput();
          }

          closeAmtKeypad();
        }}
        t={t}
      />

      <Footer />
      {/* modal paid by */}
      <dialog id="paid_by_modal" className="modal">
        <ModalPaidBy
          users={users}
          setInput={setInput}
          onSelect={handlePaidBySelect}
          onClose={disableFastInput}
        />
      </dialog>
      {/* modal expense type */}
      <dialog id="expense_type_modal" className="modal">
        <ModalExpenseType
          input={input}
          types={types}
          setInput={setInput}
          getNewTranInfo={getNewTranInfo}
          onSelect={handleExpenseTypeSelect}
          onClose={disableFastInput}
        />
      </dialog>
    </div>
  );
}

export default New;
