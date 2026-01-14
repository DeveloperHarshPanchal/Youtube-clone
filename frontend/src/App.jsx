import { Suspense, useState } from "react";
import { Outlet } from "react-router";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { ToastProvider } from "./components/CustomToast"; // <-- Custom YouTube-style toast
import "./App.css";

function App() {
  const [sideBarHidden, setSideBarHidden] = useState(false);

  const toggleSideBar = () => setSideBarHidden(!sideBarHidden);

  return (
    <div className="app-container">
      {/* ToastProvider for entire app */}
      <ToastProvider />

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
    </div>
  );
}

function Loading() {
  return (
    <div className="loading-container">
      <div className="loader-spin"></div>
    </div>
  );
}

export default App;
