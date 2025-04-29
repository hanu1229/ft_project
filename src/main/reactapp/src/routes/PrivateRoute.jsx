import { Navigate } from "react-router-dom";
import { getToken } from "../utils/tokenUtil";

export default function PrivateRoute({ children }) {
    const token = getToken();
    return token ? children : <Navigate to="/admin/login" />;
}