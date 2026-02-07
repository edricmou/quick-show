import React, { useEffect, useState } from 'react';
import BlurCricle from '../components/BlurCricle.jsx';
import Loading from '../components/Loading.jsx';
import timeFormat from '../lib/timeFormat.js';
import dateFormat from '../lib/dateFormat.js';
import http from '../util/http.js';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currency = import.meta.env.VITE_CURRENCY;
  const imageURL = import.meta.env.VITE_TMDB_IMAGE_URL;

  const getMyBooking = async () => {
    setIsLoading(true);
    await http.get('/api/user/bookings').then(({ result }) => {
      setBookings(result);
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getMyBooking();
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCricle
        top='100px'
        left='100px'
      />
      <div>
        <BlurCricle
          bottom='0px'
          left='600px'
        />
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Booking</h1>

      <div className='flex flex-col gap-4'>
        {bookings.map((booking, index) => (
          <div
            key={index}
            className='flex flex-col md:flex-row gap-2 justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'
          >
            <div className='flex flex-col md:flex-row'>
              <img
                src={imageURL + booking.show.movie.poster_path}
                alt=''
                className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'
              />
              <div className='flex flex-col p-4 justify-between'>
                <h1 className='text-lg font-semibold'>{booking.show.movie.title}</h1>
                <p className='text-gray-400 text-sm'>{timeFormat(booking.show.movie.runtime)}</p>
                <p className='text-gray-400 text-sm mt-auto'>
                  {dateFormat(booking.show.showDateTime)}
                </p>
              </div>
            </div>

            <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
              {/* 价格和支付按钮 */}
              <div className='flex items-center gap-4'>
                <p className='text-2xl font-semibold mb-3'>
                  {currency}
                  {booking.amount}
                </p>
                {!booking.isPaid && (
                  <Link to={booking.paymentLink}>
                    <button className='bg-primary px-4 py-1.5 mb-3 text-sm rounded font-medium cursor-pointer hover:bg-primary-dull active:scale-95 transition'>
                      Pay Now
                    </button>
                  </Link>
                )}
              </div>

              <div className='text-sm'>
                <p>
                  <span className='text-gray-400'>Total Tickets:</span>
                  {booking.bookedSeats.length}
                </p>
                <p>
                  <span className='text-gray-400'>Seat Number:</span>
                  {booking.bookedSeats.join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
