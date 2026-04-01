import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {Provider} from 'react-redux';
import { store } from './store/store.js';
import App from './App.jsx';
import './index.css';

// Import your page components
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from './pages/HomePage.jsx';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from './pages/LoginPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },

      // Protected routes
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <HomePage />,
              },
              {
                path: 'users',
                element: <UsersPage />,
              },
              {
                path: "/profile",
                element: <ProfilePage />,
              }
            ],
          },
        ],
      },
    ],
  },
]);

// Render the app with the RouterProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);