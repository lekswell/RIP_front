import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EventsPage from './Events';
import EventPage from './Event';

const router = createBrowserRouter([
  {
    path: '/events',
    element: <EventsPage />,
  },
  {
    path: '/events/:id/',
    element: <EventPage />,
  },
]);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
