// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/Homepage'; 
import Services from '../src/components/Services';
import Support from './components/Support';
import LogSign from './components/LogSign';
import AboutUsPage from './components/AboutUs';
import ForgotPasswordPage from './components/ForgotPassword';
import AddMechanicPage from './components/AddMechanic';
import AdminDashboard from './components/AdminDashboard';
import FeedPage from './components/Feed';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/signup',
    element: <LogSign signUp={false} key="signup" />, 
  },
  {
    path: '/login',
    element: <LogSign signUp={true} key="login" />, 
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage key="forgot"/>, 
  },
  {
    path: '/services',
    element: <Services />,
  },
  {
    path: '/support',
    element: <Support />,
  },
  {
    path: '/aboutus',
    element: <AboutUsPage />,
  },
  {
    path: '/addmechanic',
    element: <AddMechanicPage />,
  },
  {
    path :'/adminn',
    element: <AdminDashboard/>,
  },
  {
    path: '/feed',
    element: <FeedPage/>
  }
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
