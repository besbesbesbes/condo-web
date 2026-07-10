import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "../pages/Login";
import VersionChecker from "../components/VersionChecker";
import useUserStore from "../stores/user-store";
import Trans from "../pages/Trans";
import New from "../pages/New";
import Report from "../pages/Report";
import Setting from "../pages/Setting";
import Chat from "../pages/Chat";
import Calendar from "../pages/Calendar";
import Memo from "../pages/Memo";

const GuestRoot = () => (
  <>
    <VersionChecker />
    <Outlet />
  </>
);

const guestRouter = createBrowserRouter([
  {
    path: "/",
    element: <GuestRoot />,
    children: [
      { index: true, element: <Login /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);

const UserRoot = () => (
  <>
    <VersionChecker />
    <Outlet />
  </>
);

const userRouter = createBrowserRouter([
  {
    path: "/",
    element: <UserRoot />,
    children: [
      { index: true, element: <Trans /> },
      { path: "trans", element: <Trans /> },
      { path: "add", element: <New /> },
      { path: "report", element: <Report /> },
      { path: "calendar", element: <Calendar /> },
      { path: "memo", element: <Memo /> },
      { path: "setting", element: <Setting /> },
      { path: "*", element: <Navigate to="/trans" /> },
    ],
  },
]);

export default function AppRouter() {
  const user = useUserStore((state) => state.user);
  const finalRouter = user ? userRouter : guestRouter;
  return <RouterProvider router={finalRouter} />;
}
