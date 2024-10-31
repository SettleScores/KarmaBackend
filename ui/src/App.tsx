import SignIn from './components/SignIn/SignIn';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css'
import Data from './components/Data/Data';
import { AuthContextProvider } from './state/authContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/sign",
    element: <SignIn />,
  },
  {
    path: "/data",
    element: <Data />,
  },
]);

function App() {
  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </>
  )
}

export default App
