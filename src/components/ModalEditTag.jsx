import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon, SaveIcon, TagIcon } from "../icons/menuIcon";

function ModalEditTag({
  selectedDay,
  setSelectedDay,
  tagListAll = [],
  onSaveTags,
}) {
  const { t, i18n } = useTranslation();

  const tagBoxRef = useRef(null);

  const [tagList, setTagList] = useState([]); // selected tags
  const [tagInput, setTagInput] = useState("");
  const [tagSuggest, setTagSuggest] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);

  // ----------------------------
  // format date
  // ----------------------------
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    return new Intl.DateTimeFormat(i18n.language === "th" ? "th-TH" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  // ----------------------------
  // init selected day
  // ----------------------------
  useEffect(() => {
    if (!selectedDay) {
      setTagList([]);
      return;
    }

    setTagList(
      selectedDay?.tagTrans?.map((item) => ({
        tagId: item.tag?.tagId,
        tagTxt: item.tag?.tagTxt,
        isNew: false,
      })) || [],
    );

    setTagInput("");
    setTagSuggest([]);
    setShowSuggest(false);
  }, [selectedDay]);

  // ----------------------------
  // close modal
  // ----------------------------
  const closeModal = () => {
    setSelectedDay(null);
    document.getElementById("edit_tag_modal")?.close();
  };

  // ----------------------------
  // add tag (same logic as TransDetail)
  // ----------------------------
  const hdlTagKeyDown = (e) => {
    if (e.key !== " " && e.key !== ",") return;

    e.preventDefault();

    const newTag = tagInput.trim();
    if (!newTag) return;

    const existTag = tagListAll.find(
      (tag) => tag.tagTxt.toLowerCase() === newTag.toLowerCase(),
    );

    setTagList((prev) => {
      if (prev.some((t) => t.tagTxt.toLowerCase() === newTag.toLowerCase())) {
        return prev;
      }

      return [
        ...prev,
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
      ];
    });

    setTagInput("");
    setTagSuggest([]);
    setShowSuggest(false);
  };

  // ----------------------------
  // live suggestion (same as TransDetail)
  // ----------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      const keyword = tagInput.trim().toLowerCase();

      if (keyword === "") {
        setTagSuggest([]);
        setShowSuggest(false);
        return;
      }

      const result = tagListAll.filter((tag) => {
        const matched = tag.tagTxt.toLowerCase().includes(keyword);

        const selected = tagList.some((t) => t.tagId === tag.tagId);

        return matched && !selected;
      });

      setTagSuggest(result);
      setShowSuggest(result.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [tagInput, tagListAll, tagList]);

  // ----------------------------
  // click outside to close suggest
  // ----------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagBoxRef.current && !tagBoxRef.current.contains(event.target)) {
        setShowSuggest(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----------------------------
  // save
  // ----------------------------
  const handleSave = () => {
    const diff = buildTagDiff();

    console.log("TAG DIFF:", diff);

    onSaveTags(selectedDay.date, tagList, diff);

    closeModal();
  };

  const buildTagDiff = () => {
    const original = selectedDay?.tagTrans || [];

    const originalTagIds = new Set(
      original.map((t) => t.tag?.tagId).filter(Boolean),
    );

    const originalTagTxts = new Set(
      original.map((t) => t.tag?.tagTxt?.toLowerCase()).filter(Boolean),
    );

    // ADD (new associations and new tag text)
    const add = tagList
      .filter(
        (t) =>
          !originalTagIds.has(t.tagId) &&
          !originalTagTxts.has(t.tagTxt.toLowerCase()),
      )
      .map((t) =>
        t.tagId
          ? {
              tagId: t.tagId,
              tagTxt: t.tagTxt,
              isNew: false,
            }
          : {
              tagTxt: t.tagTxt,
              isNew: true,
            },
      );

    // DELETE (must use tagTranId, not tranId)
    const deleteArr = original
      .filter(
        (t) =>
          !new Set(tagList.map((item) => item.tagId).filter(Boolean)).has(
            t.tag?.tagId,
          ),
      )
      .map((t) => ({
        tagTranId: t.tagTranId,
        tagId: t.tag?.tagId,
      }));

    return {
      add,
      delete: deleteArr,
    };
  };
  return (
    <div className="w-[320px] h-auto bg-surface shadow-xl convex fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-3 pb-4 pt-6 items-center text-lg text-text z-[50]">
      {/* title */}
      <div className="w-10/11 flex gap-1 items-center">
        <TagIcon className="w-[20px] h-[20px]" />
        <p>
          {t("editTag")} : {formatDate(selectedDay?.date)}
        </p>
      </div>

      {/* tag input area */}
      <div ref={tagBoxRef} className="relative w-10/11">
        <div className="flex flex-wrap items-center gap-2 min-h-[40px] concave bg-surface rounded-lg p-3">
          {/* selected tags */}
          {tagList.map((tag, idx) => (
            <div
              key={idx}
              className="bg-tag text-text-reverse rounded-full px-3 flex items-center gap-2"
            >
              <span>{tag.tagTxt}</span>

              <span
                className="cursor-pointer font-bold"
                onClick={() =>
                  setTagList((prev) => prev.filter((_, i) => i !== idx))
                }
              >
                ×
              </span>
            </div>
          ))}

          {/* input */}
          <input
            className="flex-1 min-w-[120px] outline-none bg-transparent"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={hdlTagKeyDown}
          />
        </div>

        {/* suggestions */}
        {showSuggest && (
          <div className="absolute left-0 right-0 top-[45px] bg-surface rounded-2xl shadow-lg border z-50 max-h-[200px] overflow-y-auto">
            {tagSuggest.map((tag) => (
              <div
                key={tag.tagId}
                className="px-3 py-2 hover:bg-base-200 cursor-pointer"
                onClick={() => {
                  setTagList((prev) => {
                    if (
                      prev.some(
                        (t) =>
                          t.tagTxt.toLowerCase() === tag.tagTxt.toLowerCase(),
                      )
                    ) {
                      return prev;
                    }

                    return [
                      ...prev,
                      {
                        tagId: tag.tagId,
                        tagTxt: tag.tagTxt,
                        isNew: false,
                      },
                    ];
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
      </div>

      {/* save */}
      <button
        className="w-[100px] h-[30px] convex bg-primary text-text-reverse flex items-center justify-center gap-1"
        onClick={handleSave}
      >
        <SaveIcon className="w-[20px] h-[20px]" />
        <p>{t("save")}</p>
      </button>

      {/* close */}
      <button
        className="w-[30px] h-[30px] convex-full flex justify-center items-center py-1 absolute top-2 right-0 -translate-x-2 text-text-reverse bg-accent"
        onClick={closeModal}
      >
        <CloseIcon className="p-1" />
      </button>
    </div>
  );
}

export default ModalEditTag;
