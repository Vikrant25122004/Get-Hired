import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import Profile from './components/Profile.jsx';
import Navbar from './components/Navbar.jsx'; // This is your layout component for /home
import ResumeScorerPage from './components/ResumeScorePage.jsx';
import Footer from './components/Footer.jsx';
import AuthPage from './components/Authpage.jsx';
import Linkedinjobs from './components/Linkedinjobs.jsx';
import Cookies from 'js-cookie';
import Dashboard from './components/Dashboard.jsx';


// Assuming you have these components as discussed for the /profile hierarchy

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/home',
    element: <Navbar />,
    loader: async () => {
      const token = Cookies.get('token');
      if (!token) {
        return redirect("/login");
      }
      return null;
    },
    children: [
      {
        index: true,
        element: (
          <>
            <Profile />
            <Footer />
          </>
        ),
      },
      {
        path: 'resume-dashboard',
        element: (
          <>
            <ResumeScorerPage />
            <Footer />
          </>
        ),
      },
      {
        path: 'linkedin-jobs',
        element: (
          <>
            <Linkedinjobs />
            <Footer />
          </>
        ),
      },
      {
        path: 'GrowthAnalysis',
        element: (
          <>
            <Dashboard/>
            <Footer />
          </>
        ),

      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);