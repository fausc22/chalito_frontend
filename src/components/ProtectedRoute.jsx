import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, isLoggedIn }) {
    if (!isLoggedIn) {
        return <Navigate to="/login" />
    }
    return children
}