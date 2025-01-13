import { Navigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("authToken");

    if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);

        if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
            localStorage.removeItem("authToken");
            return <Navigate to="/login" replace />;
        }

        return children;
    }

    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
