import { StarIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import timeFormat from '../lib/timeFormat';

const imageURL = import.meta.env.VITE_TMDB_IMAGE_URL;

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  return (
    <div className='w-66 p-3 bg-gray-800 flex flex-col rounded-2xl hover:-translate-y-1 transition duration-300'>
      <img
        src={imageURL + movie.backdrop_path}
        alt=''
        className='h-52 w-full  cursor-pointer object-cover object-bottom-right rounded-lg'
        onClick={() => {
          scrollTo(0, 0);
          navigate(`/movie/${movie._id}`);
        }}
      />

      <p className='font-semibold mt-2 truncate'> {movie.title}</p>

      <p className='text-sm text-gray-400 mt-2'>
        {new Date(movie.release_date).getFullYear()} •{' '}
        {movie.genres
          .slice(0, 2)
          .map((genre) => genre.name)
          .join(' | ')}{' '}
        • {timeFormat(movie.runtime)}
      </p>

      <div className='flex items-center justify-between mt-4 pb-3'>
        <button
          className='bg-primary hover:bg-primary-dull rounded-full px-4 py-2 text-xs font-medium cursor-pointer transition'
          onClick={() => {
            scrollTo(0, 0);
            navigate(`/movie/${movie._id}`);
          }}
        >
          Buy Tickets
        </button>
        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
          <StarIcon className='w-4 h-4 text-primary fill-primary' /> {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
