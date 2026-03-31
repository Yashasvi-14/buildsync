import { Outlet, Link } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">BuildSync</h2>
        <nav className="space-y-2">
          <Link to="/" className="block px-3 py-2 rounded hover:bg-blue-100">
          Dashboard
          </Link>
          <Link to="/users" className="block px-3 py-2 rounded hover:bg-blue-100">
          Users
          </Link>
        </nav>
      </aside>

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