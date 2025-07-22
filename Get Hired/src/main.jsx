import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Profile from './components/Profile.jsx';
import Navbar from './components/Navbar.jsx'; // This is your layout component for /home
import ResumeScorerPage from './components/ResumeScorePage.jsx';
import Footer from './components/Footer.jsx';
import AuthPage from './components/Authpage.jsx';
import Linkedinjobs from './components/Linkedinjobs.jsx';

// Assuming you have these components as discussed for the /profile hierarchy

const router = createBrowserRouter([
  {
    path: '/',
    element: <App /> 
  },
  {path:'/login',
    element:<AuthPage/>
  },
  {
    path: '/home',
    element: <Navbar />, 
    children: [
      {
        index: true,
        element: [<Profile />, <Footer/>]
       
      },
      {
        path : 'resume-dashboard',
        element:[<ResumeScorerPage/>,<Footer/>]
      },
      {
        path: 'linkedin-jobs',
        element:[<Linkedinjobs/>,<Footer/>]
      }
    
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);