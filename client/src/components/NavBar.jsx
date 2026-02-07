import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react';
import { useClerk, UserButton } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext.jsx';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, openSignIn } = useClerk();
  const { favoriteMovies } = useAppContext();

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 sm:px-16 lg:px-36 py-5'>
      <Link to={'/'}>
        <img
          src={assets.logo}
          alt='logo'
          className='w-36 h-auto'
        />
      </Link>

      {/* menu */}
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex
       flex-col md:flex-row  items-center max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen
       md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden 
       transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}
      >
        <XIcon
          className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'
          onClick={() => setIsOpen(!isOpen)}
        />
        <Link
          to='/'
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Home
        </Link>
        <Link
          to='/movies'
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Movies
        </Link>
        <Link
          to='/'
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Theaters
        </Link>
        <Link
          to='/'
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
        >
          Releases
        </Link>
        {favoriteMovies.length > 0 && (
          <Link
            to='/favorite'
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
          >
            Favorites
          </Link>
        )}
      </div>

      <div className='flex items-center gap-8 max-md:gap-0'>
        <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label='My Bookings'
                labelIcon={
                  <TicketPlus
                    width={15}
                    height={15}
                  />
                }
                onClick={() => navigate('/my-bookings')}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull
         transition rounded-full font-medium cursor-pointer'
            onClick={() => openSignIn()}
          >
            Login
          </button>
        )}

        <MenuIcon
          className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
};

export default NavBar;
