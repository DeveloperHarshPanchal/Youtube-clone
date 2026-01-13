import { Suspense, useState } from "react";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import "./App.css";

function App() {
  const [sideBarHidden, setSideBarHidden] = useState(false);

  const toggleSideBar = () => setSideBarHidden(!sideBarHidden);

  return (
    <div className="app-container">
      <Header toggleSideBar={toggleSideBar} />
      <div className="app-content">
        <aside
          className={`sidebar-wrapper ${
            sideBarHidden ? "sidebar-hidden" : "sidebar-visible"
          }`}
        >
          <SideBar hidden={sideBarHidden} />
        </aside>
        <main className="main-content">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "var(--color-bg-inverse)",
            color: "var(--color-fg-inverse)",
            fontWeight: "bold",
          },
          success: {
            icon: <CheckCircle className="text-green-500" size={20} />,
          },
          error: {
            icon: <AlertCircle className="text-red-500" size={20} />,
          },
          loading: {
            icon: <Loader2 className="loader-spin" size={20} />,
          },
        }}
      />
    </div>
  );
}

function Loading() {
  return (
    <div className="loading-container">
      <Loader2 className="loader-spin" />
    </div>
  );
}

export default App;
