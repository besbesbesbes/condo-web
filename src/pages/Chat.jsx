import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import Footer from "../components/Footer";
import { getChatInfoApi, addNewMsg } from "../apis/chat-api";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";
import { useTranslation } from "react-i18next";
import { AppIcon, ChatIcon } from "../icons/menuIcon";
import Header from "../components/Header";

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
    setCurMenu("chat");
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
      <div className="w-screen bg-app overflow-y-auto flex flex-col items-center relative mb-[120px] mt-[60px]">
        {/* header */}
        <Header />
        {/* chat area */}
        <div className="w-full px-4 flex-1 overflow-y-auto flex flex-col p-2 gap-2 ">
          {msgs ? (
            msgs.map((el, idx) => (
              <div
                key={idx}
                className={`py-3 w-fit px-4 concave text-text-reverse ${
                  user.userId === el.userId
                    ? "self-end bg-primary text-right"
                    : "bg-accent "
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
        <div className="w-11/12 h-[60px] flex gap-2 fixed bottom-[55px]">
          <input
            type="text"
            className="input-field flex-1 concave bg-surface pl-4"
            value={input.txt}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, txt: e.target.value }))
            }
          />
          <button
            className="btn btn-primary text-text-reverse w-[100px]"
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
