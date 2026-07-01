import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import { NextIcon, PrevIcon } from "../icons/menuIcon";
import { useTranslation } from "react-i18next";
import useUserStore from "../stores/user-store";
import { editTagTranApi, getTagApi, getTagTranApi } from "../apis/tag-api";
import ModalEditTag from "../components/ModalEditTag";

function Calendar() {
  const { t } = useTranslation();

  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const token = useUserStore((state) => state.token);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tagList, setTagList] = useState([]);
  const [tagListAll, setTagListAll] = useState([]);
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTags, setActiveTags] = useState([]);

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth(); // 0-11
  const month = monthIndex + 1; // 1-12

  const years = Array.from({ length: 11 }, (_, i) => 2022 + i);

  const weekDays = [
    t("sun"),
    t("mon"),
    t("tue"),
    t("wed"),
    t("thu"),
    t("fri"),
    t("sat"),
  ];

  const pinColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
  ];

  // Format date => YYYY-MM-DD
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const todayStr = formatDate(new Date());

  // Generate 42 cells (6 weeks)
  const days = useMemo(() => {
    const firstDay = new Date(year, monthIndex, 1).getDay();

    const startDate = new Date(year, monthIndex, 1);
    startDate.setDate(startDate.getDate() - firstDay);

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      return {
        date: formatDate(date),
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === monthIndex,
      };
    });
  }, [year, monthIndex]);

  const toggleTag = (tagId) => {
    setActiveTags((prev) => {
      // Already active -> remove
      const exist = prev.find((t) => t.tagId === tagId);

      if (exist) {
        return prev.filter((t) => t.tagId !== tagId);
      }

      // Find first available slot (0-3)
      const usedSlots = prev.map((t) => t.slot);

      let slot = [0, 1, 2, 3].find((s) => !usedSlots.includes(s));

      // There is a free slot
      if (slot !== undefined) {
        return [...prev, { tagId, slot }];
      }

      // Already 4 active
      const oldest = prev[0];

      return [
        ...prev.slice(1),
        {
          tagId,
          slot: oldest.slot,
        },
      ];
    });
  };
  useEffect(() => {
    console.log(activeTags);
  }, [activeTags]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  const changeYear = (e) => {
    const selectedYear = Number(e.target.value);
    setCurrentDate(new Date(selectedYear, monthIndex, 1));
  };

  const getTagTran = async () => {
    setIsLoad(true);
    try {
      const result = await getTagTranApi(token, {
        startDate: days[0].date,
        endDate: days[days.length - 1].date,
      });

      // Remove duplicate tags for filter list
      const tagList = [
        ...new Map(
          result.data.tagTrans
            .filter((item) => item.tag)
            .map((item) => [
              item.tag.tagId,
              {
                tagId: item.tag.tagId,
                tagTxt: item.tag.tagTxt,
              },
            ]),
        ).values(),
      ];

      setTagList(tagList);

      // Build map: YYYY-MM-DD -> tagTrans[]
      const tagMap = new Map();

      result.data.tagTrans.forEach((tran) => {
        if (!tran.tag) return;

        const recordDate = tran.recordDate.slice(0, 10);

        if (!tagMap.has(recordDate)) {
          tagMap.set(recordDate, []);
        }

        tagMap.get(recordDate).push(tran);
      });

      // Merge into calendar days
      const daysWithTags = days.map((day) => ({
        ...day,
        tagTrans: tagMap.get(day.date) ?? [],
      }));

      setCalendarDays(daysWithTags);

      console.log(daysWithTags);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const openEditTag = (day) => {
    setSelectedDay(day);
    document.getElementById("edit_tag_modal").showModal();
  };

  const handleSaveTags = async (date, tagList, diff) => {
    console.log("SAVE TO API:", diff);

    try {
      setIsLoad(true);

      const payload = {
        date,
        add: diff.add.map((t) => ({
          tagId: t.tagId ?? null,
          tagTxt: t.tagTxt,
          isNew: t.isNew,
        })),
        delete: diff.delete.map((t) => ({
          tagTranId: t.tagTranId,
          tagId: t.tagId,
        })),
      };

      const result = await editTagTranApi(token, payload);

      console.log(result.data);

      // refresh tags from the server so tagTranId metadata is preserved
      await getTagTran();
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const getTagList = async () => {
    try {
      const result = await getTagApi(token);
      setTagListAll(result.data.tags || []);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    }
  };

  useEffect(() => {
    setCurMenu("calendar");
  }, [setCurMenu]);

  useEffect(() => {
    getTagTran();
  }, [year, month]);

  useEffect(() => {
    if (token) {
      getTagList();
    }
  }, [token]);

  return (
    <div className="w-screen bg-app overflow-y-auto flex flex-col items-center relative mb-[75px] mt-[50px]">
      <Header />

      {/* Calendar */}
      <div className="w-10/11 mt-4 concave p-1 rounded-xl bg-surface">
        {/* Week Header */}
        <div className="grid grid-cols-7 gap-1 mt-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center font-bold"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1 place-items-center">
          {calendarDays.map((item) => (
            <div
              key={item.date}
              className={`h-[30px] w-[30px] rounded-full my-1 flex items-center justify-center
        ${
          item.date === todayStr
            ? "bg-surface convex border border-blue-500 font-bold"
            : item.isCurrentMonth
              ? "bg-surface"
              : "bg-surface text-gray-300"
        }`}
              onClick={() => openEditTag(item)}
            >
              {item.day}
              {/* pins area */}
              <div className="flex gap-[1px] absolute translate-y-[16px]">
                {activeTags
                  .filter((activeTag) =>
                    item.tagTrans.some(
                      (tran) => tran.tag.tagId === activeTag.tagId,
                    ),
                  )
                  .sort((a, b) => a.slot - b.slot)
                  .map((tag) => (
                    <div
                      key={tag.tagId}
                      className={`w-[10px] h-[10px] rounded-full ${pinColors[tag.slot]}`}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="w-10/11 h-[40px] mt-5 flex items-center justify-between gap-2">
        <div className="w-[80px] h-[35px] convex bg-surface rounded-lg px-2">
          <select
            value={year}
            onChange={changeYear}
            className="w-full h-full bg-transparent outline-none text-center appearance-none cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between flex-1 px-2">
          <button
            onClick={prevMonth}
            className="w-[35px] h-[35px] flex justify-center items-center bg-surface convex rounded-full"
          >
            <PrevIcon className="w-5 h-5" />
          </button>

          <p className="text-lg font-semibold">
            {t(currentDate.toLocaleString("en-US", { month: "long" }))}
          </p>

          <button
            onClick={nextMonth}
            className="w-[35px] h-[35px] flex justify-center items-center bg-surface convex rounded-full"
          >
            <NextIcon className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setCurrentDate(new Date())}
          className="w-[80px] h-[35px] convex rounded-lg bg-primary text-text-reverse"
        >
          {t("today")}
        </button>
      </div>

      {/* Filtered */}
      <div className="w-10/11 min-h-[40px] mt-4 concave bg-surface p-3">
        <div className="w-full flex flex-wrap gap-2">
          {tagList.map((tag) => {
            const activeTag = activeTags.find((t) => t.tagId === tag.tagId);

            const bgColor = activeTag
              ? pinColors[activeTag.slot]
              : "bg-surface";

            return (
              <button
                key={tag.tagId}
                onClick={() => toggleTag(tag.tagId)}
                className={`px-3 py-1 my-1 rounded-full convex transition-all duration-200 ${bgColor} ${
                  activeTag ? "text-white" : ""
                }`}
              >
                {tag.tagTxt}
              </button>
            );
          })}
        </div>
      </div>
      <Footer />
      {/* modal edit tag */}
      <dialog id="edit_tag_modal" className="modal">
        <ModalEditTag
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          tagListAll={tagListAll}
          onSaveTags={handleSaveTags}
        />
      </dialog>
    </div>
  );
}

export default Calendar;
