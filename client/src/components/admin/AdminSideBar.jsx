import React from 'react';
import { assets } from '../../assets/assets';
import { LayoutDashboardIcon, ListIcon, PlusSquareIcon, ListCollapseIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminSideBar = () => {
  const user = {
    firstName: 'Admin',
    lastName: 'User',
    profile: assets.profile,
  };

  const adminNavLinks = [
    {
      label: 'Dashboard',
      icon: LayoutDashboardIcon,
      href: '/admin',
    },
    {
      label: 'Add Shows',
      icon: PlusSquareIcon,
      href: '/admin/add-shows',
    },
    {
      label: 'List Shows',
      icon: ListIcon,
      href: '/admin/list-shows',
    },
    {
      label: 'List Bookings',
      icon: ListCollapseIcon,
      href: '/admin/list-bookings',
    },
  ];
  return (
    <div className='h-[calc(100vh-64px)] md:flex flex-col item-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm'>
      <img
        src={user.profile}
        alt=''
        className='h-9 w-9 md:h-14 md:w-14 rounded-full mx-auto cursor-pointer'
      />
      <p className='text-base mt-2 max-md:hidden mx-auto'>{`${user.firstName} ${user.lastName}`}</p>
      <div className='w-full'>
        {adminNavLinks.map((item, index) => {
          return (
            <NavLink
              key={index}
              to={item.href}
              end={true}
              className={({ isActive }) =>
                `relative flex items-center  max-md:justify-center gap-2 w-full py-2.5 md:pl-10 first:mt-6 text-gray-400
                        ${isActive && 'bg-primary/15 text-primary group'}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className='w-5 h-5' />
                  <p className='max-md:hidden'>{item.label}</p>
                  <span
                    className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive && 'bg-primary'}`}
                  ></span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSideBar;
