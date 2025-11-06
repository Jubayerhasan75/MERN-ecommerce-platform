import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AdminRoute: React.FC = () => {
 
  const { userInfo } = useAppContext();

  
  if (userInfo && userInfo.isAdmin) {
   
    return <Outlet />;
  } else {
  
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminRoute;