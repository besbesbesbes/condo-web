import React, { useEffect, useState } from "react";
import { CloseIcon } from "../icons/menuIcon";
import { useTranslation } from "react-i18next";

function AmtKeypad({ show, initialValue = "", onClose, onConfirm }) {
  const { t } = useTranslation();
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const evaluateAmtExpression = (expressionValue) => {
    const cleaned = expressionValue.replace(/\s+/g, "");
    if (cleaned === "") return "";
    if (/[^0-9.+\-*/()%]/.test(cleaned)) return "";
    const trimmed = cleaned.replace(/[+\-*/%]+$/, "");
    if (trimmed === "") return "";
    try {
      const value = new Function(`return ${trimmed}`)();
      if (typeof value !== "number" || !Number.isFinite(value)) return "";
      return `${Math.round(value * 100) / 100}`;
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const inputValue =
      initialValue !== "" && initialValue !== null && initialValue !== undefined
        ? `${initialValue}`
        : "";
    setExpression(inputValue);
    setResult(inputValue !== "" ? inputValue : "0");
  }, [initialValue, show]);

  const appendKey = (value) => {
    setExpression((prev) => {
      const next = `${prev || ""}${value}`;
      setResult(evaluateAmtExpression(next));
      return next;
    });
  };

  const clearAll = () => {
    setExpression("");
    setResult("0");
  };

  const confirm = () => {
    const resultValue = result === "" ? "0" : result;
    onConfirm(resultValue);
  };

  if (!show) return null;

  return (
    <div className="bg-black/20 fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="w-5/6 max-w-md rounded-t-3xl bg-app p-4 shadow-2xl convex">
        <div className=" flex items-center justify-between relative">
          <div>
            <p className="text-sm">{t("expression")}</p>
            <p className="min-h-[28px] text-lg font-semibold break-words">
              {expression || "0"}
            </p>
          </div>

          <button
            className="w-[30px] h-[30px] convex-full flex justify-center items-center py-1 mt-2 absolute top-0 right-0  text-text-reverse bg-accent -translate-y-1"
            onClick={onClose}
          >
            <CloseIcon className="p-1" />
          </button>
        </div>
        <div className="rounded-xl bg-surface-soft p-3 text-right">
          <p className="text-xs text-surface-muted">{t("result")}</p>
          <p className="text-4xl font-bold text-primary">
            {result !== "" ? result : "0"}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2 text-2xl">
          {[
            "7",
            "8",
            "9",
            "/",
            "4",
            "5",
            "6",
            "*",
            "1",
            "2",
            "3",
            "-",
            "0",
            "00",
            ".",
            "+",
          ].map((key) => {
            const displayMap = { "*": "×", "/": "÷" };
            const display = displayMap[key] || key;
            return (
              <button
                key={key}
                className="bg-surface p-3 font-semibold convex"
                onClick={() => appendKey(key)}
                type="button"
              >
                {display}
              </button>
            );
          })}
        </div>
        <div className="mt-5 my-1 flex gap-2">
          <button
            className="flex-1 btn btn-accent py-3 concave text-text-reverse"
            type="button"
            onClick={clearAll}
          >
            {t("clear")}
          </button>
          <button
            className="flex-1 btn btn-primary py-3 concave text-text-reverse"
            type="button"
            onClick={confirm}
          >
            {t("ok")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AmtKeypad;
