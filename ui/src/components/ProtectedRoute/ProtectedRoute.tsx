import { Navigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../state/authContext';

export const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const token = useContext(AuthContext)
    if (!token) {
      // user is not authenticated
      return <Navigate to="/sign" />;
    }
    return children;
  };
