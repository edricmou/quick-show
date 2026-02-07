import React, { useEffect } from 'react';
import AdminNavBar from '../../components/admin/AdminNavBar';
import AdminSideBar from '../../components/admin/AdminSideBar';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import Loading from '../../components/Loading.jsx';

const Layout = () => {
  const { fetchIsAdmin, isAdmin } = useAppContext();
  useEffect(() => {
    fetchIsAdmin();
  });
  return isAdmin ? (
    <div>
      <AdminNavBar />
      <div className='flex'>
        <AdminSideBar />
        <div className='flex-1 overflow-x-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
