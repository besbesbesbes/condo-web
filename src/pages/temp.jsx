<div
  className="w-full flex flex-col items-center convex bg-surface relative"
  key={idx}
>
  {/* {showDateHeader && (
                        <div className="w-11/12 h-[20px] text-center text-[12px] convex flex items-center justify-center font-bold">
                          {formattedDate}
                        </div>
                      )} */}
  <div
    className={`flex w-full items-center cursor-pointer rounded-xl py-3 px-2 gap-2 ${
      el.userId === user.userId ? "bg-surface" : ""
    }`}
    onClick={(e) => hdlSelectedTran(e, el)}
  >
    <div className="w-[50px] gap-2 flex flex-col justify-between items-center">
      {/* create user */}
      <div className="font-bold text-center">
        <div
          className={`w-[24px] h-[24px] flex justify-center items-center convex text-[12px]  text-text-reverse ${el.user.userName.charAt(0) === "K" ? "bg-primary" : "bg-accent"}`}
        >
          {el.user.userName.charAt(0)}
        </div>
      </div>
      {/* Month */}
      <div className="text-[12px] font-bold text-center">
        {new Date(el.recordDate).toLocaleString(
          i18n.language === "en" ? "en-US" : "th-TH",
          {
            month: "short",
          },
        )}
      </div>
    </div>
    <div className="w-[50px] flex flex-col">
      {/* date */}
      <div className=" text-center text-[12px] font-bold border-b border-main">
        {new Date(el.recordDate).getDate()}
      </div>

      {/* time */}
      <div className="text-[12px] text-center">
        {new Date(el.recordDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
    <div className="w-full flex flex-col px-2 py-1 gap-2">
      <div className="grid grid-cols-2 font-bold items-center">
        {/* type  */}
        <div className="self-center">{el.expenseType.expenseName}</div>

        {/* total amt */}
        <NumericFormat
          className="text-right text-[24px]"
          value={el.totalAmt}
          displayType="text"
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
        />
      </div>

      <div className="flex justify-between text-xs">
        <div className="flex gap-1">
          {/* paid by */}

          <div
            className={`w-[16px] h-[16px] flex-none flex justify-center items-center convex text-[10px]  text-text-reverse ${el.paidUser.userName.charAt(0) === "K" ? "bg-primary" : "bg-accent"}`}
          >
            {el.paidUser.userName.charAt(0)}
          </div>

          {/* remark */}
          {el.remark ? (
            <div className="">
              | <span className="text-accent">{el.remark}</span>
              {el.isHavePhoto && <span>📷</span>}
            </div>
          ) : null}
        </div>
        <div className="flex gap-1 items-center">
          <div className="flex items-center gap-0.5">
            <span>(</span>
            <NumericFormat
              className="text-center"
              value={el.myPortion * 100}
              displayType="text"
              thousandSeparator=","
              decimalScale={0}
              fixedDecimalScale
              suffix="%"
            />
            <span>)</span>
          </div>
          <NumericFormat
            className="text-right"
            value={el.myAmt}
            displayType="text"
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
          />
        </div>
      </div>
    </div>
  </div>
  <div className="w-10/11 flex justify-end pb-2 items-center gap-1 translate-x-2">
    {el?.tagTrans.map((el, idx) => (
      <div
        key={idx}
        className="px-2 py-1 convex text-[13px] bg-accent text-text-reverse border "
      >
        {el?.tag?.tagTxt}
      </div>
    ))}
  </div>
</div>;
