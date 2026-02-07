import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loading from '../components/Loading.jsx';
import { ArrowRightIcon, Clock } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCricle from '../components/BlurCricle.jsx';
import toast from 'react-hot-toast';
import http from '../util/http.js';
import { useAppContext } from '../context/AppContext.jsx';

const SeatLayout = () => {
  const groupRows = [
    ['A', 'B'],
    ['C', 'D'],
    ['E', 'F'],
    ['G', 'H'],
    ['I', 'J'],
  ];
  const { id, date } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [schduleDateTime, setSchduleDateTime] = useState([]);
  const navigate = useNavigate();
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const { user } = useAppContext();
  const [isBooking, setIsBooking] = useState(false);

  const getShow = async () => {
    await http.get(`/api/show/${id}`).then(({ result, dateTime }) => {
      setMovie(result);
      setSchduleDateTime(dateTime);
    });
  };

  const getOccupiedSeats = async () => {
    await http.get(`/api/booking/seats/${selectedTime?.showId}`).then(({ result }) => {
      setOccupiedSeats(result || []);
    });
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast('Please select time first');
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast('You can only select 5 seats');
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((seat) => seat === seatId) : [...prev, seatId]
    );
  };

  const bookTicket = async () => {
    if (isBooking) { // 防止重复点击
      return;
    }
    setIsBooking(true);

    try {
      if (!user) {
        toast('Please login to proceed');
        return;
      }
      if (!selectedSeats.length) {
        toast('Please select seats');
        return;
      }
      await http
        .post(`/api/booking/create`, { showId: selectedTime.showId, selectedSeats })
        .then(({ success, message, url }) => {
          if (success) {
            window.location.href = url;
          } else {
            toast.error(message);
          }
        });
    } catch (error) {
      console.log(e);
      toast.error(e.message)
    } finally {
      setIsBooking(false)
    }
  };

  useEffect(() => {
    getShow();
  }, []);

  useEffect(() => {
    getOccupiedSeats();
  }, [selectedTime]);


  const renderSeats = (row, count = 9) => {
    return (
      <div
        key={row}
        className='flex gap-2 mt-2'
      >
        <div className='flex flex-wrap items-center justify-center gap-2'>
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            return (
              <button
                key={seatId}
                onClick={() => handleSeatClick(seatId)}
                className={`w-8 aspect-square rounded border border-primary/60 cursor-pointer transition ${selectedSeats.includes(seatId) && 'bg-primary'} 
                 ${occupiedSeats.includes(seatId) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`} // 禁用鼠标点击
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return schduleDateTime[date] ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {isBooking && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/40 z-20'>
          <Loading />
        </div>
      )}
      {/* 时间表 */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-medium px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {schduleDateTime[date].map((item, index) => (
            <div
              key={index}
              className={`flex flex-row px-6 py-2 gap-2 items-center rounded-r-md cursor-pointer transition ${item.time === selectedTime?.time && 'bg-primary'}`}
              onClick={() => setSelectedTime(item)}
            >
              <Clock className='w-4 aspect-square' />
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 座位表 */}
      <div className='relative flex flex-col items-center justify-center flex-1 max-md:mt-16'>
        <BlurCricle
          top='-100px'
          left='-100px'
        />
        <BlurCricle
          right='0px'
          bottom='-120px'
        />
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <img
          src={assets.screenImage}
          alt=''
        />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, index) => (
              <div key={index}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>

        {/* 按钮 */}
        <button
          className='flex items-center justify-center gap-1 mt-10 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 group'
          onClick={bookTicket}
        >
          Proceed to Checkout
          <ArrowRightIcon
            className='w-4 h-4 group-hover:translate-x-1 transition duration-300'
            strokeWidth={3}
          />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
