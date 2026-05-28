import { Navigate, Outlet } from "react-router-dom";

export function RequireAuth() {
    const isAuthenticated = !!localStorage.getItem('@Eventos:token');

    if(!isAuthenticated) {
        return <Navigate to='/login' replace />
    }

    return <Outlet />
}