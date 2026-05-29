import React, { useEffect, useState } from "react";

function AmtKeypad({ show, initialValue = "", onClose, onConfirm, t }) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");

  const translate = (key) => (t ? t(key) : key);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-5/6 max-w-md rounded-t-3xl bg-white p-4 shadow-2xl rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{translate("expression")}</p>
            <p className="min-h-[28px] text-lg font-semibold break-words">
              {expression || "0"}
            </p>
          </div>
          <button
            className="rounded-full bg-slate-200 px-3 py-2 text-sm"
            onClick={onClose}
            type="button"
          >
            {translate("close")}
          </button>
        </div>
        <div className="mb-4 rounded-xl bg-slate-100 p-3 text-right">
          <p className="text-xs text-slate-500">{translate("result")}</p>
          <p className="text-2xl font-bold">{result !== "" ? result : "0"}</p>
        </div>
        <div className="grid grid-cols-4 gap-2 text-lg">
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
                className="rounded-2xl bg-slate-200 py-4 font-semibold hover:bg-slate-300"
                onClick={() => appendKey(key)}
                type="button"
              >
                {display}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            className="flex-1 rounded-2xl bg-slate-200 py-3 font-semibold hover:bg-slate-300"
            type="button"
            onClick={clearAll}
          >
            {translate("clearAll")}
          </button>
          <button
            className="flex-1 rounded-2xl bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700"
            type="button"
            onClick={confirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default AmtKeypad;
