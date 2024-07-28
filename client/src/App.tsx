import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";

import Match from './components/Match/Match';
import Inbox from './components/Inbox/Inbox';
import Profile from './components/Profile/Profile';
import Swipe from './components/Swipe/Swipe';
import AboutUs from './components/AboutUs/AboutUs';
import SignIn from './components/SignIn/SignIn';

function App() {
  const [currentPage, setCurrentPage] = React.useState("about-us");
  type modalType = string | null;
  const [openModal, setOpenModal] = React.useState<modalType>(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root currentPage={currentPage} setCurrentPage={setCurrentPage} openModal={openModal} setOpenModal={setOpenModal} />,
      children: [
        {
          path: "/",
          element: <AboutUs setCurrentPage={setCurrentPage} />,
        },
        {
          path: "swipe",
          element: <Swipe setCurrentPage={setCurrentPage} openModal={openModal} setOpenModal={setOpenModal} />,
        },
        {
          path: "match",
          element: <Match setCurrentPage={setCurrentPage} />,
        },
        {
          path: "inbox",
          element: <Inbox setCurrentPage={setCurrentPage} />,
        },
        {
          path: "profile",
          element: <Profile setCurrentPage={setCurrentPage} />,
        },
        {
          path: "signin",
          element: <SignIn setCurrentPage={setCurrentPage} />,
        },
      ]
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
