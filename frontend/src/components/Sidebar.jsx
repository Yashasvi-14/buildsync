import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Home, User, LogOut, Users } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-white border-r">
      <h2 className="text-3xl font-semibold text-foreground">BuildSync</h2>
      <div className="flex flex-col justify-between h-full mt-6">
        <nav>
          <Link to="/" className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md">
            <Home className="w-5 h-5" /> {/* 2. Add Home icon */}
            <span className="mx-4 font-medium">Home</span>
          </Link>
          <Link to="/profile" className="flex items-center px-4 py-2 mt-5 text-gray-600 rounded-md hover:bg-gray-100">
            <User className="w-5 h-5" /> {/* 3. Add User icon */}
            <span className="mx-4 font-medium">Profile</span>
          </Link>
          <Link 
          to="/users"
          className="flex items-center px-4 py-2 mt-5 text-gray-600 rounded-md hover:bg-gray-100"
          >
            <Users className="w-5 h-5" />
            <span className="mx-4 font-medium">Users</span>
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mt-6 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;