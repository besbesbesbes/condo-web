import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import useUserStore from "../stores/user-store";
import Condo from "../pages/Condo";
import Trans from "../pages/Trans";

export default function AppRouter() {
  const token = useUserStore((state) => state.token);
  return (
    <Router>
      <Routes>
        <Route path="*" element={token ? <Trans /> : <Login />} />
      </Routes>
    </Router>
  );
}
