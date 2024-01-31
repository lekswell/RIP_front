import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'; // Добавлен импорт Provider
import store from './store/Store'; // Укажите правильный путь к вашему store
import EventsPage from './pages/EventsPage/Events';
import EventPage from './pages/EventPage/Event';
import RegistrationPage from './pages/RegistrationPage/Registration';
import LoginPage from './pages/LoginPage/Login';
import ReservesPage from './pages/ReservesPage/Reserves';
import ReservePage from './pages/ReservePage/Reserve';
import EditEventPage from './pages/EditEventPage/EditEvent';
import AddEventPage from './pages/AddEventPage/AddEvent';

const router = createBrowserRouter([
  {
    path: '/RIP_front/events',
    element: <EventsPage />,
  },
  {
    path: '/RIP_front/events/:id/',
    element: <EventPage />,
  },
  {
    path: '/RIP_front/login',
    element: <LoginPage />,
  },
  {
    path: '/RIP_front/registration',
    element: <RegistrationPage />,
  },
  {
    path: '/RIP_front/reserves',
    element: <ReservesPage />,
  },
  {
    path: '/RIP_front/reserves/:id/',
    element: <ReservePage />,
  },
  {
    path: '/RIP_front/edit_events',
    element: <EditEventPage />,
  },
  {
    path: '/RIP_front/add_event',
    element: <AddEventPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Добавлен Provider для Redux Store */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
