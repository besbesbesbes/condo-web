import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import axios from "axios";
import { socket } from "./utils/socket";

function App() {
  // axios.interceptors.request.use(
  //   (config) => {
  //     if (config.url.includes("localhost:8002")) {
  //       config.url = config.url.replace(
  //         "localhost:8002",
  //         "192.168.168.79:8002"
  //       );
  //       // config.url = config.url.replace("localhost:8001", "192.168.1.143:8001");
  //     }
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  useEffect(() => {
    // ✅ SOCKET.IO CONNECTION

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <div>
      <AppRouter />
    </div>
  );
}
export default App;
