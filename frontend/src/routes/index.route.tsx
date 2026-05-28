import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import { authRoutes } from "./auth.routes";
import { RequireGuest } from "../guards/RequireGuest";
import { RequireAuth } from "../guards/RequireAuth";
import { appRoutes } from "./app.route";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <RequireGuest />,
        children: [
            ...authRoutes
        ]
      },
      {
        element: <RequireAuth />,
        children: [
            ...appRoutes
        ]
      }
      
    ]
  },
  
]);