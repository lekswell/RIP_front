import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EventsPage from './Events';
import EventPage from './Event';

const router = createBrowserRouter([
  {
    path: '/RIP_front',
    element: <h1>Это наша стартовая страница</h1>,
  },
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
