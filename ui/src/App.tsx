import SignIn from './components/SignIn/SignIn';

import './App.css'
///import Data from './components/Data/Data';
import Users from './components/Users/Users';
import { AuthContextProvider } from './state/authContext';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/sign" />} />
            <Route path="/sign" element={<SignIn />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  )
}

export default App
