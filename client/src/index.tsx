import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Swipe from './components/Swipe/Swipe';
import AboutUs from './components/AboutUs/AboutUs';
/*import Match from './components/Match/Match';
import Inbox from './components/Inbox/Inbox';
import Profile from './components/Profile/Profile';*/
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Root from "./routes/root";
import Match from './components/Match/Match';
import Inbox from './components/Inbox/Inbox';
import Profile from './components/Profile/Profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <AboutUs />,
      },
      {
        path: "swipe",
        element: <Swipe />,
      },
      {
        path: "match",
        element: <Match />,
      },
      {
        path: "inbox",
        element: <Inbox />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ]
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>

    <RouterProvider router={router} />
    {/*<App />*/}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
