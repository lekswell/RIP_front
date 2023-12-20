import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EventsPage from './pages/EventsPage/Events';
import EventPage from './pages/EventPage/Event';

const router = createBrowserRouter([
  // {
  //   path: '/RIP_front',
  //   element: <EventsPage />,
  // },
  {
    path: '/RIP_front/events',
    element: <EventsPage />,
  },
  {
    path: '/RIP_front/events/:id/',
    element: <EventPage />,
  },
]);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
