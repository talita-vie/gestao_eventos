import type { RouteObject } from "react-router-dom";
import { Home } from "../components/pages/Home";
import { EventDetails } from "../components/pages/events/EventDetails";
import { MyEvents } from "../components/pages/events/MyEvents";
import { UserProfile } from "../components/pages/user/UserProfile";
import { CreateEvent } from "../components/pages/events/CreateEvent";
import { EditEvent } from "../components/pages/events/EditEvent";
import { EventParticipants } from "../components/pages/organizer/EventParticipants";
import { MyCertificates } from "../components/pages/certificate/MyCertificates";

export const appRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: 'event/:id',
        element: <EventDetails />
    },
    {
        path: 'my-events',
        element: <MyEvents />
    },
    {
        path: 'profile',
        element: <UserProfile />
    },
    {
        path: 'new-event',
        element: <CreateEvent />
    },
    {
        path: 'event/:id/edit',
        element: <EditEvent />
    },
    {
        path: '/organizer/events/:id/participants',
        element: <EventParticipants />
    },
    {
        path: 'my-certificates',
        element: <MyCertificates />
    }
]