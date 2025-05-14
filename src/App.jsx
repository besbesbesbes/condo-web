import AppRouter from "./routes/AppRouter";
import axios from "axios";

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

  return (
    <div>
      <AppRouter />
    </div>
  );
}
export default App;
