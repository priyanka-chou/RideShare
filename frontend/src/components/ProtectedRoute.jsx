
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, user, allowedRoles }) => {
    const location = useLocation();

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
