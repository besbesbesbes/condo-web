import AppRouter from "./routes/AppRouter";
import axios from "axios";

function App() {
  axios.interceptors.request.use(
    (config) => {
      if (config.url.includes("localhost:8001")) {
        // config.url = config.url.replace("localhost:8002", "192.168.1.132:8002");
        config.url = config.url.replace("localhost:8001", "192.168.1.11:8001");
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <div>
      <AppRouter />
    </div>
  );
}
export default App;
