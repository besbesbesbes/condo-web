import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import axios from "axios";
import { socket } from "./utils/socket";
import Loading from "./components/Loading";
import useMainStore from "./stores/main-store";
import useThemeStore from "./stores/theme-store";

function App() {
  const isLoad = useMainStore((state) => state.isLoad);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.remove("theme-dark", "theme-light");
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <div className="relative min-h-svh">
      <AppRouter />
      {isLoad && <Loading />}
    </div>
  );
}

export default App;
