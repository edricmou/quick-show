import React, { useState } from 'react';
import BlurCricle from './BlurCricle';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DateSeletor = ({ dateTime, id }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const onBookHandler = () => {
    if (!selectedDate) {
      return toast('Please select a date');
    }
    scrollTo(0, 0);
    navigate(`/movie/${id}/${selectedDate}`);
  };

  return (
    <div id='dateSeletor'>
      <div
        className='relative flex flex-col md:flex-row items-center justify-between gap-10 p-8
      bg-primary/10 border border-primary/20 rounded-lg'
      >
        <BlurCricle
          top='-100px'
          left='-100px'
        />
        <BlurCricle
          top='100px'
          right='0'
        />
        <div>
          <p className='text-lg font-medium'>Choose Date</p>
          <div className='flex items-center gap-6 text-sm mt-5 '>
            <ChevronLeftIcon className='w-7 cursor-pointer' />
            <span className='flex flex-cols-3 md:flex-row flex-wrap md:max-w-lg gap-4'>
              {Object.keys(dateTime).map((item) => (
                <button
                  key={item}
                  className={`flex flex-col items-center justify-center h-14 w-14 aspect-square 
                rounded cursor-prionter ${item === selectedDate ? 'bg-primary text-white' : 'border border-primary/70'} transition`}
                  onClick={() => setSelectedDate(item)}
                >
                  <span>{new Date(item).getDate()}</span>
                  <span>{new Date(item).toLocaleDateString('en-US', { month: 'short' })}</span>
                </button>
              ))}
            </span>
            <ChevronRightIcon className='w-7 cursor-pointer' />
          </div>
        </div>
        <button
          className='bg-primary text-white px-8 py-2 rounded hover:bg-primary/90 transition-all cursor-pointer'
          onClick={onBookHandler}
        >
          Book now
        </button>
      </div>
    </div>
  );
};

export default DateSeletor;
