import React, { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import ModalPaidBy from "../components/ModalPaidBy";
import { getReportInfoApi } from "../apis/report-api";
import useUserStore from "../stores/user-store";
import { NumericFormat } from "react-number-format";
import { useTranslation } from "react-i18next";
import {
  AppIcon,
  ReportIcon,
  NoTrans,
  PrevIcon,
  NextIcon,
} from "../icons/menuIcon";
import Header from "../components/Header";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#577590",
];

function Report() {
  const { t } = useTranslation();
  const token = useUserStore((state) => state.token);

  const user = useUserStore((state) => state.user);
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const [users, setUsers] = useState([]);
  const today = new Date();
  const [report, setReport] = useState(null);
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const [activeFilters, setActiveFilters] = useState({
    user: true,
    buddy: true,
  });
  const [input, setInput] = useState({
    userName: user.userName,
    userId: user.userId,
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  const buddyUser = user?.buddyAsUser1?.[0]?.user2;
  const isBuddyDummy = buddyUser?.isDummy;
  const buddyName = isBuddyDummy
    ? t("other")
    : buddyUser?.userName || t("buddy");

  const toggleFilter = (key) => {
    setActiveFilters((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.user && !next.buddy) {
        return { user: true, buddy: true };
      }
      return next;
    });
  };

  const hdlInput = (e) => {
    const value =
      e.target.name === "month" || e.target.name === "year"
        ? Number(e.target.value)
        : e.target.value;

    setInput((prv) => ({ ...prv, [e.target.name]: value }));
  };

  const getReportInfo = async () => {
    setIsLoad(true);
    try {
      const result = await getReportInfoApi(token, input);
      console.log(result.data);
      setUsers(result.data.users);
      setReport(result.data.report);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const summary = useMemo(() => {
    if (!report?.length || !users?.length) return null;

    const data = {
      totalAmt: 0,
      paid: {},
      expense: {},
    };

    users.forEach((u) => {
      data.paid[u.userId] = 0;
      data.expense[u.userId] = 0;
    });

    report.forEach((row) => {
      data.totalAmt += row.totalAmt;

      users.forEach((u) => {
        data.paid[u.userId] += row.paid[u.userId];
        data.expense[u.userId] += row.expense[u.userId];
      });
    });

    return data;
  }, [report, users]);

  const sortedReport = useMemo(() => {
    if (!report?.length) return [];

    return [...report].sort((a, b) => b.totalAmt - a.totalAmt);
  }, [report]);

  const pieData = useMemo(() => {
    if (!sortedReport?.length) return [];

    const bothActive = activeFilters.user && activeFilters.buddy;
    const onlyUserActive = activeFilters.user && !activeFilters.buddy;
    const onlyBuddyActive = !activeFilters.user && activeFilters.buddy;
    const buddyId = buddyUser?.userId;

    return sortedReport.map((row) => ({
      name: row.expenseTypeName,
      value: bothActive
        ? row.totalAmt
        : onlyUserActive
          ? (row.expense?.[user?.userId] ?? 0)
          : onlyBuddyActive
            ? (row.expense?.[buddyId] ?? 0)
            : row.totalAmt,
    }));
  }, [sortedReport, activeFilters, buddyUser?.userId, user?.userId]);

  const sortedUsers = useMemo(() => {
    if (!users?.length || !user?.userId) return users;

    return [
      ...users.filter((u) => u.userId === user.userId),
      ...users.filter((u) => u.userId !== user.userId),
    ];
  }, [users, user]);

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    const isBig = percent >= 0.08;

    // CHANGE THIS VALUE
    const radius = isBig
      ? innerRadius + (outerRadius - innerRadius) / 2
      : outerRadius - 10;

    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={0.5}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const hdlPrevMonth = () => {
    setInput((prev) => {
      const month = Number(prev.month);
      const year = Number(prev.year);

      if (month <= 1) {
        return {
          ...prev,
          month: 12,
          year: year - 1,
        };
      }

      return {
        ...prev,
        month: month - 1,
      };
    });
  };

  const hdlNextMonth = () => {
    setInput((prev) => {
      const month = Number(prev.month);
      const year = Number(prev.year);

      if (month >= 12) {
        return {
          ...prev,
          month: 1,
          year: year + 1,
        };
      }

      return {
        ...prev,
        month: month + 1,
      };
    });
  };

  useEffect(() => {
    setCurMenu("report");
    getReportInfo();
  }, [input.userName, input.month, input.year]);

  return (
    <div>
      <div className="w-screen bg-app overflow-y-auto flex flex-col gap-2 items-center relative mb-[75px] mt-[60px]">
        {/* header */}
        <Header />
        {/*Report date */}
        <div className=" w-10/12 flex justify-center items-center gap-2 mt-4">
          <button
            onClick={hdlPrevMonth}
            className="w-[35px] h-[35px] flex justify-center items-center bg-surface convex rounded-full"
          >
            <PrevIcon className="w-5 h-5" />
          </button>
          <select
            className="input-field convex bg-surface text-center w-[100px]"
            name="month"
            value={input.month}
            onChange={hdlInput}
          >
            {[
              t("January"),
              t("February"),
              t("March"),
              t("April"),
              t("May"),
              t("June"),
              t("July"),
              t("August"),
              t("September"),
              t("October"),
              t("November"),
              t("December"),
            ].map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <button
            onClick={hdlNextMonth}
            className="w-[35px] h-[35px] flex justify-center items-center bg-surface convex rounded-full"
          >
            <NextIcon className="w-5 h-5" />
          </button>
          <select
            className="input-field w-[75px]  convex  pl-4 bg-surface"
            name="year"
            value={input.year}
            onChange={hdlInput}
          >
            {Array.from({ length: 14 }, (_, i) => 2021 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="w-10/12 flex justify-center items-center gap-2 mt-2">
          <div
            onClick={() => toggleFilter("user")}
            className={`input-field convex px-3 flex justify-center items-center ${
              activeFilters.user
                ? "bg-accent text-text-reverse"
                : "bg-surface text-text"
            }`}
          >
            {user?.userName || t("you")}
          </div>
          <div
            onClick={() => toggleFilter("buddy")}
            className={`input-field convex px-3 flex justify-center items-center ${
              activeFilters.buddy
                ? "bg-friend text-text-reverse"
                : "bg-surface text-text"
            }`}
          >
            {buddyName}
          </div>
        </div>
        {/* pie chart */}
        <div className="w-full h-[350px] overflow-visible">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={renderLabel}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => new Intl.NumberFormat().format(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* report expense table */}
        <div className="w-9/10 flex flex-col gap-2 text-sm">
          {report?.length ? (
            <>
              {/* Header */}
              <div className="grid grid-cols-9 gap-2 px-3 items-center">
                <div className="col-span-3"></div>
                <div className="col-span-2 text-right">{t("total")}</div>
                {sortedUsers.map((u) => (
                  <div key={u.userId} className="col-span-2 flex justify-end">
                    <div
                      className={`w-fit h-[30px] flex justify-center items-center convex px-2 ${
                        user?.userId === u.userId ? "bg-accent" : "bg-friend"
                      }`}
                    >
                      <p className="text-text-reverse">
                        {user?.buddyAsUser1?.[0]?.user2?.isDummy &&
                        u.userId !== user.userId
                          ? t("other")
                          : u.userName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Body */}
              {sortedReport.map((row) => (
                <div
                  key={row.expenseTypeId}
                  className="grid grid-cols-9 gap-2 px-3 h-[42px] items-center concave bg-surface"
                >
                  {/* Expense Type */}
                  <div className="col-span-3">{row.expenseTypeName}</div>

                  {/* Total */}
                  <NumericFormat
                    className="col-span-2 text-right"
                    value={row.totalAmt}
                    displayType="text"
                    thousandSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                  />

                  {/* User expense */}
                  {sortedUsers.map((u) => (
                    <NumericFormat
                      key={u.userId}
                      className="col-span-2 text-right"
                      value={row.expense[u.userId]}
                      displayType="text"
                      thousandSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  ))}
                </div>
              ))}

              {/* Total Row */}
              <div className="grid grid-cols-9 gap-2 px-3 h-[42px] items-center concave bg-surface font-bold">
                <div className="col-span-3"></div>

                <NumericFormat
                  className="col-span-2 text-right"
                  value={summary?.totalAmt}
                  displayType="text"
                  thousandSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                />

                {sortedUsers.map((u) => (
                  <NumericFormat
                    key={u.userId}
                    className="col-span-2 text-right"
                    value={summary?.expense[u.userId]}
                    displayType="text"
                    thousandSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center m-4 gap-2 text-text/50">
              <NoTrans className="w-[40px] h-[40px]" />
              <p>{t("noRecordFound")}</p>
            </div>
          )}
        </div>
        {/* report receivable table */}
        {summary && (
          <div className="w-9/10 my-8 flex flex-col gap-2 text-sm ">
            {/* Header */}
            <div className="grid grid-cols-9 gap-2 px-3 ">
              <div className="col-span-3"></div>
              <div className="col-span-2 text-right">{t("paid")}</div>
              <div className="col-span-2 text-right">{t("expense")}</div>
              <div className="col-span-2 text-right">{t("receivable")}</div>
            </div>

            {/* Body */}
            {sortedUsers.map((u) => {
              const receivable =
                summary.paid[u.userId] - summary.expense[u.userId];

              return (
                <div
                  key={u.userId}
                  className="grid grid-cols-9 gap-2 concave bg-surface px-3 h-[42px] items-center"
                >
                  {/* user */}
                  <div className="col-span-3 flex items-center">
                    <div
                      className={`w-fit h-[30px] flex justify-center items-center convex px-2 ${
                        user?.userId === u.userId ? "bg-accent" : "bg-friend"
                      }`}
                    >
                      <p className="text-text-reverse">
                        {user?.buddyAsUser1?.[0]?.user2?.isDummy &&
                        u.userId !== user.userId
                          ? t("other")
                          : u.userName}
                      </p>
                    </div>
                  </div>
                  {/* paid */}
                  <NumericFormat
                    className="col-span-2 text-right"
                    value={summary.paid[u.userId]}
                    displayType="text"
                    thousandSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                  />
                  {/* expense */}
                  <NumericFormat
                    className="col-span-2 text-right"
                    value={summary.expense[u.userId]}
                    displayType="text"
                    thousandSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                  />
                  {/* receivable */}
                  <NumericFormat
                    className={`col-span-2 text-right font-bold ${
                      receivable >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                    value={receivable}
                    displayType="text"
                    thousandSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* footer */}
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
