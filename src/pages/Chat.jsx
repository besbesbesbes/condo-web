import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Footer from "../components/Footer";
import { getChatInfoApi, addNewMsg } from "../apis/chat-api";
import useUserStore from "../stores/user-store";
import useMainStore from "../stores/main-store";

const socketUrl = import.meta.env.VITE_API_BASE_URL_SOCKET;

export default function Chat() {
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const setCurMenu = useMainStore((state) => state.setCurMenu);
  const [input, setInput] = useState({
    userId: null,
    txt: "",
  });
  const [msgs, setMsgs] = useState(null);

  const getChatInfo = async () => {
    try {
      const result = await getChatInfoApi(token);
      setInput((prev) => ({ ...prev, userId: result.data.user.userId }));
      setMsgs(result.data.msgs);
      console.log(result.data.msgs);
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    }
  };

  const hdlSendMsg = async (e) => {
    e.preventDefault();
    try {
      const result = await addNewMsg(token, input);
      console.log(result.data);
      setInput((prev) => ({ ...prev, txt: "" }));
      // getChatInfo();
    } catch (err) {
      console.log(err?.response?.data?.msg || err.message);
    }
  };

  useEffect(() => {
    setCurMenu("CHAT");
    getChatInfo();

    // ✅ SOCKET.IO CONNECTION
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
    }); // replace with your backend URL if needed
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // Socket newMessage
    socket.on("newMessage", (newMsg) => {
      console.log(newMsg);
      //add newMsg to Msgs
      setMsgs((prevMsgs) => [...prevMsgs, newMsg]);
    });

    // optional: cleanup
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <div>
      <div className="w-screen h-[calc(100svh-60px)] bg-white overflow-y-auto flex flex-col items-center relative">
        <div className="flex justify-center w-full sticky top-[0] z-10 bg-slate-100 shadow">
          <p
            className="text-2xl font-bold py-2"
            onClick={() => console.log(user)}
          >
            Chat
          </p>
        </div>
        {/* chat area */}
        <div className="w-full flex-1 overflow-y-auto flex flex-col p-2 gap-2">
          {msgs ? (
            msgs.map((el, idx) => (
              <div
                key={idx}
                className={`py-3  w-fit min-w-[200px] px-2 rounded-xl ${
                  user.userId === el.userId
                    ? "self-end bg-orange-200"
                    : "bg-slate-200"
                }`}
              >
                {el.txt}
              </div>
            ))
          ) : (
            <p>No message</p>
          )}

          {/* <button onClick={() => console.log(msgs)}>msgs</button> */}
        </div>
        {/* input area */}
        <div className="w-full h-[60px] bg-slate-200 p-2 flex gap-2">
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
            Send
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
