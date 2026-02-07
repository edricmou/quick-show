import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import http, { setTokenGetter } from '../util/http.js';
import toast from 'react-hot-toast';

const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const fetchIsAdmin = async () => {
    try {
      const { result } = await http.get('/api/admin/is-admin');
      if (!result) {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }

      if (!result && location.pathname.startsWith('/admin')) {
        navigate('/');
        toast.error('You are not authorized to access admin dashboard');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchShows = async () => {
    try {
      const { result } = await http.get('/api/show/all');
      setShows(result);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const { result } = await http.get('/api/user/favorites');
      setFavoriteMovies(result || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      if (location.pathname.startsWith('/admin')) {
        fetchIsAdmin();
      }
      fetchFavoriteMovies();
    }
    setTokenGetter(getToken);
  }, [user, location.pathname]);

  const value = {
    fetchIsAdmin,
    user,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
