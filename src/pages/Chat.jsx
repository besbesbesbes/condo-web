import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import Footer from "../components/Footer";
import { getChatInfoApi, addNewMsg } from "../apis/chat-api";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";
import { useTranslation } from "react-i18next";

export default function Chat() {
  const { t } = useTranslation();
  const bottomRef = useRef(null);
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const setIsLoad = useMainStore((state) => state.setIsLoad);
  const [input, setInput] = useState({
    userId: null,
    txt: "",
  });
  const [msgs, setMsgs] = useState(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getChatInfo = async () => {
    setIsLoad(true);
    try {
      const result = await getChatInfoApi(token);
      setInput((prev) => ({ ...prev, userId: result.data.user.userId }));
      setMsgs(result.data.msgs);
      console.log(result.data.msgs);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  const hdlSendMsg = async (e) => {
    e.preventDefault();

    setIsLoad(true);
    try {
      const result = await addNewMsg(token, input);
      console.log(result.data);
      setInput((prev) => ({ ...prev, txt: "" }));
      // getChatInfo();
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);

  useEffect(() => {
    setCurMenu("CHAT");
    getChatInfo();

    // Socket newMessage
    socket.on("newMessage", (newMsg) => {
      console.log(newMsg);
      //add newMsg to Msgs
      setMsgs((prevMsgs) => [...prevMsgs, newMsg]);
    });

    // optional: cleanup
    return () => {
      socket.off("newMessage");
    };
  }, []);

  return (
    <div>
      <div className="w-screen  bg-white overflow-y-auto flex flex-col items-center relative  mb-[120px] mt-[60px]">
        <div className="flex justify-center w-full fixed h-[50px] top-[0] z-10 bg-slate-100 shadow">
          <p
            className="text-2xl font-bold py-2"
            onClick={() => console.log(user)}
          >
            {t("chat")}
          </p>
        </div>
        {/* chat area */}
        <div className="w-full flex-1 overflow-y-auto flex flex-col p-2 gap-2 ">
          {msgs ? (
            msgs.map((el, idx) => (
              <div
                key={idx}
                className={`py-3  w-fit px-4 rounded-xl ${
                  user.userId === el.userId
                    ? "self-end bg-orange-200 text-right"
                    : "bg-slate-200"
                }`}
              >
                {el.txt}
              </div>
            ))
          ) : (
            <p>No message</p>
          )}
          <div ref={bottomRef} />
          {/* <button onClick={() => console.log(msgs)}>msgs</button> */}
        </div>
        {/* input area */}
        <div className="w-full h-[60px] bg-slate-200 p-2 flex gap-2 fixed bottom-[70px]">
          <input
            type="text"
            className="bg-white pl-2 flex-1"
            value={input.txt}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, txt: e.target.value }))
            }
          />
          <button
            className="bg-orange-500 w-[100px] font-bold text-white cursor-pointer"
            onClick={hdlSendMsg}
          >
            {t("send")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
