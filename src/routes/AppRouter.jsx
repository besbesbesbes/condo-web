import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import useUserStore from "../stores/user-store";
import Trans from "../pages/Trans";
import New from "../pages/New";
import Report from "../pages/Report";
import Setting from "../pages/Setting";

const guestRouter = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "*", element: <Navigate to="/" /> },
]);

const userRouter = createBrowserRouter([
  { path: "/", element: <Trans /> },
  { path: "/trans", element: <Trans /> },
  { path: "/new", element: <New /> },
  { path: "/report", element: <Report /> },
  { path: "/setting", element: <Setting /> },
  { path: "*", element: <Navigate to="/trans" /> },
]);

export default function AppRouter() {
  const user = useUserStore((state) => state.user);
  const finalRouter = user ? userRouter : guestRouter;
  return <RouterProvider router={finalRouter} />;
}
