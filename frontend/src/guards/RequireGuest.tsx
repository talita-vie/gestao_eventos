import { Navigate, Outlet } from "react-router-dom";

export function RequireGuest() {
    const isAuthenticated = !!localStorage.getItem('@Eventos:token');

    if(isAuthenticated) {
        return <Navigate to='/' replace />
    }

    return <Outlet />
}