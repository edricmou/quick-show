import React, { useEffect, useState } from 'react';
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
} from 'lucide-react';
import BlurCricle from '../../components/BlurCricle.jsx';
import dateFormat from '../../lib/dateFormat';
import Loading from '../../components/Loading.jsx';
import Title from '../../components/Title.jsx';
import http from '../../util/http.js';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });
  const currency = import.meta.env.VITE_CURRENCY;
  const [loading, setLoading] = useState(false);
  const imageURL = import.meta.env.VITE_TMDB_IMAGE_URL;

  const dashboardCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings || '0',
      icon: ChartLineIcon,
    },
    {
      title: 'Total Revenue',
      value: currency + dashboardData.totalRevenue || '0',
      icon: CircleDollarSignIcon,
    },
    {
      title: 'Active Shows',
      value: dashboardData.activeShows.length || '0',
      icon: PlayCircleIcon,
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUser || '0',
      icon: UsersIcon,
    },
  ];

  const fetchDashBoardData = async () => {
    setLoading(true);
    await http.get('/api/admin/dashboard').then(({ result }) => {
      setDashboardData(result);
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchDashBoardData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
      <Title
        text1='Admin'
        text2='DashBoard'
      />

      {/* 卡片 */}
      <div className='relative flex md:flex-wrap gap-4 mt-6'>
        <BlurCricle
          top='-100px'
          left='0px'
        />
        <div className='flex md:flex-wrap flex-col md:flex-row gap-4 w-full items-center'>
          {dashboardCards.map((card, index) => (
            <div
              className='flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full'
              key={index}
            >
              <div>
                <h1 className='text-sm'>{card.title}</h1>
                <p className='text-xl font-medium mt-1'>{card.value}</p>
              </div>
              <card.icon className='w-6 h-6' />
            </div>
          ))}
        </div>
      </div>

      <h1 className='text-lg font-medium mt-10 max-md:text-center'>Active Shows</h1>

      <div className='relative flex flex-col items-center gap-6 flex-wrap mt-4 w-full md:flex-row'>
        <BlurCricle
          top='100px'
          bottom='-10%'
        />
        {dashboardData.activeShows.map((movie, index) => (
          <div
            key={index}
            className='w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300'
          >
            <img
              src={imageURL + movie.movie.poster_path}
              alt=''
              className='h-60 w-full object-cover'
            />

            <p className='font-medium p-2 truncate'>{movie.movie.title}</p>

            <div className='flex justify-between items-center px-2'>
              <p className='font-medium text-lg'>{`${currency}${movie.showPrice}`}</p>
              <p className='flex justify-between items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                <StarIcon className='w-4 h-4 text-primary fill-primary' />
                {movie.movie.vote_average.toFixed(1)}
              </p>
            </div>

            <p className='px-2 pt-2 text-sm text-gray-500'>{dateFormat(movie.showDateTime)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
