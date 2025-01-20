// Libraries
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// component
import MyNavigation from "./components/Navigation/MyNavigation";
// pages
import DatabasesManagement from "./pages/DatabaseManagement";
import { default as DashboardPage } from "./pages/Dashboard";
import { default as SettingPage } from "./pages/Settings";
import { default as ParticipantPage } from "./pages/DatabaseManagement/Participant";
import { default as RafflePrizePage } from "./pages/DatabaseManagement/RafflePrize";
import NotFound from "./pages/404";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        containerId="default"
        autoClose={5000}
        closeButton={false}
        enableMultiContainer
        hideProgressBar
        newestOnTop
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeOnClick
      />

      <div id="main-content" className={`relative flex w-full h-screen`}>
        <MyNavigation />
        <div className="flex-1 h-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/database-management" element={<DatabasesManagement />} >
              <Route index element={<Navigate to="participant" replace />} />
              <Route path="participant" element={<ParticipantPage />} />
              <Route path="raffle-prize" element={<RafflePrizePage />} />
            </Route>
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

