import { useSelector } from "react-redux";
import { Navigate, Outlet} from 'react-router-dom';
import DashboardLayout from "../layouts/DashboardLayout";

const PrivateRoute = () => {
    const { token } = useSelector((state) => state.auth);

    return token ? (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;