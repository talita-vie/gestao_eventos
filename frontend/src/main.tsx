import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RegisterForm } from './components/views/auth/RegisterForm.tsx'
import { LoginForm } from './components/views/auth/LoginForm.tsx'
import { Home } from './components/views/events/Home.tsx'
import { ForgotPasswordForm } from './components/views/auth/ForgotPasswordForm.tsx'

const router = createBrowserRouter([
  {

    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
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
      }
    ]
  },
  
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
