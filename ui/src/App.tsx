import SignIn from './components/SignIn/SignIn';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css'
import Data from './components/Data/Data';
import { AuthContextProvider } from './state/authContext';
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <div>Hello world!</div>,
//   },
//   {
//     path: "/sign",
//     element: <SignIn />,
//   },
//   {
//     path: "/data",
//     element: <Data />,
//   },
//   {
//     path: "/dashboard",
//     element: <div>Logged In!</div>,
//   },
// ]);

function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<div>Hello world!</div>} />
          <Route path="/sign" element={<SignIn />} />
          <ProtectedRoute>
            <Route path="/dashboard"> element={<Data />} </Route>
          </ProtectedRoute>
        </Routes>
      </AuthContextProvider>
    </>
  )
}

export default App
