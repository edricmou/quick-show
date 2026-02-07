import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlurCricle from '../components/BlurCricle';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSeletor from '../components/DateSeletor';
import MovieCard from '../components/MovieCard';
import Loading from '../components/loading';
import http from '../util/http.js';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const imageURL = import.meta.env.VITE_TMDB_IMAGE_URL;
const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const { id } = useParams();
  const { shows, fetchFavoriteMovies, favoriteMovies } = useAppContext();

  useEffect(() => {
    getData();
  }, [id]);

  const handleFavorite = async (id) => {
    await http.post('/api/user/update-favorite', { movieId: id });
    await fetchFavoriteMovies();
    toast.success('Favorite movies updated');
  };

  const getData = async () => {
    await http.get(`/api/show/${id}`).then(({ result, dateTime }) => {
      setMovie(result);
      setDateTime(dateTime);
    });
  };
  return movie ? (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50 '>
      {/* 电影封面 */}
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        <img
          src={imageURL + movie.poster_path}
          alt=''
          className='max-md:mx-auto h-104 max-w-70 object-cover rounded-xl'
        />
        <div className='flex flex-col gap-3 relative'>
          <BlurCricle
            top='-100px'
            left='-100px'
          />
          <p className='text-primary'>ENGLISH</p>
          <h1 className='text-4xl font-semibold max-w-96 text-balance'>{movie.title}</h1>
          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className='w-5 h-5 text-primary fill-primary' />
            {movie.vote_average.toFixed(1)} User Rating
          </div>

          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'> {movie.overview}</p>

          <p>
            {timeFormat(movie.runtime)} • {movie.genres.map((item) => item.name).join(', ')} •{' '}
            {new Date(movie.release_date).getFullYear()}
          </p>

          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
              <PlayCircleIcon className='w-5 h-5' />
              Watch Trailer
            </button>
            <a
              href='#dateSeletor'
              className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'
            >
              Buy Tickets
            </a>
            <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>
              <Heart
                className={`w-5 h-5 cursor-pointer  ${favoriteMovies.find((item) => item._id === movie._id) && 'text-primary fill-primary'}`}
                onClick={() => handleFavorite(movie._id)}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 演员表 */}
      <p className='text-lg font-medium mt-10'>Your Favorite Cast</p>
      <div className='overflow-x-auto mt-8 pb-4 no-scrollbar'>
        <div className='flex items-center gap-4 w-max px-4'>
          {movie.casts.map((item, index) => (
            <div
              className='flex flex-col items-center text-center gap-3'
              key={index}
            >
              <img
                src={imageURL + item.profile_path}
                alt=''
                className='h-20 md:h-20 object-cover aspect-square rounded-full'
              />
              <p className='text-xs font-medium'>{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 时间选择器 */}
      <div className='mt-10'>
        <DateSeletor
          dateTime={dateTime}
          id={id}
        />
      </div>

      {/* 你可能喜欢 */}
      <p className='text-lg font-medium mt-10 mb-8'>You May Also Like</p>
      <div className='flex flex-col md:flex-row gap-8 flex-wrap items-center'>
        {shows.slice(0, 4).map((item, index) => (
          <MovieCard
            movie={item}
            key={index}
          />
        ))}
      </div>

      {/* 查看更多 */}
      <div className='pt-10 flex justify-center'>
        <button className='bg-primary hover:bg-primary-dull transition font-medium rounded-md text-sm px-10 py-3 cursor-pointer'>
          Show More
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};
export default MovieDetails;
