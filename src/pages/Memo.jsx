import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useMainStore from "../stores/main-store";
import { useTranslation } from "react-i18next";
import ModalAddMemo from "../components/ModalAddMemo";
import {
  FilterIcon,
  HideIcon,
  LockIcon,
  NewIcon,
  NoTrans,
  PrivateIcon,
  SearchIcon,
  SortNewIcon,
  SortOldIcon,
  ToTopIcon,
  UnHideIcon,
} from "../icons/menuIcon";
import useUserStore from "../stores/user-store";
import { getMemo } from "../apis/memo-api";
import ModalEditMemo from "../components/ModalEditMemo";
import ModalConfirmDeleteMemo from "../components/ModalConfirmDeleteMemo";
import AnimatedSection from "../components/AnimatedSection";

function Memo() {
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const { t } = useTranslation();
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const isLoad = useMainStore((state) => state.isLoad);
  const [memos, setMemos] = useState([]);
  const [filteredMemos, setFilteredMemos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [animationVersion, setAnimationVersion] = useState(0);
  const [filter, setFilter] = useState({
    users: {}, // { userId: true/false }
    hidden: false,
  });
  const [sort, setSort] = useState("new");
  const [showToTop, setShowToTop] = useState(false);
  const [users, setUsers] = useState([]);

  const hdlGetMemo = async () => {
    setIsLoad(true);
    try {
      const result = await getMemo(token);
      console.log(result);
      setMemos(result?.data?.memos);
      setUsers(result?.data?.users || []);
      console.log(result?.data?.users || []);
    } catch (err) {
      const msg = err?.response?.data?.msg || err.message;
      console.log(msg);
    } finally {
      setIsLoad(false);
    }
  };

  const getFilteredMemos = () => {
    const keyword = debouncedSearch.trim().toLowerCase();

    const filtered = memos.filter((memo) => {
      // User filter
      const matchUser = filter.users[memo.user.userId];

      if (!matchUser) return false;

      // Hidden filter
      const isHidden = memo.isHidden;

      if (!filter.hidden && isHidden) {
        return false;
      }

      // Search filter
      const matchSearch =
        keyword === "" || memo.txt.toLowerCase().includes(keyword);

      return matchSearch;
    });

    filtered.sort((a, b) => {
      const timeA = new Date(a.updatedAt).getTime();
      const timeB = new Date(b.updatedAt).getTime();

      return sort === "new"
        ? timeB - timeA // newest first
        : timeA - timeB; // oldest first
    });

    setFilteredMemos(filtered);
    setAnimationVersion((v) => v + 1);
  };

  const hdlScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setShowToTop(false);
  };

  useEffect(() => {
    if (users.length) {
      const init = {};
      users.forEach((u) => {
        init[u.userId] = true;
      });

      setFilter((prev) => ({
        ...prev,
        users: init,
      }));
    }
  }, [users]);

  useEffect(() => {
    const timmer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(timmer);
  }, [searchText]);

  useEffect(() => {
    getFilteredMemos();
  }, [memos, filter, debouncedSearch, sort]);

  useEffect(() => {
    setCurMenu("memo");
    hdlGetMemo();
  }, []);

  useEffect(() => {
    if (selectedMemo) {
      document.getElementById("edit_memo_modal")?.showModal();
    }
  }, [selectedMemo]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        setShowToTop(true);
      } else {
        setShowToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-screen bg-app overflow-y-auto flex flex-col gap-2 items-center relative mb-[75px] mt-[50px] pb-12">
      {/* header */}
      <Header />
      {/* searh */}
      <AnimatedSection
        className="w-10/11 flex items-center justify-between mt-3 gap-2"
        index={0}
      >
        <AnimatedSection
          index={1}
          className="h-[30px] flex-1 concave bg-surface flex justify-between items-center px-2"
        >
          <input
            className=" w-full focus:outline-none pl-1"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t("searchField")}
          />
          {searchText ? (
            <div
              className="h-[20px] text-[11px] bg-accent text-text-reverse convex px-2 flex items-center justify-center"
              onClick={() => setSearchText("")}
            >
              {t("clear")}
            </div>
          ) : (
            <SearchIcon className="w-[20px] h-[20px] flex-none" />
          )}
        </AnimatedSection>
        {/* sort */}
        {sort === "new" ? (
          <AnimatedSection index={2}>
            <button
              className="flex-none h-[30px] w-[80px] flex justify-center items-center convex btn-primary text-text-reverse gap-1"
              onClick={() =>
                setSort((prev) => (prev === "new" ? "old" : "new"))
              }
            >
              <SortNewIcon className="w-[20px] h-[20px]" />
              <p>{t("new")}</p>
            </button>{" "}
          </AnimatedSection>
        ) : (
          <AnimatedSection index={2}>
            <button
              className="flex-none h-[30px] w-[80px] flex justify-center items-center convex btn-primary text-text-reverse gap-1"
              onClick={() =>
                setSort((prev) => (prev === "new" ? "old" : "new"))
              }
            >
              <SortOldIcon className="w-[20px] h-[20px]" />
              <p>{t("old")}</p>
            </button>
          </AnimatedSection>
        )}
      </AnimatedSection>
      {/* filter */}
      <AnimatedSection
        className="w-10/11 flex items-center justify-between gap-2 mt-1 flex-wrap"
        index={1}
      >
        {users.length > 1 ? (
          <div className="flex gap-2">
            {users.map((u, index) => {
              const isMe = Number(u.userId) === Number(user.userId);
              const isActive = filter.users[u.userId];

              return (
                <AnimatedSection index={index} key={u.userId}>
                  <button
                    className={`w-[100px] h-[30px] flex-none convex my-1 ${
                      isActive
                        ? isMe
                          ? "bg-accent text-text-reverse font-bold"
                          : "bg-friend text-text-reverse font-bold"
                        : "bg-surface"
                    }`}
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        users: {
                          ...prev.users,
                          [u.userId]: !prev.users[u.userId],
                        },
                      }))
                    }
                  >
                    {u.userName}
                  </button>
                </AnimatedSection>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-2"></div>
        )}{" "}
        <AnimatedSection index={2}>
          <button
            className={`w-[100px] h-[30px] flex-none convex my-1 flex gap-1 items-center justify-center ${filter.hidden ? "bg-primary text-text-reverse font-bold" : "bg-surface"}`}
            onClick={() =>
              setFilter((prev) => ({ ...prev, hidden: !prev.hidden }))
            }
          >
            {filter.hidden ? (
              <UnHideIcon className="w-[20px] h-[20px]" />
            ) : (
              <HideIcon className="w-[20px] h-[20px]" />
            )}

            {t("hidden")}
          </button>{" "}
        </AnimatedSection>
      </AnimatedSection>
      {/* memo list */}
      <AnimatedSection className="w-9/10 flex flex-col gap-4 mt-2" index={2}>
        {filteredMemos?.length > 0
          ? filteredMemos.map((el, idx) => (
              <AnimatedSection
                key={`${animationVersion}-${el.memoId}`}
                className="w-full flex gap-2"
                index={3 + idx * 2}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMemo({ ...el });
                }}
              >
                <div className="w-[50px] flex-none flex flex-col items-center">
                  <div
                    className={`w-[24px] h-[24px] flex justify-center items-center convex bg-primary ${el?.userId === user.userId ? "bg-accent" : "bg-friend"}`}
                  >
                    <p className="text-text-reverse">
                      {el.user.userName?.[0]?.toUpperCase()}
                    </p>
                  </div>
                  <div className="w-[50px] flex flex-col">
                    {/* date */}
                    <div className=" text-center text-[12px] border-b border-main">
                      {new Date(el.updatedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                    {/* time */}
                    <div className="text-[12px] text-center">
                      {new Date(el.updatedAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </div>
                  </div>
                </div>
                <div className="w-full min-w-0 min-h-[70px] convex bg-surface p-2 relative">
                  <p className="whitespace-pre-wrap break-words line-clamp-3">
                    {el.txt}
                  </p>
                  {/* badges */}
                  <div className="absolute right-0 top-0 text-[11px] flex gap-1 -translate-y-2 translate-x-1">
                    {el?.isPrivate && (
                      <div className="flex justify-between items-center convex px-1 gap-1 text-text-reverse bg-accent">
                        <PrivateIcon className="w-[14px] h-[14px] my-[3px]" />
                        {t("private")}
                      </div>
                    )}
                    {el?.isLock && (
                      <div className="flex justify-between items-center convex px-1 gap-1 text-text-reverse bg-primary">
                        <LockIcon className="w-[14px] h-[14px] my-[3px]" />
                      </div>
                    )}
                    {el?.isHidden && (
                      <div className="flex justify-between items-center convex px-1 gap-1 text-text-reverse bg-accent">
                        <HideIcon className="w-[14px] h-[14px] my-[3px]" />
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))
          : !isLoad && (
              // no tran
              <div className="flex flex-col justify-center items-center m-4 gap-2 text-text/50">
                <NoTrans className="w-[40px] h-[40px]" />
                <p className="text-center">{t("noRecordFound")}</p>
              </div>
            )}
      </AnimatedSection>
      {/* add new */}
      {/* <AnimatedSection
        className="w-full flex justify-center"
        index={3 + filteredMemos.length}
      > */}
      <AnimatedSection
        index={3}
        className="w-[150px] h-[30px] fixed bottom-18 my-2 btn btn-primary text-text-reverse"
        onClick={(e) => {
          e.stopPropagation();
          document.getElementById("add_memo_modal").showModal();
        }}
      >
        <div className="flex gap-1 items-center">
          <NewIcon className="w-[20px] h-[20px]" />
          {t("add")}
        </div>
      </AnimatedSection>
      {/* </AnimatedSection> */}
      {/* to top */}
      {showToTop && (
        <AnimatedSection
          className="w-[30px] h-[30px] fixed bottom-18 right-4 my-2 bg-primary convex text-text-reverse flex justify-center items-center"
          onClick={hdlScrollToTop}
        >
          <ToTopIcon className="w-[20px] h-[20px]" />
        </AnimatedSection>
      )}

      {/* modal add memo */}
      <dialog id="add_memo_modal" className="modal">
        <ModalAddMemo refreshMemo={hdlGetMemo} />
      </dialog>
      {/* modal edit memo */}
      <dialog
        id="edit_memo_modal"
        className="modal"
        onClose={() => setSelectedMemo(null)}
      >
        {selectedMemo && (
          <ModalEditMemo refreshMemo={hdlGetMemo} memo={selectedMemo} />
        )}
      </dialog>
      {/* modal delete memo */}
      <dialog id="confirm-delete-memo-modal" className="modal">
        <ModalConfirmDeleteMemo refreshMemo={hdlGetMemo} memo={selectedMemo} />
      </dialog>
      <Footer />
    </div>
  );
}

export default Memo;
