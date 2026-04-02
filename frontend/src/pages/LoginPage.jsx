import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../store/authSlice";
import authService from "../services/authService";

const LoginPage = () => {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const userData = await authService.login(email, password);
            dispatch(loginSuccess(userData));
            navigate('/');
        } catch(error)
        {
            console.error("Login error full:", error);

    if (error.response) {
        console.error("Backend response:", error.response.data);
        alert(error.response.data.message || "Login failed");
    } else {
        alert("Network / CORS error — backend not reachable");
    }
        }
    };

    const handleDemoLogin = async (email) => {
  try {
    const userData = await authService.login(email, "123456");
    dispatch(loginSuccess(userData));
    navigate("/");
  } catch (error) {
    alert("Demo login failed");
  }
};

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email} // 2. The input's value is tied to our state.
                            onChange={(e) => setEmail(e.target.value)} // 3. The state updates when the user types.
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >
                        Login
                    </button>

                    <p className="mt-4 text-center text-sm">
                        Don’t have an account?{" "}
                        <span onClick={() => navigate("/register")} className="text-blue-600 cursor-pointer">
                            Register
                        </span>
                    </p>

                    <div className="mt-6">
  <p className="text-center text-sm text-gray-500 mb-2">Demo Login</p>

  <div className="flex flex-col gap-2">
    <button
      onClick={() => handleDemoLogin("yash1@example.com")}
      className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
    >
      Login as Admin
    </button>

    <button
      onClick={() => handleDemoLogin("manager-four@example.com")}
      className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Login as Manager
    </button>

    <button
      onClick={() => handleDemoLogin("resident@demo.com")}
      className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
    >
      Login as Resident
    </button>
  </div>
</div>
                </form>
            </div>
        </div>
    )
};

export default LoginPage;