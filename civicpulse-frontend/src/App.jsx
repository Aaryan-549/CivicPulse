import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Heatmap from "./pages/Heatmap";
import Complaints from "./pages/Complaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import Complainants from "./pages/Complainants";
import ComplainantDetails from "./pages/ComplainantDetails";
import Workers from "./pages/Workers";
import WorkerDetails from "./pages/WorkerDetails";
import Settings from "./pages/Settings";
import Layout from "./layouts/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
          <Route path="/complainants" element={<Complainants />} />
          <Route path="/complainants/:id" element={<ComplainantDetails />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/workers/:id" element={<WorkerDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
