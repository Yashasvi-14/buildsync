import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </div>
          
          <Outlet />
      </main>
      
    </div>
  );
};

export default DashboardLayout;