import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import dateFormat from '../../lib/dateFormat';
import http from '../../util/http.js';
import Loading from '../../components/Loading.jsx';

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [shows, setShows] = useState([]);

  const getShows = async () => {
    await http.get('/api/admin/all-shows').then(({ result }) => {
      setShows(result);
    });
  };

  useEffect(() => {
    getShows();
  }, []);
  return shows.length > 0 ? (
    <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
      <Title
        text1='List'
        text2='Shows'
      />
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Total Boookings</th>
              <th className='p-2 font-medium'>Earnings</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {shows.map((item, index) => (
              <tr
                key={index}
                className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'
              >
                <td className='p-2 min-w-45 pl-5'>{item.movie.title}</td>
                <td className='p-2'>{dateFormat(item.showDateTime)}</td>
                <td className='p-2'>{Object.keys(item.occupiedSeats).length}</td>
                <td className='p-2'>{`${currency} ${Object.keys(item.occupiedSeats).length * item.showPrice}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) :
    <Loading />
  ;
};

export default ListShows;
