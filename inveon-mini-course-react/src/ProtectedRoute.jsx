import {Navigate} from "react-router-dom";
import {useAuth} from "./context/AuthContext.jsx";

const ProtectedRoute = ({element, allowedRoles = [], redirectTo = "/login"}) => {
    const {user, loading} = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return <Navigate to={redirectTo}/>;
    }

    const hasPermission = allowedRoles.some(role => user.Roles.includes(role));

    if (allowedRoles.length > 0 && !hasPermission) {
        return <Navigate to={redirectTo}/>;
    }

    return element;
};

export default ProtectedRoute;
