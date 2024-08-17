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
import SignUp from './components/SignUp/SignUp';

function App() {
  const [currentPage, setCurrentPage] = React.useState("about-us");
  type modalType = string | null;
  const [openModal, setOpenModal] = React.useState<modalType>(null);
  const [loggedIn, setLoggedIn] = React.useState<boolean>(Object.keys(localStorage).includes('accessToken'));
  console.log('logged in ', loggedIn)

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root currentPage={currentPage} setCurrentPage={setCurrentPage} openModal={openModal} setOpenModal={setOpenModal} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />,
      children: [
        {
          path: "/",
          element: <AboutUs setCurrentPage={setCurrentPage} />,
        },
        {
          path: "swipe",
          element: <Swipe currentPage={currentPage} setCurrentPage={setCurrentPage} openModal={openModal} setOpenModal={setOpenModal} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />,
        },
        {
          path: "match",
          element: <Match setCurrentPage={setCurrentPage} openModal={openModal} setOpenModal={setOpenModal} setLoggedIn={setLoggedIn} />,
        },
        {
          path: "inbox",
          element: <Swipe currentPage={currentPage} setCurrentPage={setCurrentPage} openModal={openModal} setOpenModal={setOpenModal} loggedIn={loggedIn} setLoggedIn={setLoggedIn} isInbox={true} />,
        },
        {
          path: "profile",
          element: <Profile setCurrentPage={setCurrentPage} />,
        },
        {
          path: "signin",
          element: <SignIn setCurrentPage={setCurrentPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />,
        },
        {
          path: "signup",
          element: <SignUp setCurrentPage={setCurrentPage} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />,
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
