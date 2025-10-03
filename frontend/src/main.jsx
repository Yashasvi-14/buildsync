import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {Provider} from 'react-redux';
import { store } from './store/store.js';
import App from './App.jsx';
import './index.css';

// Import your page components
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App is the main layout component
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },

      {
        path: '',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <HomePage />,
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