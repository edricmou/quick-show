import React from 'react';
import NavBar from './components/NavBar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Favorite from './pages/Favorite';
import Movies from './pages/Movies';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import Layout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import AddShows from './pages/admin/AddShows';
import ListShows from './pages/admin/ListShows';
import ListBookings from './pages/admin/ListBookings';
import { useAppContext } from './context/AppContext.jsx';
import { SignIn } from '@clerk/clerk-react';
import Loading from './components/Loading.jsx';


const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  const { user, favoriteMovies } = useAppContext();

  return (
    <>
      {!isAdminRoute && <NavBar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movie/:id' element={<MovieDetails />} />
        <Route path='/movie/:id/:date' element={<SeatLayout />} />
        <Route path='/loading/:nextUrl' element={<Loading />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        {favoriteMovies.length > 0 && <Route path='/favorite' element={<Favorite />} />}
        <Route path='/admin/*' element={ user ? <Layout /> :
          <div className='flex min-h-screen justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'}/>
          </div>} >
          <Route index element={<Dashboard />} />
          <Route path='add-shows' element={<AddShows />} />
          <Route path='list-shows' element={<ListShows />} />
          <Route path='list-bookings' element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
      <Toaster />
    </>
  )
}

export default App