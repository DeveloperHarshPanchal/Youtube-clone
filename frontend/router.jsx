import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import App from "./App";
import { homeLoader } from "./routes/Home.jsx";
import { watchLoader } from "./routes/Watch.jsx";
import Error from "./components/Error.jsx";
import { channelLoader } from "./routes/channel.jsx";

const Home = lazy(() => import("./routes/Home.jsx"));
const Register = lazy(() => import("./routes/Register.jsx"));
const Login = lazy(() => import("./routes/Login.jsx"));
const Watch = lazy(() => import("./routes/Watch.jsx"));
const Channel = lazy(() => import("./routes/Channel.jsx"));

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
