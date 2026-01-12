import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import App from "./App";
import { homeLoader } from "./pages/Home.jsx";
import { watchLoader } from "./pages/Watch.jsx";
import Error from "./components/Error.jsx";
import { channelLoader } from "./pages/channel.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Watch = lazy(() => import("./pages/Watch.jsx"));
const Channel = lazy(() => import("./pages/channel.jsx"));

// Suspence added in App.jsx for all routes
const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        loader: homeLoader,
        Component: Home,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/watch/:videoId",
        loader: watchLoader,
        Component: Watch,
      },
      {
        path: "/channel/:channelId",
        loader: channelLoader,
        Component: Channel,
      },
    ],
  },
]);

export default router;
