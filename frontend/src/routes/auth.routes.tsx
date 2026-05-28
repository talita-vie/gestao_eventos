import type { RouteObject } from "react-router-dom"
import { LoginForm } from "../components/pages/auth/LoginForm"
import { RegisterForm } from "../components/pages/auth/RegisterForm"
import { ForgotPasswordForm } from "../components/pages/auth/ForgotPasswordForm"
import { ResetPasswordForm } from "../components/pages/auth/ResetPasswordForm"

export const authRoutes: RouteObject[] = [
    {
        path: '/login',
        element: <LoginForm />
    },
    {
        path: '/register',
        element: <RegisterForm />
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordForm />
    },
    {
        path: '/reset-password',
        element: <ResetPasswordForm />
    }

]